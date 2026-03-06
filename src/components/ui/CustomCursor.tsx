import { useEffect, useRef, useCallback } from "react";

/**
 * Custom cursor: small glowing cyan dot + trailing circle.
 * Only renders on non-touch / pointer-fine devices.
 * Uses direct DOM manipulation to avoid React re-renders on every mouse move.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const visible = useRef(false);
  const clicking = useRef(false);
  const rafId = useRef<number>(0);

  const animate = useCallback(() => {
    // Lerp ring position toward dot for smooth trailing
    ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
    ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;

    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${pos.current.x - 4}px, ${pos.current.y - 4}px, 0)`;
      dotRef.current.style.opacity = visible.current ? "1" : "0";
    }
    if (ringRef.current) {
      const size = clicking.current ? 24 : 32;
      const offset = size / 2;
      ringRef.current.style.transform = `translate3d(${ringPos.current.x - offset}px, ${ringPos.current.y - offset}px, 0)`;
      ringRef.current.style.width = `${size}px`;
      ringRef.current.style.height = `${size}px`;
      ringRef.current.style.opacity = visible.current
        ? clicking.current
          ? "0.6"
          : "0.3"
        : "0";
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (!visible.current) visible.current = true;
    };
    const onDown = () => {
      clicking.current = true;
    };
    const onUp = () => {
      clicking.current = false;
    };
    const onLeave = () => {
      visible.current = false;
    };
    const onEnter = () => {
      visible.current = true;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [animate]);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-accent-cyan mix-blend-screen"
        style={{ opacity: 0, willChange: "transform" }}
      />
      {/* Outer trailing circle */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-accent-cyan/50 mix-blend-screen"
        style={{
          opacity: 0,
          willChange: "transform",
          transition: "width 0.15s, height 0.15s",
        }}
      />
    </>
  );
}
