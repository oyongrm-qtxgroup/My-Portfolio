import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/types";

type ProjectInput = Omit<Project, "id" | "created_at">;

export function useAdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });
    if (err) setError(err.message);
    else setProjects(data ?? []);
    setLoading(false);
  }, []);

  const create = useCallback(
    async (input: ProjectInput) => {
      const { error: err } = await supabase.from("projects").insert(input);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  const update = useCallback(
    async (id: string, input: Partial<ProjectInput>) => {
      const { error: err } = await supabase
        .from("projects")
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
        .from("projects")
        .delete()
        .eq("id", id);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  /** Batch-update order_index for a reordered list of projects */
  const reorder = useCallback(async (ordered: Project[]) => {
    // Assign sequential order_index values and optimistically update local state
    const updated = ordered.map((p, idx) => ({ ...p, order_index: idx }));
    setProjects(updated);

    // Persist each new order_index to Supabase
    const results = await Promise.all(
      updated.map(({ id, order_index }) =>
        supabase.from("projects").update({ order_index }).eq("id", id),
      ),
    );

    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);
  }, []);

  return {
    projects,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    reorder,
  };
}
