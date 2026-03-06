import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Education } from "@/types";

export function useEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEducation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from("education")
        .select("*")
        .order("order_index", { ascending: true });

      if (supaError) throw supaError;
      setEducation(data ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch education";
      setError(message);
      console.error("useEducation error:", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  return { education, loading, error, refetch: fetchEducation };
}
