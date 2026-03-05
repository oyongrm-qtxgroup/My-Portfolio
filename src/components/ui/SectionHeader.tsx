import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function SectionHeader({
  label,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn("mb-12", align === "center" && "text-center", className)}
    >
      {/* Glow line */}
      <motion.div
        variants={itemVariants}
        className={cn(
          "h-px w-16 bg-linear-to-r from-accent-cyan to-transparent mb-4",
          align === "center" && "mx-auto",
        )}
      />

      {/* Label pill */}
      <motion.span
        variants={itemVariants}
        className="inline-block font-mono text-xs uppercase tracking-widest text-accent-cyan"
      >
        {label}
      </motion.span>

      {/* Title */}
      <motion.h2
        variants={itemVariants}
        className="text-3xl md:text-4xl font-bold text-text-primary mt-2"
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          variants={itemVariants}
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
