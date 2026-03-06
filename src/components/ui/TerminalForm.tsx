import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContactForm } from "@/hooks/useContactForm";
import { TurnstileWidget } from "@/components/ui/TurnstileWidget";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

/* ── Typing label animation ─────────────────────── */
function TypingLabel({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span className="font-mono text-xs text-accent-green">
      {">"} {displayed}
      {!done && (
        <span className="inline-block w-1.5 h-3.5 bg-accent-green ml-0.5 align-middle animate-[terminal-blink_1s_step-end_infinite]" />
      )}
    </span>
  );
}

/* ── Terminal input field ────────────────────────── */
function TerminalInput({
  label,
  id,
  type = "text",
  required,
  value,
  onChange,
  placeholder,
  disabled,
  typingDelay,
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  typingDelay?: number;
}) {
  return (
    <div className="space-y-1.5">
      <TypingLabel text={label + (required ? " *" : "")} delay={typingDelay} />
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
          "w-full rounded border border-accent-green/20 bg-black/60 px-3 py-2.5",
          "text-sm text-accent-green placeholder:text-accent-green/30",
          "font-mono outline-none transition-all duration-200",
          "focus:border-accent-green/60 focus:ring-1 focus:ring-accent-green/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      />
    </div>
  );
}

/* ── Terminal textarea ───────────────────────────── */
function TerminalTextarea({
  label,
  id,
  required,
  value,
  onChange,
  placeholder,
  disabled,
  rows = 5,
  typingDelay,
}: {
  label: string;
  id: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  typingDelay?: number;
}) {
  return (
    <div className="space-y-1.5">
      <TypingLabel text={label + (required ? " *" : "")} delay={typingDelay} />
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
          "w-full rounded border border-accent-green/20 bg-black/60 px-3 py-2.5",
          "text-sm text-accent-green placeholder:text-accent-green/30",
          "font-mono outline-none transition-all duration-200 resize-none",
          "focus:border-accent-green/60 focus:ring-1 focus:ring-accent-green/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      />
    </div>
  );
}

/* ── Transmission success ────────────────────────── */
function TransmissionReceived({ onReset }: { onReset: () => void }) {
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
      <h3 className="text-xl font-bold font-mono text-accent-green">
        TRANSMISSION RECEIVED
      </h3>
      <p className="mt-2 max-w-sm text-text-secondary font-mono text-sm">
        Signal acknowledged. Response ETA: ~24 hours.
      </p>
      <button
        onClick={onReset}
        className="mt-6 text-sm font-mono text-accent-cyan hover:underline transition-colors"
      >
        {">"} new_transmission()
      </button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   TERMINAL FORM COMPONENT
   ═══════════════════════════════════════════════════════ */
export function TerminalForm() {
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
    if (honeypot) return;
    if (Date.now() - formStartTime.current < 2000) return;
    if (TURNSTILE_SITE_KEY && !turnstileToken) return;

    await submit({ name, email, message, turnstileToken });
    if (!error) {
      setName("");
      setEmail("");
      setMessage("");
      setTurnstileToken("");
      setTurnstileKey((k) => k + 1);
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
    <div
      className="relative rounded-xl overflow-hidden border border-accent-green/20 bg-black/80"
      style={{
        boxShadow:
          "0 0 40px rgba(0, 255, 136, 0.05), inset 0 0 80px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Scanline overlay */}
      <div className="scanline-overlay pointer-events-none absolute inset-0 z-30 rounded-xl" />

      {/* CRT vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-xl"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Terminal header bar */}
      <div className="relative z-10 flex items-center gap-2 border-b border-accent-green/15 px-4 py-2.5 bg-black/60">
        <Terminal className="h-3.5 w-3.5 text-accent-green/60" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent-green/50">
          contact_terminal v2.0
        </span>
        <div className="ml-auto flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-accent-green/40" />
          <div className="h-2 w-2 rounded-full bg-accent-orange/40" />
          <div className="h-2 w-2 rounded-full bg-accent-pink/40" />
        </div>
      </div>

      {/* Form body */}
      <div className="relative z-10 p-6 md:p-8">
        <AnimatePresence mode="wait">
          {success ? (
            <TransmissionReceived key="success" onReset={handleReset} />
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name + Email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <TerminalInput
                  label="ENTER_NAME"
                  id="contact-name"
                  required
                  value={name}
                  onChange={setName}
                  placeholder="your_name"
                  disabled={submitting}
                  typingDelay={200}
                />
                <TerminalInput
                  label="ENTER_EMAIL"
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  disabled={submitting}
                  typingDelay={400}
                />
              </div>

              {/* Message */}
              <TerminalTextarea
                label="COMPOSE_MESSAGE"
                id="contact-message"
                required
                value={message}
                onChange={setMessage}
                placeholder="Describe your project, idea, or just say hello..."
                disabled={submitting}
                rows={5}
                typingDelay={600}
              />

              {/* Honeypot */}
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

              {/* Turnstile */}
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
                    className="flex items-center gap-2 rounded border border-accent-pink/30 bg-accent-pink/10 px-4 py-3 text-sm font-mono text-accent-pink"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    ERROR: {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "group inline-flex items-center gap-2 rounded border px-6 py-3",
                  "border-accent-green/40 bg-accent-green/10 text-accent-green font-mono font-semibold text-sm",
                  "hover:bg-accent-green/20 hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] transition-all duration-200",
                  "active:scale-[0.97]",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
                )}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Transmitting
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                    >
                      ...
                    </motion.span>
                  </>
                ) : (
                  <>
                    Send Transmission
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
