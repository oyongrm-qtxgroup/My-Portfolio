import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Skill } from "@/types";

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true });

      if (supaError) {
        throw supaError;
      }

      setSkills(data ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch skills";
      setError(message);
      console.error("useSkills error:", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  /** Group skills by category for rendering */
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return { skills, grouped, loading, error, refetch: fetchSkills };
}
