import { Github, Linkedin, Facebook, Mail } from "lucide-react";
import { motion } from "framer-motion";

const socialLinks = [
  { icon: Github, href: "https://github.com/oyong1926", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/raymundo-oyong-4ab94321a/",
    label: "LinkedIn",
  },
  { icon: Facebook, href: "https://www.facebook.com/", label: "Facebook" },
  { icon: Mail, href: "mailto:oyongrm@gmail.com", label: "Email" },
];

/** Signal-wave SVG animation */
function SignalWave() {
  return (
    <svg
      viewBox="0 0 200 24"
      fill="none"
      className="h-4 w-32 opacity-40"
      aria-hidden
    >
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.rect
          key={i}
          x={i * 25 + 4}
          width="16"
          rx="2"
          fill="var(--color-accent-cyan)"
          initial={{ y: 10, height: 4 }}
          animate={{
            y: [10, 2 + Math.random() * 6, 10],
            height: [4, 12 + Math.random() * 8, 4],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5 + Math.random() * 0.8,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-bg-secondary"
    >
      {/* Animated gradient border along top */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent-cyan), var(--color-accent-purple), var(--color-accent-pink), var(--color-accent-cyan), transparent)",
          backgroundSize: "200% 100%",
          animation: "holographic-shine 6s linear infinite",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Logo + wave */}
          <div className="flex items-center gap-4">
            <div className="font-display text-sm text-text-secondary">
              <span className="text-accent-cyan">&lt;</span>
              Raymundo Oyong
              <span className="text-accent-cyan">/&gt;</span>
              <span className="ml-2 text-text-muted">
                &copy; {new Date().getFullYear()}
              </span>
            </div>
            <SignalWave />
          </div>

          {/* Social links with glow hover */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                whileHover={{ scale: 1.15, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="rounded-lg p-2 text-text-muted transition-all duration-200 hover:bg-accent-cyan/10 hover:text-accent-cyan hover:shadow-[0_0_12px_rgba(0,212,255,0.2)]"
              >
                <social.icon size={18} />
              </motion.a>
            ))}
          </div>

          {/* Built with */}
          <p className="font-mono text-xs text-text-muted">
            Built with React + Three.js + Supabase
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
