import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Experience } from "@/types";
import { sortExperienceByPeriod } from "@/hooks/useExperience";

type ExperienceInput = Omit<Experience, "id">;

export function useAdminExperience() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.from("experience").select("*");
    if (err) setError(err.message);
    else setExperience(sortExperienceByPeriod(data ?? []));
    setLoading(false);
  }, []);

  const create = useCallback(
    async (input: ExperienceInput) => {
      const { error: err } = await supabase.from("experience").insert(input);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  const update = useCallback(
    async (id: string, input: Partial<ExperienceInput>) => {
      const { error: err } = await supabase
        .from("experience")
        .update(input)
        .eq("id", id);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  const remove = useCallback(
    async (id: string) => {
      const { error: err } = await supabase
        .from("experience")
        .delete()
        .eq("id", id);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  return { experience, loading, error, fetchAll, create, update, remove };
}
