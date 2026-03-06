import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type {
  Profile,
  Education,
  Experience,
  Skill,
  Certification,
  Award,
} from "@/types";

export function useDownloadCV() {
  const [downloading, setDownloading] = useState(false);

  const download = useCallback(async () => {
    setDownloading(true);
    try {
      // Fetch all data in parallel
      const [
        profileRes,
        educationRes,
        experienceRes,
        skillsRes,
        certificationsRes,
        awardsRes,
      ] = await Promise.all([
        supabase.from("profile").select("*").limit(1).single(),
        supabase
          .from("education")
          .select("*")
          .order("order_index", { ascending: true }),
        supabase.from("experience").select("*"),
        supabase.from("skills").select("*"),
        supabase
          .from("certifications")
          .select("*")
          .order("order_index", { ascending: true }),
        supabase
          .from("awards")
          .select("*")
          .order("order_index", { ascending: true }),
      ]);

      if (profileRes.error) throw profileRes.error;

      const profile = profileRes.data as Profile;
      const education = (educationRes.data ?? []) as Education[];
      const experience = (experienceRes.data ?? []) as Experience[];
      const skills = (skillsRes.data ?? []) as Skill[];
      const certifications = (certificationsRes.data ?? []) as Certification[];
      const awards = (awardsRes.data ?? []) as Award[];

      // Sort experience newest-first (same logic as useExperience)
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
      const toTs = (period: string) => {
        const m = period.match(/^(\w{3})\s+(\d{4})/);
        if (!m) return -Infinity;
        return new Date(parseInt(m[2], 10), MONTHS[m[1]] ?? 0).getTime();
      };
      experience.sort((a, b) => toTs(b.period) - toTs(a.period));

      // Dynamic import to keep the main bundle small
      const { generateCV } = await import("@/lib/generateCV");
      const doc = generateCV({
        profile,
        education,
        experience,
        skills,
        certifications,
        awards,
      });

      // Build filename: "Raymundo_Oyong_CV.pdf"
      const safeName = profile.full_name.replace(/\s+/g, "_");
      doc.save(`${safeName}_CV.pdf`);
    } catch (err) {
      console.error("CV download failed:", err);
      throw err;
    } finally {
      setDownloading(false);
    }
  }, []);

  return { download, downloading };
}
