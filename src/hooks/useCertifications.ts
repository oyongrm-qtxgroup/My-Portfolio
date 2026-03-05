import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Certification } from "@/types";

export function useCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from("certifications")
        .select("*")
        .order("order_index", { ascending: true });

      if (supaError) {
        throw supaError;
      }

      setCertifications(data ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch certifications";
      setError(message);
      console.error("useCertifications error:", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  return { certifications, loading, error, refetch: fetchCertifications };
}
