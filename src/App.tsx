import { useEffect, useState, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
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
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Home from "@/pages/Home";
import BlogPostPage from "@/pages/BlogPost";

/* ── Lazy-loaded admin pages ─────────────────────── */
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminResetPassword = lazy(() => import("@/pages/admin/ResetPassword"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const ProjectsManager = lazy(() => import("@/pages/admin/ProjectsManager"));
const ExperienceManager = lazy(() => import("@/pages/admin/ExperienceManager"));
const SkillsManager = lazy(() => import("@/pages/admin/SkillsManager"));
const BlogManager = lazy(() => import("@/pages/admin/BlogManager"));
const CertificationsManager = lazy(
  () => import("@/pages/admin/CertificationsManager"),
);
const AwardsManager = lazy(() => import("@/pages/admin/AwardsManager"));
const ContactMessages = lazy(() => import("@/pages/admin/ContactMessages"));

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

/* ── Admin loading fallback ───────────────────────── */
function AdminLoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-bg-primary">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
    </div>
  );
}

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
      <AuthProvider>
        <DeviceCapabilityProvider>
          <BrowserRouter>
            <Routes>
              {/* ── Admin routes (no public chrome) ──── */}
              <Route
                path="/admin/login"
                element={
                  <Suspense fallback={<AdminLoadingFallback />}>
                    <AdminLogin />
                  </Suspense>
                }
              />
              <Route
                path="/admin/reset-password"
                element={
                  <Suspense fallback={<AdminLoadingFallback />}>
                    <AdminResetPassword />
                  </Suspense>
                }
              />
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<AdminLoadingFallback />}>
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  </Suspense>
                }
              >
                <Route
                  index
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route
                  path="dashboard"
                  element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="projects"
                  element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <ProjectsManager />
                    </Suspense>
                  }
                />
                <Route
                  path="experience"
                  element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <ExperienceManager />
                    </Suspense>
                  }
                />
                <Route
                  path="skills"
                  element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <SkillsManager />
                    </Suspense>
                  }
                />
                <Route
                  path="blog"
                  element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <BlogManager />
                    </Suspense>
                  }
                />
                <Route
                  path="certifications"
                  element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <CertificationsManager />
                    </Suspense>
                  }
                />
                <Route
                  path="awards"
                  element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AwardsManager />
                    </Suspense>
                  }
                />
                <Route
                  path="messages"
                  element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <ContactMessages />
                    </Suspense>
                  }
                />
              </Route>

              {/* ── Public routes (with navbar/footer) ─ */}
              <Route
                path="*"
                element={
                  <>
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
                  </>
                }
              />
            </Routes>
          </BrowserRouter>
        </DeviceCapabilityProvider>
      </AuthProvider>
    </MotionConfig>
  );
}

export default App;
