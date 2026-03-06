import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  FolderKanban,
  Briefcase,
  Cpu,
  BookOpen,
  Award,
  Trophy,
  Mail,
  Loader2,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface StatCard {
  label: string;
  value: number | null;
  icon: LucideIcon;
  to: string;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      const [
        projects,
        experience,
        skills,
        blog,
        blogPublished,
        certs,
        awards,
        messages,
      ] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase
          .from("experience")
          .select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase
          .from("blog_posts")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("blog_posts")
          .select("id", { count: "exact", head: true })
          .eq("is_published", true),
        supabase
          .from("certifications")
          .select("id", { count: "exact", head: true }),
        supabase.from("awards").select("id", { count: "exact", head: true }),
        supabase
          .from("contact_submissions")
          .select("id", { count: "exact", head: true }),
      ]);

      setStats({
        projects: projects.count,
        experience: experience.count,
        skills: skills.count,
        blog: blog.count,
        blogPublished: blogPublished.count,
        certifications: certs.count,
        awards: awards.count,
        messages: messages.count,
      });
      setLoading(false);
    }
    fetchCounts();
  }, []);

  const cards: StatCard[] = [
    {
      label: "Projects",
      value: stats.projects ?? null,
      icon: FolderKanban,
      to: "/admin/projects",
      color: "text-accent-cyan",
    },
    {
      label: "Experience",
      value: stats.experience ?? null,
      icon: Briefcase,
      to: "/admin/experience",
      color: "text-accent-green",
    },
    {
      label: "Skills",
      value: stats.skills ?? null,
      icon: Cpu,
      to: "/admin/skills",
      color: "text-accent-purple",
    },
    {
      label: "Blog Posts",
      value: stats.blog ?? null,
      icon: BookOpen,
      to: "/admin/blog",
      color: "text-accent-orange",
    },
    {
      label: "Certifications",
      value: stats.certifications ?? null,
      icon: Award,
      to: "/admin/certifications",
      color: "text-accent-yellow",
    },
    {
      label: "Awards",
      value: stats.awards ?? null,
      icon: Trophy,
      to: "/admin/awards",
      color: "text-accent-pink",
    },
    {
      label: "Messages",
      value: stats.messages ?? null,
      icon: Mail,
      to: "/admin/messages",
      color: "text-accent-cyan",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 font-mono text-xs text-text-secondary">
          Overview of your portfolio data
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-accent-cyan" />
          <span className="font-mono text-sm text-text-secondary">
            Loading stats…
          </span>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className="group rounded-xl border border-border-custom bg-bg-secondary p-5 transition-all hover:border-accent-cyan/30 hover:shadow-glow-cyan"
            >
              <div className="flex items-center justify-between">
                <card.icon className={`h-5 w-5 ${card.color}`} />
                <span className="font-display text-2xl font-bold">
                  {card.value ?? "–"}
                </span>
              </div>
              <p className="mt-2 font-mono text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                {card.label}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Quick info */}
      <div className="rounded-xl border border-border-custom bg-bg-secondary p-5">
        <h2 className="mb-2 font-display text-sm font-semibold">Quick Info</h2>
        <div className="space-y-1 font-mono text-xs text-text-secondary">
          <p>
            Published blog posts:{" "}
            <span className="text-accent-green">
              {stats.blogPublished ?? "–"}
            </span>{" "}
            / {stats.blog ?? "–"}
          </p>
          <p>Use the sidebar to manage each section of your portfolio.</p>
        </div>
      </div>
    </div>
  );
}
