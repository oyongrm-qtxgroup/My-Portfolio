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

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border-t border-[--color-border-custom] bg-bg-secondary"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Logo */}
          <div className="font-display text-sm text-text-secondary">
            <span className="text-accent-cyan">&lt;</span>
            Raymundo Oyong
            <span className="text-accent-cyan">/&gt;</span>
            <span className="ml-2 text-text-muted">
              &copy; {new Date().getFullYear()}
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="rounded-lg p-2 text-text-muted transition-all duration-200 hover:bg-bg-elevated hover:text-accent-cyan"
              >
                <social.icon size={18} />
              </a>
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
