import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type EntranceVariant =
  | "default"
  | "spread" // Projects: items spread from center
  | "constellation" // Skills: nodes build in
  | "timeline" // Experience: slide from left
  | "unlock" // Certs: burst in
  | "cascade" // Blog: waterfall pattern
  | "terminal"; // Contact: line-by-line boot

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  entrance?: EntranceVariant;
}

const containerVariants: Record<EntranceVariant, Variants> = {
  default: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  },
  spread: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  },
  constellation: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  },
  timeline: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  },
  unlock: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  },
  cascade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
  },
  terminal: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
  },
};

const itemVariantMap: Record<EntranceVariant, Variants> = {
  default: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  },
  spread: {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  },
  constellation: {
    hidden: { opacity: 0, scale: 0.8, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },
  timeline: {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  },
  unlock: {
    hidden: { opacity: 0, scale: 0.85, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  },
  cascade: {
    hidden: { opacity: 0, y: 30, x: -10 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  },
  terminal: {
    hidden: { opacity: 0, y: 8, filter: "blur(2px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },
};

export function SectionHeader({
  label,
  title,
  subtitle,
  align = "left",
  className,
  entrance = "default",
}: SectionHeaderProps) {
  const cVariants = containerVariants[entrance];
  const iVariants = itemVariantMap[entrance];

  return (
    <motion.div
      variants={cVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn("mb-12", align === "center" && "text-center", className)}
    >
      {/* Glow line */}
      <motion.div
        variants={iVariants}
        className={cn(
          "h-px w-16 bg-linear-to-r from-accent-cyan to-transparent mb-4",
          align === "center" && "mx-auto",
        )}
      />

      {/* Label pill */}
      <motion.span
        variants={iVariants}
        className="inline-block font-mono text-xs uppercase tracking-widest text-accent-cyan"
      >
        {label}
      </motion.span>

      {/* Title */}
      <motion.h2
        variants={iVariants}
        className="text-3xl md:text-4xl font-bold text-text-primary mt-2"
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          variants={iVariants}
          className={cn(
            "text-text-secondary mt-3 max-w-2xl text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
