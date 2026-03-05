import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Custom cursor: small glowing cyan dot + trailing circle.
 * Only renders on non-touch / pointer-fine devices.
 */
export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    // Only show on devices with a fine pointer (no touch-only)
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-accent-cyan mix-blend-screen"
        style={{ x: pos.x - 4, y: pos.y - 4 }}
        transition={{ type: "tween", duration: 0 }}
      />
      {/* Outer trailing circle */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-accent-cyan/50 mix-blend-screen"
        animate={{
          x: pos.x - (clicking ? 12 : 16),
          y: pos.y - (clicking ? 12 : 16),
          width: clicking ? 24 : 32,
          height: clicking ? 24 : 32,
          opacity: clicking ? 0.6 : 0.3,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.5 }}
      />
    </>
  );
}
