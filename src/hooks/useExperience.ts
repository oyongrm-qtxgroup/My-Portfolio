import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Experience } from "@/types";

export function useExperience() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperience = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from("experience")
        .select("*")
        .order("order_index", { ascending: true });

      if (supaError) {
        throw supaError;
      }

      setExperience(data ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch experience";
      setError(message);
      console.error("useExperience error:", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  return { experience, loading, error, refetch: fetchExperience };
}
