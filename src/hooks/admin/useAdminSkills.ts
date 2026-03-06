import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Skill } from "@/types";

type SkillInput = Omit<Skill, "id">;

export function useAdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true });
    if (err) setError(err.message);
    else setSkills(data ?? []);
    setLoading(false);
  }, []);

  const create = useCallback(
    async (input: SkillInput) => {
      const { error: err } = await supabase.from("skills").insert(input);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  const update = useCallback(
    async (id: string, input: Partial<SkillInput>) => {
      const { error: err } = await supabase
        .from("skills")
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
        .from("skills")
        .delete()
        .eq("id", id);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  return { skills, loading, error, fetchAll, create, update, remove };
}
