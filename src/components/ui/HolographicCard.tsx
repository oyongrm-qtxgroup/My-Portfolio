import {
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HolographicCardProps {
  children: ReactNode;
  backContent?: ReactNode;
  accentColor?: string;
  className?: string;
  /** Stagger index for unlock entrance (0-based) */
  index?: number;
  /** Enable the "achievement unlocked" entrance animation */
  unlockEntrance?: boolean;
}

/**
 * CSS-based holographic card with:
 * - Mouse-tracked 3D rotation (perspective + rotateX/Y)
 * - Animated rainbow iridescent gradient sweep on hover
 * - "Achievement unlocked" entrance (glow flash + scale burst)
 * - Click to flip and reveal back face
 */
export function HolographicCard({
  children,
  backContent,
  accentColor = "var(--color-accent-cyan)",
  className,
  index = 0,
  unlockEntrance = true,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Mouse-tracked rotation
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    cardRef.current.style.transform = `perspective(600px) rotateX(${
      y * -12
    }deg) rotateY(${x * 12}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  const handleClick = useCallback(() => {
    if (backContent) setIsFlipped((f) => !f);
  }, [backContent]);

  return (
    <motion.div
      initial={
        unlockEntrance
          ? { opacity: 0, scale: 0.8, filter: "blur(8px)" }
          : { opacity: 0, y: 20 }
      }
      whileInView={
        unlockEntrance
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.15,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      onAnimationComplete={() => setHasEntered(true)}
      className="relative group"
      style={{ perspective: "1000px" }}
    >
      {/* Unlock glow flash */}
      {unlockEntrance && !hasEntered && (
        <motion.div
          className="absolute inset-0 rounded-xl z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ delay: index * 0.15, duration: 0.8 }}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 70%)`,
          }}
        />
      )}

      <div
        ref={cardRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative rounded-xl transition-transform duration-200 ease-out",
          backContent && "cursor-pointer",
          className,
        )}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Holographic shimmer overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `conic-gradient(
              from 0deg at 50% 50%,
              transparent 0deg,
              rgba(0, 212, 255, 0.08) 60deg,
              rgba(124, 58, 237, 0.08) 120deg,
              rgba(255, 45, 120, 0.08) 180deg,
              rgba(0, 255, 136, 0.08) 240deg,
              rgba(255, 214, 10, 0.06) 300deg,
              transparent 360deg
            )`,
            animation: "holographic-shine 4s linear infinite",
          }}
        />

        {/* Iridescent border glow */}
        <div
          className="absolute inset-0 z-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `conic-gradient(
              from 0deg at 50% 50%,
              ${accentColor},
              rgba(124, 58, 237, 0.6),
              rgba(255, 45, 120, 0.6),
              ${accentColor}
            )`,
            padding: "1px",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            animation: "holographic-shine 3s linear infinite",
          }}
        />

        {/* Card flip container */}
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="relative z-5 bg-bg-elevated border border-[--color-border-custom] rounded-xl p-6"
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="relative z-5 bg-bg-elevated border border-[--color-border-custom] rounded-xl p-6"
            >
              {backContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
