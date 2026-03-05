import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[--color-border-custom] bg-bg-primary/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Name */}
        <a
          href="#"
          className="flex items-center gap-2 font-display text-lg font-bold text-text-primary transition-colors hover:text-accent-cyan"
        >
          <span className="text-accent-cyan">&lt;</span>
          Raymundo Oyong
          <span className="text-accent-cyan">/&gt;</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative font-mono text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
              {/* Underline slide */}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-cyan transition-all duration-300 group-hover:w-full" />
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
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 font-mono text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
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
