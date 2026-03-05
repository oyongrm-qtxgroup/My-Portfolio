import { useRef, useCallback, type ReactNode, type MouseEvent } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type GlowVariant = "cyan" | "green" | "orange" | "purple" | "pink";
type GlowElement = "div" | "article" | "li";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  glowVariant?: GlowVariant;
  hoverScale?: boolean;
  onClick?: () => void;
  as?: GlowElement;
}

// Cache motion components so they are stable across renders.
// Creating them inside the component body causes React to unmount/remount
// on every parent re-render, which destroys input focus.
const motionComponents: Record<
  GlowElement,
  React.ComponentType<
    HTMLMotionProps<"div"> & { ref?: React.Ref<HTMLDivElement> }
  >
> = {
  div: motion.div as any,
  article: motion.article as any,
  li: motion.li as any,
};

const glowBorderColors: Record<GlowVariant, string> = {
  cyan: "hover:border-accent-cyan/40",
  green: "hover:border-accent-green/40",
  orange: "hover:border-accent-orange/40",
  purple: "hover:border-accent-purple/40",
  pink: "hover:border-accent-pink/40",
};

const glowShadows: Record<GlowVariant, string> = {
  cyan: "hover:shadow-glow-cyan",
  green: "hover:shadow-glow-green",
  orange: "hover:shadow-glow-orange",
  purple: "hover:shadow-glow-purple",
  pink: "hover:shadow-glow-pink",
};

export function GlowCard({
  children,
  className,
  tilt = false,
  glowVariant = "cyan",
  hoverScale = false,
  onClick,
  as = "div",
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Update glow gradient via DOM — no React re-render
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(400px circle at ${x * 100}% ${y * 100}%, color-mix(in oklch, var(--color-accent-cyan) 6%, transparent), transparent 60%)`;
      }

      if (tilt) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -4;
        const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 4;
        cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }
    },
    [tilt],
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    if (tilt) {
      cardRef.current.style.transform =
        "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    }
    // Reset glow position via DOM
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(400px circle at 50% 50%, color-mix(in oklch, var(--color-accent-cyan) 6%, transparent), transparent 60%)`;
    }
  }, [tilt]);

  const MotionComponent = motionComponents[as];

  return (
    <MotionComponent
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      className={cn(
        "relative bg-bg-elevated border border-[--color-border-custom] rounded-xl p-6 overflow-hidden",
        glowBorderColors[glowVariant],
        glowShadows[glowVariant],
        "transition-all duration-300 ease-out",
        hoverScale && "hover:scale-[1.02]",
        onClick && "cursor-pointer",
        className,
      )}
      style={{ willChange: "transform" }}
    >
      {/* Radial glow follow-cursor effect — updated via ref, not state */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </MotionComponent>
  );
}
