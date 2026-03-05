import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PillVariant =
  | "cyan"
  | "green"
  | "orange"
  | "purple"
  | "pink"
  | "yellow"
  | "muted";

type PillSize = "sm" | "md" | "lg";

interface PillBadgeProps {
  label: string;
  variant?: PillVariant;
  size?: PillSize;
  dot?: boolean;
  glow?: boolean;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<PillVariant, string> = {
  cyan: "border-accent-cyan/40 text-accent-cyan bg-accent-cyan/10",
  green: "border-accent-green/40 text-accent-green bg-accent-green/10",
  orange: "border-accent-orange/40 text-accent-orange bg-accent-orange/10",
  purple: "border-accent-purple/40 text-accent-purple bg-accent-purple/10",
  pink: "border-accent-pink/40 text-accent-pink bg-accent-pink/10",
  yellow: "border-accent-yellow/40 text-accent-yellow bg-accent-yellow/10",
  muted: "border-border-glow text-text-secondary bg-bg-elevated",
};

const glowStyles: Record<PillVariant, string> = {
  cyan: "shadow-glow-cyan",
  green: "shadow-glow-green",
  orange: "shadow-glow-orange",
  purple: "shadow-glow-purple",
  pink: "shadow-glow-pink",
  yellow: "shadow-[0_0_20px_color-mix(in_oklch,#ffd60a_25%,transparent)]",
  muted: "",
};

const dotColors: Record<PillVariant, string> = {
  cyan: "bg-accent-cyan",
  green: "bg-accent-green",
  orange: "bg-accent-orange",
  purple: "bg-accent-purple",
  pink: "bg-accent-pink",
  yellow: "bg-accent-yellow",
  muted: "bg-text-muted",
};

const sizeStyles: Record<PillSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-1.5 text-sm",
};

export function PillBadge({
  label,
  variant = "muted",
  size = "md",
  dot = false,
  glow = false,
  icon,
  className,
  onClick,
}: PillBadgeProps) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono font-medium transition-all duration-200",
        "hover:shadow-[0_0_8px] hover:shadow-current/20",
        variantStyles[variant],
        sizeStyles[size],
        glow && glowStyles[variant],
        onClick && "cursor-pointer active:scale-95",
        className,
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
              dotColors[variant],
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              dotColors[variant],
            )}
          />
        </span>
      )}
      {icon && (
        <span className="flex-shrink-0 [&>svg]:h-3 [&>svg]:w-3">{icon}</span>
      )}
      {label}
    </Component>
  );
}
