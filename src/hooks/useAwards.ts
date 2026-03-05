import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Award } from "@/types";

export function useAwards() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAwards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from("awards")
        .select("*")
        .order("order_index", { ascending: true });

      if (supaError) {
        throw supaError;
      }

      setAwards(data ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch awards";
      setError(message);
      console.error("useAwards error:", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAwards();
  }, [fetchAwards]);

  return { awards, loading, error, refetch: fetchAwards };
}
