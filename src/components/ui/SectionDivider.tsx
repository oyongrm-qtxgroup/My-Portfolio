import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type DividerVariant =
  | "cyan-to-green"
  | "green-to-purple"
  | "purple-to-orange"
  | "orange-to-cyan"
  | "cyan-to-pink"
  | "pink-to-green";

interface SectionDividerProps {
  variant?: DividerVariant;
  /** Flip the wave upside-down */
  flip?: boolean;
}

const gradients: Record<DividerVariant, [string, string]> = {
  "cyan-to-green": ["var(--color-accent-cyan)", "var(--color-accent-green)"],
  "green-to-purple": [
    "var(--color-accent-green)",
    "var(--color-accent-purple)",
  ],
  "purple-to-orange": [
    "var(--color-accent-purple)",
    "var(--color-accent-orange)",
  ],
  "orange-to-cyan": ["var(--color-accent-orange)", "var(--color-accent-cyan)"],
  "cyan-to-pink": ["var(--color-accent-cyan)", "var(--color-accent-pink)"],
  "pink-to-green": ["var(--color-accent-pink)", "var(--color-accent-green)"],
};

/**
 * Animated SVG wave divider between sections.
 * - Morphs opacity + translateY on scroll
 * - Gradient shifts color temperature between sections
 */
export function SectionDivider({
  variant = "cyan-to-green",
  flip = false,
}: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [from, to] = gradients[variant];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 0.8, 0.8, 0],
  );
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20]);

  const gradientId = `divider-grad-${variant}`;

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className="relative w-full overflow-hidden pointer-events-none select-none"
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-12 md:h-16 lg:h-20"
        style={flip ? { transform: "scaleY(-1)" } : undefined}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={from} stopOpacity="0.4" />
            <stop offset="50%" stopColor={to} stopOpacity="0.6" />
            <stop offset="100%" stopColor={from} stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Primary wave */}
        <path
          d="M0 40 Q 180 10, 360 40 T 720 40 T 1080 40 T 1440 40 L 1440 80 L 0 80 Z"
          fill={`url(#${gradientId})`}
          opacity="0.15"
        />

        {/* Secondary offset wave */}
        <path
          d="M0 50 Q 240 20, 480 50 T 960 50 T 1440 50 L 1440 80 L 0 80 Z"
          fill={`url(#${gradientId})`}
          opacity="0.08"
        />

        {/* Thin line accent */}
        <path
          d="M0 38 Q 180 8, 360 38 T 720 38 T 1080 38 T 1440 38"
          stroke={`url(#${gradientId})`}
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Subtle glow beneath */}
      <div
        className="absolute bottom-0 left-1/4 right-1/4 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${from}40, ${to}40, transparent)`,
        }}
      />
    </motion.div>
  );
}
