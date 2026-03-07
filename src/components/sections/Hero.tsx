import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { PillBadge } from "@/components/ui/PillBadge";
import { HeroCanvas } from "@/components/3d/HeroCanvas";
import { LazyCanvas } from "@/components/3d/LazyCanvas";
import { useSkills } from "@/hooks/useSkills";

/* ── Animation variants ──────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const globeVariants = {
  hidden: { opacity: 0, scale: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
      delay: 0.1,
    },
  },
};

/* ── Typing effect — cycles through role titles ──── */
const roleTitles = [
  "Senior AI Software Engineer",
  "Azure AI Solutions Architect",
  "Enterprise AI Specialist",
  "RPA & Automation Engineer",
];

function TypingRole() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const current = roleTitles[titleIndex];

  useEffect(() => {
    const speed = deleting ? 30 : 60;
    const pause =
      !deleting && charIndex === current.length
        ? 2200
        : deleting && charIndex === 0
          ? 400
          : speed;

    const timer = setTimeout(() => {
      if (!deleting && charIndex === current.length) {
        setDeleting(true);
      } else if (deleting && charIndex === 0) {
        setDeleting(false);
        setTitleIndex((prev) => (prev + 1) % roleTitles.length);
      } else {
        setCharIndex((prev) => prev + (deleting ? -1 : 1));
      }
    }, pause);

    return () => clearTimeout(timer);
  }, [charIndex, deleting, current]);

  return (
    <span className="font-mono text-sm uppercase tracking-widest text-accent-cyan">
      {current.slice(0, charIndex)}
      <span className="ml-0.5 inline-block w-[2px] h-4 bg-accent-cyan align-middle animate-[typing-cursor_1s_step-end_infinite]" />
    </span>
  );
}

/* ── Stagger words in headline ───────────────────── */
function StaggerHeadline() {
  const words = ["Building", "intelligent", "systems", "that", "scale"];
  const gradientWords = new Set(["intelligent", "systems"]);

  return (
    <motion.h1
      className="text-4xl font-bold leading-tight text-text-primary sm:text-5xl lg:text-6xl"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: "easeOut" },
            },
          }}
          className={
            gradientWords.has(word)
              ? "bg-gradient-to-r from-accent-cyan to-accent-green bg-clip-text text-transparent"
              : undefined
          }
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.h1>
  );
}

export function Hero() {
  const { skills } = useSkills();
  const featuredSkills = useMemo(
    () => skills.filter((s) => s.is_featured),
    [skills],
  );

  return (
    <section
      id="hero"
      className="noise-overlay relative flex min-h-screen items-center pt-16"
    >
      {/* Background grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-accent-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent-cyan) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:gap-16 lg:px-8">
        {/* Text content */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <TypingRole />
          </motion.div>

          <StaggerHeadline />

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg text-text-secondary lg:text-xl"
          >
            Designing and shipping production AI/ML solutions — from LLM
            orchestration and RAG pipelines to real-time inference at scale.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-cyan px-6 py-3 font-medium text-bg-primary transition-all hover:bg-accent-cyan/90 hover:shadow-glow-cyan active:scale-[0.97]"
            >
              View Projects ↓
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-glow px-6 py-3 font-medium text-text-primary transition-all hover:border-accent-cyan/40 hover:bg-bg-elevated active:scale-[0.97]"
            >
              Get in Touch
            </a>
          </motion.div>

          {/* Currently Available For */}
          <motion.div variants={fadeUp} className="mt-12">
            <div className="mb-3 h-px w-full bg-linear-to-r from-transparent via-accent-cyan/20 to-transparent" />
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
              Currently available for
            </p>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <PillBadge label="Freelance" variant="green" dot />
              <PillBadge label="Consulting" variant="green" dot />
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Neural Globe */}
        <motion.div
          className="flex flex-1 items-center justify-center overflow-visible"
          variants={globeVariants}
          initial="hidden"
          animate="visible"
        >
          <LazyCanvas
            className="relative h-72 w-72 overflow-visible sm:h-96 sm:w-96 lg:h-[28rem] lg:w-[28rem]"
            rootMargin="400px 0px"
            fallback={
              <div className="flex h-full w-full items-center justify-center rounded-full border border-accent-cyan/20 bg-accent-cyan/5">
                <span className="font-mono text-xs text-accent-cyan/40">
                  Loading...
                </span>
              </div>
            }
          >
            <HeroCanvas skills={featuredSkills} />
          </LazyCanvas>
        </motion.div>
      </div>
    </section>
  );
}
