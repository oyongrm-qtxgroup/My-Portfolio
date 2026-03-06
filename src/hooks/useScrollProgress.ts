import { useRef, useState, useEffect, useCallback } from "react";

interface ScrollProgress {
  /** Overall page scroll progress 0→1 */
  pageProgress: number;
  /** Per-section progress 0→1 (0 = just entered viewport bottom, 1 = exited viewport top) */
  sectionProgress: number;
  /** Whether section is currently visible */
  isVisible: boolean;
}

/**
 * Track scroll progress for a specific section.
 * Attach the returned ref to the section element.
 */
export function useScrollProgress(): [
  React.RefObject<HTMLElement | null>,
  ScrollProgress,
] {
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState<ScrollProgress>({
    pageProgress: 0,
    sectionProgress: 0,
    isVisible: false,
  });

  const handleScroll = useCallback(() => {
    // Page progress
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pageProgress =
      docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

    // Section progress
    if (!ref.current) {
      setProgress((prev) => ({ ...prev, pageProgress }));
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Section enters when top reaches bottom of viewport,
    // fully scrolled when bottom reaches top of viewport
    const sectionTop = rect.top;
    const sectionBottom = rect.bottom;
    const isVisible = sectionBottom > 0 && sectionTop < windowHeight;

    // 0 when section top is at viewport bottom, 1 when section bottom is at viewport top
    const totalTravel = windowHeight + rect.height;
    const traveled = windowHeight - sectionTop;
    const sectionProgress = Math.min(1, Math.max(0, traveled / totalTravel));

    setProgress({ pageProgress, sectionProgress, isVisible });
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  return [ref, progress];
}

/**
 * Simple page-level scroll progress (0→1).
 */
export function usePageScroll(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0,
      );
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}
