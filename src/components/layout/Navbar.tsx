import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Projects", hash: "projects" },
  { label: "Skills", hash: "skills" },
  { label: "Experience", hash: "experience" },
  { label: "Credentials", hash: "certifications" },
  { label: "Blog", hash: "blog" },
  { label: "Contact", hash: "contact" },
];

/** Hook to track which section is currently in view */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.hash);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const activeSection = useActiveSection();

  // Scroll-based background opacity
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [0.6, 0.95]);

  // Magnetic hover effect
  const magnetRef = useRef<HTMLDivElement>(null);
  const handleMagneticMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    },
    [],
  );
  const handleMagneticLeave = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.transform = "translate(0, 0)";
    },
    [],
  );

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, hash?: string) => {
      e.preventDefault();
      if (isHome) {
        if (hash) {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        navigate("/");
        if (hash) {
          setTimeout(() => {
            document
              .getElementById(hash)
              ?.scrollIntoView({ behavior: "smooth" });
          }, 400);
        }
      }
    },
    [isHome, navigate],
  );

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[--color-border-custom] backdrop-blur-xl"
      style={{
        backgroundColor: `rgba(var(--color-bg-primary-rgb, 10, 10, 20), ${bgOpacity.get()})`,
      }}
    >
      {/* Scroll-reactive background */}
      <motion.div
        className="absolute inset-0 bg-bg-primary/80 -z-10"
        style={{ opacity: bgOpacity }}
      />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Name */}
        <a
          href="/"
          onClick={(e) => handleNavClick(e)}
          className="flex items-center gap-2 font-display text-lg font-bold text-text-primary transition-colors hover:text-accent-cyan"
        >
          <span className="text-accent-cyan">&lt;</span>
          Raymundo Oyong
          <span className="text-accent-cyan">/&gt;</span>
        </a>

        {/* Desktop links */}
        <div ref={magnetRef} className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.hash}
              href={`/#${link.hash}`}
              onClick={(e) => handleNavClick(e, link.hash)}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className={cn(
                "group relative font-mono text-sm transition-all duration-200",
                activeSection === link.hash
                  ? "text-accent-cyan"
                  : "text-text-secondary hover:text-text-primary",
              )}
              style={{ transition: "transform 0.2s ease-out, color 0.2s" }}
            >
              {link.label}
              {/* Active indicator — morphing underline */}
              <motion.span
                className="absolute -bottom-1 left-0 h-px bg-accent-cyan"
                initial={false}
                animate={{
                  width: activeSection === link.hash ? "100%" : "0%",
                  opacity: activeSection === link.hash ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              {/* Hover underline for inactive */}
              {activeSection !== link.hash && (
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-cyan/50 transition-all duration-300 group-hover:w-full" />
              )}
            </a>
          ))}

          {/* Availability dot */}
          <div className="flex items-center gap-2 rounded-full border border-accent-green/30 bg-accent-green/5 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
            </span>
            <span className="font-mono text-xs text-accent-green">
              Available
            </span>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-t border-[--color-border-custom] bg-bg-primary/95 backdrop-blur-xl",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-t-0",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <a
              key={link.hash}
              href={`/#${link.hash}`}
              onClick={(e) => {
                handleNavClick(e, link.hash);
                setMobileOpen(false);
              }}
              className={cn(
                "rounded-lg px-3 py-2 font-mono text-sm transition-colors",
                activeSection === link.hash
                  ? "bg-accent-cyan/10 text-accent-cyan"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
              )}
            >
              {activeSection === link.hash && (
                <span className="mr-2 text-accent-cyan">▸</span>
              )}
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
            </span>
            <span className="font-mono text-xs text-accent-green">
              Available for work
            </span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
