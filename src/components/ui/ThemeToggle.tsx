import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const options: { value: Theme; label: string; icon: typeof Moon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function ActiveIcon({ resolvedTheme }: { resolvedTheme: "dark" | "light" }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={resolvedTheme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {resolvedTheme === "dark" ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
      </motion.span>
    </AnimatePresence>
  );
}

export function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (mobile) {
    return (
      <div className="flex items-center gap-2 rounded-lg px-3 py-2">
        <span className="font-mono text-sm text-text-secondary mr-auto">
          Theme
        </span>
        <div className="flex items-center gap-1 rounded-full border border-border-custom bg-bg-secondary p-0.5">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "relative flex items-center justify-center rounded-full p-1.5 transition-colors duration-200",
                  isActive
                    ? "text-accent-cyan"
                    : "text-text-muted hover:text-text-secondary",
                )}
                aria-label={`Switch to ${opt.label} mode`}
              >
                {isActive && (
                  <motion.span
                    layoutId="theme-mobile-indicator"
                    className="absolute inset-0 rounded-full bg-accent-cyan/10 border border-accent-cyan/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="group relative flex h-[30px] w-[30px] items-center justify-center rounded-full border border-accent-cyan/40 bg-accent-cyan/5 text-accent-cyan transition-all duration-300 hover:bg-accent-cyan/15 hover:shadow-[0_0_14px_rgba(0,255,255,0.2)]"
        aria-label="Toggle theme"
        aria-expanded={open}
      >
        <ActiveIcon resolvedTheme={resolvedTheme} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 w-36 overflow-hidden rounded-xl border border-border-custom bg-bg-elevated/95 p-1 shadow-glow-card backdrop-blur-xl"
          >
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 font-mono text-xs transition-colors duration-150",
                    isActive
                      ? "bg-accent-cyan/10 text-accent-cyan"
                      : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {opt.label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
