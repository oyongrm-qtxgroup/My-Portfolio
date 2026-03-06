import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

type ProfileInput = Omit<Profile, "id" | "updated_at">;

export function useAdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .single();
    if (err && err.code !== "PGRST116") setError(err.message);
    else setProfile(data);
    setLoading(false);
  }, []);

  /**
   * Upsert — if a profile row exists, update it; otherwise insert a new one.
   */
  const upsert = useCallback(
    async (input: ProfileInput) => {
      if (profile) {
        const { error: err } = await supabase
          .from("profile")
          .update({ ...input, updated_at: new Date().toISOString() })
          .eq("id", profile.id);
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await supabase.from("profile").insert(input);
        if (err) throw new Error(err.message);
      }
      await fetchProfile();
    },
    [profile, fetchProfile],
  );

  return { profile, loading, error, fetchProfile, upsert };
}
