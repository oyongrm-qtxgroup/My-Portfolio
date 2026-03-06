import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export function useAdminContacts() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setMessages(data ?? []);
    setLoading(false);
  }, []);

  const remove = useCallback(
    async (id: string) => {
      const { error: err } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  return { messages, loading, error, fetchAll, remove };
}
