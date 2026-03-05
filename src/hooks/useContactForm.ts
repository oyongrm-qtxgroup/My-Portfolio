import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ContactSubmission } from "@/types";

interface UseContactFormReturn {
  submitting: boolean;
  success: boolean;
  error: string | null;
  submit: (data: ContactSubmission) => Promise<void>;
  reset: () => void;
}

export function useContactForm(): UseContactFormReturn {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: ContactSubmission) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Save to database
      const { error: supaError } = await supabase
        .from("contact_submissions")
        .insert([
          {
            name: data.name,
            email: data.email,
            message: data.message,
          },
        ]);

      if (supaError) {
        throw supaError;
      }

      // 2. Send email notification via Edge Function (fire-and-forget)
      //    We don't block success on email delivery — the message is already saved.
      supabase.functions
        .invoke("send-contact-email", {
          body: {
            name: data.name,
            email: data.email,
            message: data.message,
            turnstileToken: data.turnstileToken,
          },
        })
        .then(({ error: fnError }) => {
          if (fnError) {
            console.warn(
              "Email notification failed (message still saved):",
              fnError.message,
            );
          }
        })
        .catch((err) => {
          console.warn("Email notification failed (message still saved):", err);
        });

      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send message";
      setError(message);
      console.error("useContactForm error:", message);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setError(null);
  };

  return { submitting, success, error, submit, reset };
}
