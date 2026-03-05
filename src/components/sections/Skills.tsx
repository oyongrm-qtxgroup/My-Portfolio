import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Cloud,
  Server,
  BarChart3,
  Monitor,
  Database,
  Cpu,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSkills } from "@/hooks/useSkills";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";
import type { Skill } from "@/types";

/* ── Category → icon + accent color ──────────────── */
const categoryMeta: Record<
  string,
  {
    icon: React.ReactNode;
    gradient: string;
    barFrom: string;
    barTo: string;
  }
> = {
  "AI/ML": {
    icon: <Brain className="h-5 w-5" />,
    gradient: "from-accent-cyan to-accent-green",
    barFrom: "var(--color-accent-cyan)",
    barTo: "var(--color-accent-green)",
  },
  Cloud: {
    icon: <Cloud className="h-5 w-5" />,
    gradient: "from-accent-purple to-accent-cyan",
    barFrom: "var(--color-accent-purple)",
    barTo: "var(--color-accent-cyan)",
  },
  Backend: {
    icon: <Server className="h-5 w-5" />,
    gradient: "from-accent-orange to-accent-pink",
    barFrom: "var(--color-accent-orange)",
    barTo: "var(--color-accent-pink)",
  },
  Frontend: {
    icon: <Monitor className="h-5 w-5" />,
    gradient: "from-accent-green to-accent-cyan",
    barFrom: "var(--color-accent-green)",
    barTo: "var(--color-accent-cyan)",
  },
  Data: {
    icon: <BarChart3 className="h-5 w-5" />,
    gradient: "from-accent-pink to-accent-purple",
    barFrom: "var(--color-accent-pink)",
    barTo: "var(--color-accent-purple)",
  },
  DevOps: {
    icon: <Cpu className="h-5 w-5" />,
    gradient: "from-accent-orange to-accent-yellow",
    barFrom: "var(--color-accent-orange)",
    barTo: "var(--color-accent-yellow)",
  },
  Database: {
    icon: <Database className="h-5 w-5" />,
    gradient: "from-accent-cyan to-accent-purple",
    barFrom: "var(--color-accent-cyan)",
    barTo: "var(--color-accent-purple)",
  },
};

const defaultMeta = {
  icon: <Layers className="h-5 w-5" />,
  gradient: "from-accent-cyan to-accent-green",
  barFrom: "var(--color-accent-cyan)",
  barTo: "var(--color-accent-green)",
};

/* ── Animated skill bar ──────────────────────────── */
function SkillBar({
  skill,
  index,
  barFrom,
  barTo,
}: {
  skill: Skill;
  index: number;
  barFrom: string;
  barTo: string;
}) {
  const proficiency = skill.proficiency ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: "easeOut" as const,
      }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {skill.icon_url && (
            <img
              src={skill.icon_url}
              alt=""
              className="h-4 w-4 object-contain"
              loading="lazy"
            />
          )}
          <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
            {skill.name}
          </span>
        </div>
        {proficiency > 0 && (
          <span className="font-mono text-[10px] text-text-muted">
            {proficiency}%
          </span>
        )}
      </div>

      {/* Bar track */}
      <div className="h-1.5 w-full rounded-full bg-bg-primary/60 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${barFrom}, ${barTo})`,
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            delay: index * 0.05 + 0.2,
            duration: 0.8,
            ease: "easeOut" as const,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ── Category card ───────────────────────────────── */
function SkillCategoryCard({
  category,
  skills,
  index,
}: {
  category: string;
  skills: Skill[];
  index: number;
}) {
  const meta = categoryMeta[category] ?? defaultMeta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut" as const,
      }}
    >
      <GlowCard className="h-full group">
        {/* Category header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              "bg-gradient-to-br",
              meta.gradient,
              "text-bg-primary",
            )}
          >
            {meta.icon}
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              {category}
            </h3>
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
              {skills.length} skill{skills.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Skill bars */}
        <div className="space-y-3">
          {skills
            .sort((a, b) => (b.proficiency ?? 0) - (a.proficiency ?? 0))
            .map((skill, i) => (
              <SkillBar
                key={skill.id}
                skill={skill}
                index={i}
                barFrom={meta.barFrom}
                barTo={meta.barTo}
              />
            ))}
        </div>
      </GlowCard>
    </motion.div>
  );
}

/* ── Empty state ──────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[--color-border-custom] bg-bg-elevated">
        <Layers className="h-7 w-7 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">
        No skills listed yet
      </h3>
      <p className="mt-1 text-sm text-text-muted">
        Skills will appear here once added to the database.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN SKILLS SECTION
   ═══════════════════════════════════════════════════════ */
export function Skills() {
  const { grouped, loading, error, skills } = useSkills();

  const categories = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  // Featured skills to highlight
  const featuredSkills = useMemo(
    () => skills.filter((s) => s.is_featured),
    [skills],
  );

  return (
    <section id="skills" className="px-4 py-24 sm:px-6 lg:px-8 bg-bg-secondary">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="Skills & Expertise"
          title="Technical Arsenal"
          subtitle="A comprehensive toolkit spanning AI/ML, cloud infrastructure, backend systems, and modern frontend frameworks."
        />

        {/* Featured skills ribbon */}
        {featuredSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-wrap gap-2"
          >
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest self-center mr-2">
              Top Skills
            </span>
            {featuredSkills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/5 px-3 py-1 font-mono text-xs text-accent-cyan"
              >
                {skill.icon_url && (
                  <img
                    src={skill.icon_url}
                    alt=""
                    className="h-3 w-3 object-contain"
                  />
                )}
                {skill.name}
              </span>
            ))}
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-[--color-border-custom] bg-bg-elevated p-6"
              >
                <LoadingShimmer lines={5} />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-xl border border-accent-pink/30 bg-accent-pink/5 p-6 text-center">
            <p className="text-accent-pink font-medium">
              Failed to load skills
            </p>
            <p className="mt-1 text-sm text-text-muted">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && skills.length === 0 && <EmptyState />}

        {/* Skills grid */}
        {!loading && !error && categories.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <SkillCategoryCard
                key={category}
                category={category}
                skills={grouped[category]}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
