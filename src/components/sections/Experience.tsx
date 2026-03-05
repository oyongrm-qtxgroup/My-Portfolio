import { motion } from "framer-motion";
import { MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExperience } from "@/hooks/useExperience";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PillBadge } from "@/components/ui/PillBadge";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";
import type { Experience as ExperienceType } from "@/types";

/* ── Timeline entry ──────────────────────────────── */
function TimelineEntry({
  entry,
  index,
  isLast,
}: {
  entry: ExperienceType;
  index: number;
  isLast: boolean;
}) {
  const isFirst = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.12,
        duration: 0.5,
        ease: "easeOut" as const,
      }}
      className="relative grid grid-cols-[80px_40px_1fr] gap-4 md:grid-cols-[140px_40px_1fr]"
    >
      {/* Period column */}
      <div className="pt-1 text-right">
        <span
          className={cn(
            "font-mono text-xs md:text-sm",
            isFirst ? "text-accent-cyan" : "text-text-muted",
          )}
        >
          {entry.period}
        </span>
        {entry.location && (
          <div className="mt-1 flex items-center justify-end gap-1">
            <MapPin className="h-3 w-3 text-text-muted" />
            <span className="font-mono text-[10px] text-text-muted">
              {entry.location}
            </span>
          </div>
        )}
      </div>

      {/* Timeline rail */}
      <div className="relative flex flex-col items-center">
        {/* Node dot */}
        <div
          className={cn(
            "relative z-10 mt-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2",
            isFirst
              ? "border-accent-cyan bg-accent-cyan/20"
              : "border-border-glow bg-bg-elevated",
          )}
        >
          {isFirst && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-30" />
          )}
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isFirst ? "bg-accent-cyan" : "bg-text-muted",
            )}
          />
        </div>

        {/* Vertical line */}
        {!isLast && (
          <motion.div
            className="w-px flex-1 bg-gradient-to-b from-border-glow to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.12 + 0.3,
              duration: 0.6,
              ease: "easeOut" as const,
            }}
            style={{ transformOrigin: "top" }}
          />
        )}
      </div>

      {/* Content card */}
      <div
        className={cn(
          "rounded-xl border p-5 mb-8 transition-all duration-300",
          isFirst
            ? "border-accent-cyan/20 bg-bg-elevated shadow-glow-cyan/5"
            : "border-[--color-border-custom] bg-bg-elevated/50 hover:border-border-glow hover:bg-bg-elevated",
        )}
      >
        {/* Company row */}
        <div className="flex items-center gap-3 mb-2">
          {entry.company_logo_url ? (
            <img
              src={entry.company_logo_url}
              alt={entry.company}
              className="h-8 w-8 rounded-lg object-contain border border-[--color-border-custom] bg-bg-primary p-0.5"
              loading="lazy"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[--color-border-custom] bg-bg-primary">
              <Briefcase className="h-4 w-4 text-text-muted" />
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              {entry.role}
            </h3>
            <p className="font-mono text-xs text-text-secondary">
              {entry.company}
            </p>
          </div>
        </div>

        {/* Description */}
        {entry.description && (
          <p className="mt-3 text-sm text-text-secondary leading-relaxed">
            {entry.description}
          </p>
        )}

        {/* Highlights */}
        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {entry.highlights.map((highlight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.12 + 0.2 + i * 0.05,
                  duration: 0.3,
                }}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-cyan" />
                {highlight}
              </motion.li>
            ))}
          </ul>
        )}

        {/* Tech stack pills */}
        {entry.tech_stack && entry.tech_stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {entry.tech_stack.map((tech) => (
              <PillBadge key={tech} label={tech} variant="cyan" size="sm" />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Empty state ──────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[--color-border-custom] bg-bg-elevated">
        <Briefcase className="h-7 w-7 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">
        No experience listed yet
      </h3>
      <p className="mt-1 text-sm text-text-muted">
        Experience entries will appear here once added.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPERIENCE SECTION
   ═══════════════════════════════════════════════════════ */
export function Experience() {
  const { experience, loading, error } = useExperience();

  return (
    <section id="experience" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          label="Experience"
          title="Professional Journey"
          subtitle="Building and shipping production AI systems across industries."
        />

        {/* Loading state */}
        {loading && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="ml-[120px] md:ml-[180px] rounded-xl border border-[--color-border-custom] bg-bg-elevated p-5"
              >
                <LoadingShimmer lines={4} />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-xl border border-accent-pink/30 bg-accent-pink/5 p-6 text-center">
            <p className="text-accent-pink font-medium">
              Failed to load experience
            </p>
            <p className="mt-1 text-sm text-text-muted">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && experience.length === 0 && <EmptyState />}

        {/* Timeline */}
        {!loading && !error && experience.length > 0 && (
          <div>
            {experience.map((entry, index) => (
              <TimelineEntry
                key={entry.id}
                entry={entry}
                index={index}
                isLast={index === experience.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
