import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Education } from "@/types";

type EducationInput = Omit<Education, "id">;

export function useAdminEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("education")
      .select("*")
      .order("order_index", { ascending: true });
    if (err) setError(err.message);
    else setEducation(data ?? []);
    setLoading(false);
  }, []);

  const create = useCallback(
    async (input: EducationInput) => {
      const { error: err } = await supabase.from("education").insert(input);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  const update = useCallback(
    async (id: string, input: Partial<EducationInput>) => {
      const { error: err } = await supabase
        .from("education")
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
        .from("education")
        .delete()
        .eq("id", id);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  return { education, loading, error, fetchAll, create, update, remove };
}
