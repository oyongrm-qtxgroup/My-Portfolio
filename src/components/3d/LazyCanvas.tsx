import { useRef, useState, useEffect, type ReactNode } from "react";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";

interface LazyCanvasProps {
  /** Content to render when in viewport (should include <Canvas> and all 3D children) */
  children: ReactNode;
  /** How many pixels before the viewport to start loading (default: 200) */
  rootMargin?: string;
  /** Fallback while not yet in viewport or loading */
  fallback?: ReactNode;
  /** CSS class for wrapper div */
  className?: string;
  /** CSS style for wrapper div */
  style?: React.CSSProperties;
}

/**
 * IntersectionObserver-gated loader for Three.js Canvas components.
 * Mounts children only when the container is within `rootMargin` of the viewport.
 * Unmounts when it scrolls far away to free GPU resources.
 */
export function LazyCanvas({
  children,
  rootMargin = "200px 0px",
  fallback,
  className,
  style,
}: LazyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once mounted, stay mounted — don't unmount on scroll
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  const defaultFallback = (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingShimmer lines={3} className="w-48" />
    </div>
  );

  return (
    <div ref={containerRef} className={className} style={style}>
      {isVisible ? children : (fallback ?? defaultFallback)}
    </div>
  );
}
