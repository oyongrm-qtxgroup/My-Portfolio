import { motion } from "framer-motion";
import { Github, Linkedin, Facebook, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceTier } from "@/contexts/DeviceCapabilityContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { TerminalForm } from "@/components/ui/TerminalForm";

/* ── Social links ────────────────────────────────── */
const socialLinks = [
  {
    icon: Github,
    href: "https://github.com/oyong1926",
    label: "GitHub",
    color: "hover:text-accent-cyan hover:border-accent-cyan/40",
    floatDelay: 0,
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/raymundo-oyong-4ab94321a/",
    label: "LinkedIn",
    color: "hover:text-accent-cyan hover:border-accent-cyan/40",
    floatDelay: 0.5,
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/",
    label: "Facebook",
    color: "hover:text-accent-cyan hover:border-accent-cyan/40",
    floatDelay: 1.0,
  },
  {
    icon: Mail,
    href: "mailto:oyongrm@gmail.com",
    label: "Email",
    color: "hover:text-accent-cyan hover:border-accent-cyan/40",
    floatDelay: 1.5,
  },
];

/* ── Floating social icon (CSS animated) ─────────── */
function FloatingSocialIcon({
  icon: Icon,
  href,
  label,
  color,
  delay,
  index,
}: {
  icon: typeof Github;
  href: string;
  label: string;
  color: string;
  delay: number;
  index: number;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + index * 0.12, duration: 0.5 }}
      whileHover={{ scale: 1.15, y: -4 }}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-[--color-border-custom] bg-bg-elevated/80 px-4 py-3",
        "text-sm text-text-secondary transition-all duration-300",
        "backdrop-blur-sm",
        color,
      )}
      style={{
        animation: `float-tag ${3.5 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </motion.a>
  );
}

/* ── Radar ping availability indicator ───────────── */
function RadarPing() {
  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      {/* Outer ping rings */}
      <span
        className="absolute h-full w-full rounded-full border border-accent-green/30"
        style={{ animation: "radar-ping 2s ease-out infinite" }}
      />
      <span
        className="absolute h-full w-full rounded-full border border-accent-green/20"
        style={{ animation: "radar-ping 2s ease-out 0.5s infinite" }}
      />
      <span
        className="absolute h-full w-full rounded-full border border-accent-green/10"
        style={{ animation: "radar-ping 2s ease-out 1s infinite" }}
      />
      {/* Center dot */}
      <span className="relative h-3 w-3 rounded-full bg-accent-green shadow-[0_0_12px_rgba(0,255,136,0.5)]" />
    </div>
  );
}

/* ── Contact section ─────────────────────────────── */
export function Contact() {
  const tier = useDeviceTier();

  return (
    <section
      id="contact"
      className="section-bg-contact relative px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="Contact"
          title="Let's Build Something Remarkable"
          entrance="terminal"
          subtitle="Have a project in mind, want to collaborate, or just say hello? Drop me a transmission."
        />

        <div className="grid gap-10 lg:grid-cols-5">
          {/* ── Terminal form ── */}
          <div className="lg:col-span-3">
            <TerminalForm />
          </div>

          {/* ── Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            {/* Social links — floating icons */}
            <GlowCard glowVariant="green" className="p-8">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Or reach me at
              </h3>
              <p className="text-sm text-text-secondary mb-6">
                Feel free to connect on any platform. I'm always open to
                interesting conversations and opportunities.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map(
                  ({ icon, href, label, color, floatDelay }, index) =>
                    tier === "low" ? (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center gap-3 rounded-lg border border-[--color-border-custom] bg-bg-secondary px-4 py-3",
                          "text-sm text-text-secondary transition-all duration-200",
                          color,
                        )}
                      >
                        {(() => {
                          const IconComp = icon;
                          return <IconComp className="h-4 w-4 flex-shrink-0" />;
                        })()}
                        {label}
                      </a>
                    ) : (
                      <FloatingSocialIcon
                        key={label}
                        icon={icon}
                        href={href}
                        label={label}
                        color={color}
                        delay={floatDelay}
                        index={index}
                      />
                    ),
                )}
              </div>
            </GlowCard>

            {/* Availability card with radar ping */}
            <GlowCard glowVariant="cyan" className="p-8">
              <div className="flex items-center gap-4 mb-3">
                <RadarPing />
                <div>
                  <span className="text-sm font-mono text-accent-green font-semibold">
                    Signal Active
                  </span>
                  <p className="text-xs text-text-muted font-mono">
                    STATUS: AVAILABLE
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary">
                Currently open to freelance projects and consulting engagements
                in AI/ML engineering.
              </p>

              {/* Signal strength bars */}
              <div className="mt-4 flex items-end gap-1">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <motion.div
                    key={bar}
                    className="w-2 rounded-sm bg-accent-green"
                    initial={{ height: 0 }}
                    whileInView={{ height: bar * 4 + 4 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + bar * 0.1, duration: 0.3 }}
                    style={{ opacity: 0.4 + bar * 0.12 }}
                  />
                ))}
                <span className="ml-2 text-[10px] font-mono text-accent-green/60">
                  5/5 bars
                </span>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
