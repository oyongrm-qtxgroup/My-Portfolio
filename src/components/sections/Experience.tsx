import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExperience } from "@/hooks/useExperience";
import { useDeviceTier } from "@/contexts/DeviceCapabilityContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PillBadge } from "@/components/ui/PillBadge";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";
import type { Experience as ExperienceType } from "@/types";

/* ── Animated SVG timeline rail ─────────────────── */
function TimelineSVGRail({
  count,
  scrollYProgress,
}: {
  count: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each chapter is ~320px tall, gap between nodes ≈ 280px
  const totalHeight = count * 280 + 60;
  const pathD = `M 20 20 L 20 ${totalHeight}`;
  const pathLength = totalHeight - 20;

  const dashOffset = useTransform(scrollYProgress, [0, 1], [pathLength, 0]);

  const smoothDash = useSpring(dashOffset, { stiffness: 80, damping: 30 });

  // Particle positions along path
  const particle1Y = useTransform(scrollYProgress, [0, 1], [20, totalHeight]);
  const particle2Y = useTransform(
    scrollYProgress,
    [0.05, 1],
    [20, totalHeight],
  );
  const particle3Y = useTransform(scrollYProgress, [0.1, 1], [20, totalHeight]);

  return (
    <svg
      className="absolute left-[19px] top-0 w-[40px] pointer-events-none z-0"
      style={{ height: totalHeight }}
      viewBox={`0 0 40 ${totalHeight}`}
      fill="none"
    >
      {/* Background track */}
      <path
        d={pathD}
        stroke="var(--color-border-glow)"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.3"
      />

      {/* Animated draw-on path */}
      <motion.path
        d={pathD}
        stroke="url(#timeline-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        style={{ strokeDashoffset: smoothDash }}
      />

      {/* Glow on drawn path */}
      <motion.path
        d={pathD}
        stroke="var(--color-accent-cyan)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        style={{ strokeDashoffset: smoothDash }}
        opacity="0.15"
        filter="blur(4px)"
      />

      {/* Connection particles */}
      <motion.circle
        cx="20"
        style={{ cy: particle1Y }}
        r="3"
        fill="var(--color-accent-cyan)"
        opacity="0.9"
      />
      <motion.circle
        cx="20"
        style={{ cy: particle2Y }}
        r="2"
        fill="var(--color-accent-cyan)"
        opacity="0.5"
      />
      <motion.circle
        cx="20"
        style={{ cy: particle3Y }}
        r="1.5"
        fill="var(--color-accent-green)"
        opacity="0.4"
      />

      {/* Node dots at each entry */}
      {Array.from({ length: count }).map((_, i) => {
        const cy = 30 + i * 280;
        return (
          <g key={i}>
            {/* Outer glow ring for first (current) entry */}
            {i === 0 && (
              <circle
                cx="20"
                cy={cy}
                r="10"
                fill="none"
                stroke="var(--color-accent-cyan)"
                strokeWidth="1"
                opacity="0.4"
              >
                <animate
                  attributeName="r"
                  values="8;14;8"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0.1;0.4"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx="20"
              cy={cy}
              r="5"
              fill={
                i === 0
                  ? "var(--color-accent-cyan)"
                  : "var(--color-bg-elevated)"
              }
              stroke={
                i === 0
                  ? "var(--color-accent-cyan)"
                  : "var(--color-border-glow)"
              }
              strokeWidth="2"
            />
            <circle
              cx="20"
              cy={cy}
              r="2"
              fill={
                i === 0 ? "var(--color-bg-primary)" : "var(--color-text-muted)"
              }
            />
          </g>
        );
      })}

      <defs>
        <linearGradient id="timeline-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-cyan)" />
          <stop offset="60%" stopColor="var(--color-accent-purple)" />
          <stop offset="100%" stopColor="var(--color-accent-pink)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Chapter card (single experience entry) ──────── */
function ChapterCard({
  entry,
  index,
  progress,
  isReduced,
}: {
  entry: ExperienceType;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  isReduced: boolean;
}) {
  const isCurrent = index === 0;

  // Each entry occupies 1/count of total scroll
  const count = 10; // safe upper bound
  const entryStart = index / count;
  const entryMid = (index + 0.5) / count;
  const entryEnd = (index + 1) / count;

  // Scale + opacity based on scroll progress (chapter gains prominence near center)
  const scale = useTransform(
    progress,
    [Math.max(0, entryStart - 0.05), entryMid, Math.min(1, entryEnd + 0.05)],
    isReduced ? [1, 1, 1] : [0.95, 1, 0.97],
  );

  const opacity = useTransform(
    progress,
    [
      Math.max(0, entryStart - 0.1),
      entryStart,
      entryEnd,
      Math.min(1, entryEnd + 0.1),
    ],
    isReduced ? [1, 1, 1, 1] : [0.4, 1, 1, 0.6],
  );

  // Parallax: tech stack pills float at mid-depth
  const techY = useTransform(
    progress,
    [entryStart, entryEnd],
    isReduced ? [0, 0] : [10, -10],
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut",
      }}
      style={{ scale, opacity }}
      className="relative pl-14 md:pl-16 mb-12"
    >
      {/* Parallax: company logo as faded background (Z-back layer) */}
      {entry.company_logo_url && !isReduced && (
        <motion.div
          className="absolute -right-4 -top-4 z-0 pointer-events-none select-none"
          style={{
            y: useTransform(progress, [entryStart, entryEnd], [20, -20]),
          }}
        >
          <img
            src={entry.company_logo_url}
            alt=""
            aria-hidden
            className="h-24 w-24 object-contain opacity-[0.06] blur-[1px]"
            loading="lazy"
          />
        </motion.div>
      )}

      {/* Content card (Z-front layer) */}
      <div
        className={cn(
          "relative z-10 rounded-xl border p-5 md:p-6 transition-all duration-500",
          isCurrent
            ? "border-accent-cyan/30 bg-bg-elevated/90 shadow-glow-cyan/10 holographic-shine"
            : "border-[--color-border-custom] bg-bg-elevated/60 hover:border-border-glow hover:bg-bg-elevated/80",
        )}
      >
        {/* Breathing glow for current role */}
        {isCurrent && (
          <div className="absolute inset-0 rounded-xl border border-accent-cyan/20 animate-pulse pointer-events-none" />
        )}

        {/* Header row */}
        <div className="flex items-start gap-3 mb-2">
          {entry.company_logo_url ? (
            <img
              src={entry.company_logo_url}
              alt={entry.company}
              className="h-10 w-10 rounded-lg object-contain border border-[--color-border-custom] bg-bg-primary p-0.5 shrink-0"
              loading="lazy"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[--color-border-custom] bg-bg-primary shrink-0">
              <Briefcase className="h-5 w-5 text-text-muted" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "text-lg font-semibold",
                isCurrent ? "text-accent-cyan" : "text-text-primary",
              )}
            >
              {entry.role}
            </h3>
            <p className="font-mono text-xs text-text-secondary">
              {entry.company}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span
              className={cn(
                "font-mono text-xs",
                isCurrent ? "text-accent-cyan" : "text-text-muted",
              )}
            >
              {entry.period}
            </span>
            {entry.location && (
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-text-muted" />
                <span className="font-mono text-[10px] text-text-muted">
                  {entry.location}
                </span>
              </div>
            )}
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
                  delay: index * 0.1 + 0.15 + i * 0.04,
                  duration: 0.3,
                }}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    isCurrent ? "bg-accent-cyan" : "bg-accent-purple",
                  )}
                />
                {highlight}
              </motion.li>
            ))}
          </ul>
        )}

        {/* Tech stack at mid-depth with parallax */}
        {entry.tech_stack && entry.tech_stack.length > 0 && (
          <motion.div
            className="mt-4 flex flex-wrap gap-1.5 relative z-5"
            style={{ y: techY }}
          >
            {entry.tech_stack.map((tech) => (
              <PillBadge
                key={tech}
                label={tech}
                variant={isCurrent ? "cyan" : "purple"}
                size="sm"
              />
            ))}
          </motion.div>
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
  const tier = useDeviceTier();
  const isReduced = tier === "low";

  // Scroll-linked progress for the entire timeline container
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      id="experience"
      className="section-bg-experience px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          label="Experience"
          title="Professional Journey"
          entrance="timeline"
          subtitle="7+ years of building and shipping production systems — from enterprise automation to AI-powered solutions."
        />

        {/* Loading state */}
        {loading && (
          <div className="space-y-6 pl-14">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-[--color-border-custom] bg-bg-elevated p-5"
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

        {/* Scroll-linked immersive timeline */}
        {!loading && !error && experience.length > 0 && (
          <div ref={containerRef} className="relative">
            {/* Animated SVG rail */}
            {!isReduced && (
              <TimelineSVGRail
                count={experience.length}
                scrollYProgress={scrollYProgress}
              />
            )}

            {/* Simpler static rail for low tier */}
            {isReduced && (
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/40 via-accent-purple/30 to-transparent z-0" />
            )}

            {/* Chapter cards */}
            {experience.map((entry, index) => (
              <ChapterCard
                key={entry.id}
                entry={entry}
                index={index}
                progress={scrollYProgress}
                isReduced={isReduced}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
