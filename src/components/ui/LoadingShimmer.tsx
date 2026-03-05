import { cn } from "@/lib/utils";

interface LoadingShimmerProps {
  className?: string;
  lines?: number;
}

/**
 * Shimmer bar — a single animated placeholder bar with a sweep effect.
 */
function ShimmerBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-4 overflow-hidden rounded-md bg-bg-elevated",
        className,
      )}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-border-glow) 40%, transparent), transparent)",
        }}
      />
    </div>
  );
}

/**
 * Text-line skeleton loader with staggered widths.
 */
export function LoadingShimmer({ className, lines = 3 }: LoadingShimmerProps) {
  const widths = ["w-3/4", "w-full", "w-1/2", "w-2/3", "w-5/6"];
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerBar key={i} className={widths[i % widths.length]} />
      ))}
    </div>
  );
}

/**
 * Card skeleton — mimics a GlowCard with placeholder content.
 */
export function CardShimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-bg-elevated border border-[--color-border-custom] rounded-xl p-6 overflow-hidden",
        className,
      )}
    >
      {/* Label line */}
      <ShimmerBar className="h-3 w-20 mb-3" />
      {/* Title */}
      <ShimmerBar className="h-5 w-3/4 mb-2" />
      {/* Subtitle */}
      <ShimmerBar className="h-4 w-1/2 mb-4" />
      {/* Badge pills */}
      <div className="flex gap-2">
        <ShimmerBar className="h-6 w-16 rounded-full" />
        <ShimmerBar className="h-6 w-20 rounded-full" />
        <ShimmerBar className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Grid of card skeletons for a section loading state.
 */
export function GridShimmer({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardShimmer key={i} />
      ))}
    </div>
  );
}
