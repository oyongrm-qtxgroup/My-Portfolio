import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Award } from "@/types";

type AwardInput = Omit<Award, "id">;

export function useAdminAwards() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("awards")
      .select("*")
      .order("order_index", { ascending: true });
    if (err) setError(err.message);
    else setAwards(data ?? []);
    setLoading(false);
  }, []);

  const create = useCallback(
    async (input: AwardInput) => {
      const { error: err } = await supabase.from("awards").insert(input);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  const update = useCallback(
    async (id: string, input: Partial<AwardInput>) => {
      const { error: err } = await supabase
        .from("awards")
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
        .from("awards")
        .delete()
        .eq("id", id);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  return { awards, loading, error, fetchAll, create, update, remove };
}
