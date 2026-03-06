import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useSpring,
} from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { KonamiEasterEgg } from "@/components/ui/KonamiEasterEgg";
import { AmbientBackground } from "@/components/3d/AmbientBackground";
import { DeviceCapabilityProvider } from "@/contexts/DeviceCapabilityContext";
import Home from "@/pages/Home";
import BlogPostPage from "@/pages/BlogPost";

/* ── Scroll progress bar ─────────────────────────── */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setVisible(v > 0.01);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 origin-left bg-accent-cyan"
      style={{ scaleX }}
    />
  );
}

/* ── Page transition wrapper ─────────────────────── */
const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: "easeInOut" as const },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        {...pageTransition}
        className="flex-1"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <DeviceCapabilityProvider>
        <BrowserRouter>
          <AmbientBackground />
          <div className="relative z-10 flex min-h-screen flex-col">
            <CustomCursor />
            <KonamiEasterEgg />
            <ScrollProgressBar />
            <Navbar />
            <AnimatedRoutes />
            <Footer />
          </div>
          <Analytics />
          <SpeedInsights />
        </BrowserRouter>
      </DeviceCapabilityProvider>
    </MotionConfig>
  );
}

export default App;
