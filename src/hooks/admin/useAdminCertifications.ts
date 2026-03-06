import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Certification } from "@/types";

type CertificationInput = Omit<Certification, "id">;

export function useAdminCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("certifications")
      .select("*")
      .order("order_index", { ascending: true });
    if (err) setError(err.message);
    else setCertifications(data ?? []);
    setLoading(false);
  }, []);

  const create = useCallback(
    async (input: CertificationInput) => {
      const { error: err } = await supabase
        .from("certifications")
        .insert(input);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  const update = useCallback(
    async (id: string, input: Partial<CertificationInput>) => {
      const { error: err } = await supabase
        .from("certifications")
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
        .from("certifications")
        .delete()
        .eq("id", id);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  return { certifications, loading, error, fetchAll, create, update, remove };
}
