import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Github,
  Linkedin,
  Facebook,
  Mail,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContactForm } from "@/hooks/useContactForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { TurnstileWidget } from "@/components/ui/TurnstileWidget";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

/* ── Social links ────────────────────────────────── */
const socialLinks = [
  {
    icon: Github,
    href: "https://github.com/oyong1926",
    label: "GitHub",
    color: "hover:text-accent-cyan hover:border-accent-cyan/40",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/raymundo-oyong-4ab94321a/",
    label: "LinkedIn",
    color: "hover:text-accent-cyan hover:border-accent-cyan/40",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/",
    label: "Facebook",
    color: "hover:text-accent-cyan hover:border-accent-cyan/40",
  },
  {
    icon: Mail,
    href: "mailto:oyongrm@gmail.com",
    label: "Email",
    color: "hover:text-accent-cyan hover:border-accent-cyan/40",
  },
];

/* ── Input field ─────────────────────────────────── */
function InputField({
  label,
  id,
  type = "text",
  required,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-mono text-text-secondary"
      >
        {label}
        {required && <span className="text-accent-pink ml-1">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border border-[--color-border-custom] bg-bg-secondary px-4 py-3",
          "text-sm text-text-primary placeholder:text-text-muted",
          "font-display outline-none transition-all duration-200",
          "focus:border-accent-cyan/60 focus:ring-1 focus:ring-accent-cyan/30",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      />
    </div>
  );
}

/* ── Textarea field ──────────────────────────────── */
function TextareaField({
  label,
  id,
  required,
  value,
  onChange,
  placeholder,
  disabled,
  rows = 5,
}: {
  label: string;
  id: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-mono text-text-secondary"
      >
        {label}
        {required && <span className="text-accent-pink ml-1">*</span>}
      </label>
      <textarea
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn(
          "w-full rounded-lg border border-[--color-border-custom] bg-bg-secondary px-4 py-3",
          "text-sm text-text-primary placeholder:text-text-muted",
          "font-display outline-none transition-all duration-200 resize-none",
          "focus:border-accent-cyan/60 focus:ring-1 focus:ring-accent-cyan/30",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      />
    </div>
  );
}

/* ── Success message ─────────────────────────────── */
function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
      >
        <CheckCircle2 className="h-16 w-16 text-accent-green mb-4" />
      </motion.div>
      <h3 className="text-xl font-bold text-text-primary">Message sent!</h3>
      <p className="mt-2 max-w-sm text-text-secondary">
        Thanks for reaching out. I'll get back to you within 24 hours.
      </p>
      <button
        onClick={onReset}
        className="mt-6 text-sm font-mono text-accent-cyan hover:underline transition-colors"
      >
        Send another message
      </button>
    </motion.div>
  );
}

/* ── Contact section ─────────────────────────────── */
export function Contact() {
  const { submitting, success, error, submit, reset } = useContactForm();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);
  const formStartTime = useRef(Date.now());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Honeypot check — bots fill this hidden field
    if (honeypot) return;

    // Time-based check — reject if submitted in under 2 seconds (bot speed)
    if (Date.now() - formStartTime.current < 2000) return;

    // Turnstile check — require token if site key is configured
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      return;
    }

    await submit({ name, email, message, turnstileToken });
    if (!error) {
      setName("");
      setEmail("");
      setMessage("");
      setTurnstileToken("");
      setTurnstileKey((k) => k + 1); // reset Turnstile widget
    }
  };

  const handleReset = () => {
    reset();
    setName("");
    setEmail("");
    setMessage("");
    setTurnstileToken("");
    setTurnstileKey((k) => k + 1);
    formStartTime.current = Date.now();
  };

  return (
    <section id="contact" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="Contact"
          title="Let's Build Something Remarkable"
          subtitle="Have a project in mind, want to collaborate, or just say hello? Drop me a message."
        />

        <div className="grid gap-10 lg:grid-cols-5">
          {/* ── Form card ── */}
          <div className="lg:col-span-3">
            <GlowCard glowVariant="cyan" className="p-8">
              <AnimatePresence mode="wait">
                {success ? (
                  <SuccessMessage key="success" onReset={handleReset} />
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Name + Email row */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <InputField
                        label="Name"
                        id="contact-name"
                        required
                        value={name}
                        onChange={setName}
                        placeholder="John Doe"
                        disabled={submitting}
                      />
                      <InputField
                        label="Email"
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={setEmail}
                        placeholder="john@example.com"
                        disabled={submitting}
                      />
                    </div>

                    {/* Message */}
                    <TextareaField
                      label="Message"
                      id="contact-message"
                      required
                      value={message}
                      onChange={setMessage}
                      placeholder="Tell me about your project, idea, or just say hi..."
                      disabled={submitting}
                      rows={5}
                    />

                    {/* Honeypot — hidden from humans, bots fill it */}
                    <div
                      className="absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden"
                      aria-hidden="true"
                    >
                      <label htmlFor="contact-website">Website</label>
                      <input
                        id="contact-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    {/* Cloudflare Turnstile CAPTCHA */}
                    {TURNSTILE_SITE_KEY && (
                      <TurnstileWidget
                        key={turnstileKey}
                        siteKey={TURNSTILE_SITE_KEY}
                        onVerify={setTurnstileToken}
                        onExpire={() => setTurnstileToken("")}
                        onError={() => setTurnstileToken("")}
                        theme="dark"
                        className="flex justify-start"
                      />
                    )}

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 rounded-lg border border-accent-pink/30 bg-accent-pink/10 px-4 py-3 text-sm text-accent-pink"
                        >
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className={cn(
                        "group inline-flex items-center gap-2 rounded-lg px-6 py-3",
                        "bg-accent-cyan text-bg-primary font-semibold text-sm",
                        "hover:shadow-glow-cyan transition-all duration-200",
                        "active:scale-[0.97]",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
                      )}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </GlowCard>
          </div>

          {/* ── Sidebar info ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            {/* Reach out card */}
            <GlowCard glowVariant="green" className="p-8">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Or reach me at
              </h3>
              <p className="text-sm text-text-secondary mb-6">
                Feel free to connect on any platform. I'm always open to
                interesting conversations and opportunities.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
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
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {label}
                  </a>
                ))}
              </div>
            </GlowCard>

            {/* Availability card */}
            <GlowCard glowVariant="cyan" className="p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-green" />
                </span>
                <span className="text-sm font-mono text-accent-green">
                  Available for work
                </span>
              </div>
              <p className="text-sm text-text-secondary">
                Currently open to freelance projects, consulting engagements,
                and full-time opportunities in AI/ML engineering.
              </p>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
