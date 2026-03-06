import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Cloud,
  BarChart3,
  Monitor,
  Cpu,
  Layers,
  Shield,
  Cog,
  Users,
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
  "Cloud & AI Platforms": {
    icon: <Cloud className="h-5 w-5" />,
    gradient: "from-accent-purple to-accent-cyan",
    barFrom: "var(--color-accent-purple)",
    barTo: "var(--color-accent-cyan)",
  },
  "AI & Intelligent Automation": {
    icon: <Brain className="h-5 w-5" />,
    gradient: "from-accent-cyan to-accent-green",
    barFrom: "var(--color-accent-cyan)",
    barTo: "var(--color-accent-green)",
  },
  "Data & Analytics": {
    icon: <BarChart3 className="h-5 w-5" />,
    gradient: "from-accent-pink to-accent-purple",
    barFrom: "var(--color-accent-pink)",
    barTo: "var(--color-accent-purple)",
  },
  "Automation & Integration": {
    icon: <Cog className="h-5 w-5" />,
    gradient: "from-accent-orange to-accent-cyan",
    barFrom: "var(--color-accent-orange)",
    barTo: "var(--color-accent-cyan)",
  },
  "DevOps & Scalability": {
    icon: <Cpu className="h-5 w-5" />,
    gradient: "from-accent-orange to-accent-yellow",
    barFrom: "var(--color-accent-orange)",
    barTo: "var(--color-accent-yellow)",
  },
  "Web & Frontend": {
    icon: <Monitor className="h-5 w-5" />,
    gradient: "from-accent-green to-accent-cyan",
    barFrom: "var(--color-accent-green)",
    barTo: "var(--color-accent-cyan)",
  },
  "Security & Governance": {
    icon: <Shield className="h-5 w-5" />,
    gradient: "from-accent-pink to-accent-orange",
    barFrom: "var(--color-accent-pink)",
    barTo: "var(--color-accent-orange)",
  },
  "Leadership & Delivery": {
    icon: <Users className="h-5 w-5" />,
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

/* ── Skill chip — compact, modern badge ──────────── */
function SkillChip({
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        delay: index * 0.03,
        duration: 0.35,
        ease: "easeOut" as const,
      }}
      className="group relative flex items-center gap-2 rounded-lg border border-[--color-border-custom] bg-bg-primary/40 px-3 py-2 hover:border-accent-cyan/30 transition-colors"
    >
      {/* Accent bar (left edge) */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full"
        style={{
          height: "60%",
          background: `linear-gradient(180deg, ${barFrom}, ${barTo})`,
        }}
      />

      {skill.icon_url && (
        <img
          src={skill.icon_url}
          alt=""
          className="h-4 w-4 object-contain shrink-0"
          loading="lazy"
        />
      )}
      <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
        {skill.name}
      </span>
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

        {/* Skill chips */}
        <div className="flex flex-wrap gap-2">
          {skills
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((skill, i) => (
              <SkillChip
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
    <section
      id="skills"
      className="section-bg-skills px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="Skills & Expertise"
          title="Technical Arsenal"
          entrance="constellation"
          subtitle="From Azure AI and intelligent automation to enterprise systems and team leadership — tools I use to ship real-world solutions."
        />

        {/* Featured skills ribbon */}
        {featuredSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-wrap items-center gap-2"
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
