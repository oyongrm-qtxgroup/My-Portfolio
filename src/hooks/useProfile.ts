import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from("profile")
        .select("*")
        .limit(1)
        .single();

      if (supaError) throw supaError;
      setProfile(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch profile";
      setError(message);
      console.error("useProfile error:", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}
