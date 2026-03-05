import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Project, IndustryFilter } from "@/types";

export function useProjects(filter: IndustryFilter = "All") {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true });

      if (filter && filter !== "All") {
        query = query.eq("industry", filter);
      }

      const { data, error: supaError } = await query;

      if (supaError) {
        throw supaError;
      }

      setProjects(data ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch projects";
      setError(message);
      console.error("useProjects error:", message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}

/** Returns unique industry values for filter bar */
export function useProjectIndustries() {
  const [industries, setIndustries] = useState<string[]>([]);

  useEffect(() => {
    const fetchIndustries = async () => {
      const { data } = await supabase
        .from("projects")
        .select("industry")
        .not("industry", "is", null);

      if (data) {
        const unique = [...new Set(data.map((d) => d.industry as string))];
        setIndustries(["All", ...unique.sort()]);
      }
    };
    fetchIndustries();
  }, []);

  return industries;
}
