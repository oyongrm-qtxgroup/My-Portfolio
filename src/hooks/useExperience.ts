import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Experience } from "@/types";

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

/**
 * Parse the start date from a period string like "Jan 2026 – Present"
 * and return a timestamp for sorting. Returns Infinity for unparseable values
 * so they sink to the bottom when sorting newest-first.
 */
function periodToTimestamp(period: string): number {
  const match = period.match(/^(\w{3})\s+(\d{4})/);
  if (!match) return -Infinity;
  const month = MONTHS[match[1]] ?? 0;
  const year = parseInt(match[2], 10);
  return new Date(year, month).getTime();
}

/** Sort experience entries by period, newest first */
export function sortExperienceByPeriod(items: Experience[]): Experience[] {
  return [...items].sort(
    (a, b) => periodToTimestamp(b.period) - periodToTimestamp(a.period),
  );
}

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
        .select("*");

      if (supaError) {
        throw supaError;
      }

      setExperience(sortExperienceByPeriod(data ?? []));
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
