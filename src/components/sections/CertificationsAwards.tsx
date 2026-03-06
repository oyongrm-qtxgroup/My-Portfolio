import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  ShieldCheck,
  ExternalLink,
  Trophy,
  Star,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCertifications } from "@/hooks/useCertifications";
import { useAwards } from "@/hooks/useAwards";
import { useDeviceTier } from "@/contexts/DeviceCapabilityContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HolographicCard } from "@/components/ui/HolographicCard";
import { GlowCard } from "@/components/ui/GlowCard";
import { PillBadge } from "@/components/ui/PillBadge";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";
import type { Certification, Award as AwardType } from "@/types";

/* ── Badge level → accent mapping ────────────────── */
const badgeLevelMeta: Record<
  string,
  {
    variant: "cyan" | "purple" | "orange" | "green";
    icon: React.ReactNode;
    color: string;
  }
> = {
  Fundamentals: {
    variant: "green",
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "var(--color-accent-green)",
  },
  Associate: {
    variant: "cyan",
    icon: <BadgeCheck className="h-4 w-4" />,
    color: "var(--color-accent-cyan)",
  },
  Expert: {
    variant: "purple",
    icon: <Star className="h-4 w-4" />,
    color: "var(--color-accent-purple)",
  },
};

const defaultBadgeMeta = {
  variant: "cyan" as const,
  icon: <BadgeCheck className="h-4 w-4" />,
  color: "var(--color-accent-cyan)",
};

/* ── Verification seal SVG animation ─────────────── */
function VerificationSeal({ color }: { color: string }) {
  return (
    <motion.svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      className="absolute -top-2 -right-2 z-20 pointer-events-none"
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5, duration: 0.6, ease: "backOut" }}
    >
      {/* Outer ring */}
      <motion.circle
        cx="22"
        cy="22"
        r="18"
        stroke={color}
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      {/* Inner filled circle */}
      <circle cx="22" cy="22" r="14" fill={color} opacity="0.15" />
      {/* Checkmark */}
      <motion.path
        d="M15 22 L20 27 L29 17"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.4 }}
      />
    </motion.svg>
  );
}

/* ── Certification card content ──────────────────── */
function CertFrontContent({
  cert,
  meta,
}: {
  cert: Certification;
  meta: (typeof badgeLevelMeta)[string];
}) {
  return (
    <div className="relative">
      {/* Particle aura — CSS radial pulse (matching award cards) */}
      <div
        className="absolute -inset-4 z-0 pointer-events-none rounded-xl opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${meta.color}, transparent 70%)`,
          animation: "radar-ping 3s ease-in-out infinite",
        }}
      />

      <div className="relative z-10">
        <VerificationSeal color={meta.color} />

        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
              meta.variant === "cyan" &&
                "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan",
              meta.variant === "purple" &&
                "border-accent-purple/30 bg-accent-purple/10 text-accent-purple",
              meta.variant === "green" &&
                "border-accent-green/30 bg-accent-green/10 text-accent-green",
              meta.variant === "orange" &&
                "border-accent-orange/30 bg-accent-orange/10 text-accent-orange",
            )}
          >
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0 pr-8">
            <h3 className="text-base font-semibold text-text-primary leading-snug">
              {cert.name}
            </h3>
            <p className="mt-0.5 text-sm text-text-secondary">{cert.issuer}</p>
          </div>
        </div>

        {/* Status + badge level */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {cert.status && (
            <PillBadge
              label={cert.status}
              variant={cert.status === "Active" ? "green" : "muted"}
              size="sm"
              dot
            />
          )}
          {cert.badge_level && (
            <PillBadge
              label={cert.badge_level}
              variant={meta.variant}
              size="sm"
              icon={meta.icon}
            />
          )}
        </div>

        {/* Dates */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {cert.earned_date && (
            <div>
              <span className="text-text-muted">Earned</span>
              <p className="text-text-secondary">{cert.earned_date}</p>
            </div>
          )}
          {cert.expiry_date && (
            <div>
              <span className="text-text-muted">Expires</span>
              <p className="text-text-secondary">{cert.expiry_date}</p>
            </div>
          )}
        </div>

        {/* Flip hint */}
        <div className="mt-4 flex items-center gap-1 text-[10px] text-text-muted opacity-50">
          <RotateCcw className="h-3 w-3" />
          Click to flip
        </div>
      </div>
    </div>
  );
}

function CertBackContent({
  cert,
  meta: _meta,
}: {
  cert: Certification;
  meta: (typeof badgeLevelMeta)[string];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-text-primary mb-3">
        Credential Details
      </h4>

      <div className="space-y-3 text-xs">
        {cert.credential_id && (
          <div>
            <span className="text-text-muted">Credential ID</span>
            <p className="font-mono text-text-secondary break-all">
              {cert.credential_id}
            </p>
          </div>
        )}
        {cert.certification_number && (
          <div>
            <span className="text-text-muted">Certification #</span>
            <p className="font-mono text-text-secondary">
              {cert.certification_number}
            </p>
          </div>
        )}
        {cert.earned_date && (
          <div>
            <span className="text-text-muted">Earned</span>
            <p className="text-text-secondary">{cert.earned_date}</p>
          </div>
        )}
        {cert.expiry_date && (
          <div>
            <span className="text-text-muted">Expires</span>
            <p className="text-text-secondary">{cert.expiry_date}</p>
          </div>
        )}
      </div>

      {/* Verification link */}
      {cert.verification_url && (
        <a
          href={cert.verification_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent-cyan hover:text-accent-cyan/80 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Verify online
        </a>
      )}

      {/* Back hint */}
      <div className="mt-4 flex items-center gap-1 text-[10px] text-text-muted opacity-50">
        <RotateCcw className="h-3 w-3" />
        Click to flip back
      </div>
    </div>
  );
}

/* ── Award card content ──────────────────────────── */
function AwardFrontContent({ award }: { award: AwardType }) {
  return (
    <div className="relative">
      {/* Particle aura — CSS radial pulse */}
      <div
        className="absolute -inset-4 z-0 pointer-events-none rounded-xl opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--color-accent-orange), transparent 70%)",
          animation: "radar-ping 3s ease-in-out infinite",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent-orange/30 bg-accent-orange/10 text-accent-orange">
            <Trophy className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text-primary leading-snug">
              {award.title}
            </h3>
            <p className="mt-0.5 text-sm text-text-secondary">{award.issuer}</p>
          </div>
        </div>

        {/* Description */}
        {award.description && (
          <p className="mt-3 text-sm text-text-secondary leading-relaxed">
            {award.description}
          </p>
        )}

        {/* Highlights */}
        {award.highlights && award.highlights.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {award.highlights.map((highlight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.3 + i * 0.05,
                  duration: 0.3,
                }}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-orange" />
                {highlight}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ── Fallback card for medium/low tier ───────────── */
function FallbackCertCard({
  cert,
  index,
}: {
  cert: Certification;
  index: number;
}) {
  const meta = badgeLevelMeta[cert.badge_level ?? ""] ?? defaultBadgeMeta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      <GlowCard glowVariant={meta.variant} className="p-6">
        <CertFrontContent cert={cert} meta={meta} />
      </GlowCard>
    </motion.div>
  );
}

function FallbackAwardCard({
  award,
  index,
}: {
  award: AwardType;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      <GlowCard glowVariant="orange" className="p-6">
        <AwardFrontContent award={award} />
      </GlowCard>
    </motion.div>
  );
}

/* ── Empty state ──────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[--color-border-custom] bg-bg-elevated">
        <Award className="h-7 w-7 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">
        No certifications or awards yet
      </h3>
      <p className="mt-1 text-sm text-text-muted">
        Certifications and awards will appear here once added.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN CERTIFICATIONS & AWARDS SECTION
   ═══════════════════════════════════════════════════════ */
export function CertificationsAwards() {
  const {
    certifications,
    loading: certsLoading,
    error: certsError,
  } = useCertifications();
  const { awards, loading: awardsLoading, error: awardsError } = useAwards();
  const tier = useDeviceTier();
  const useHolographic = tier === "high";

  const loading = certsLoading || awardsLoading;
  const error = certsError || awardsError;
  const isEmpty =
    !loading && !error && certifications.length === 0 && awards.length === 0;

  return (
    <section
      id="certifications"
      className="section-bg-certs px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          label="Credentials"
          title="Certifications & Awards"
          entrance="unlock"
          subtitle="Professional certifications and academic recognitions earned along the way."
        />

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-[--color-border-custom] bg-bg-elevated p-6"
              >
                <LoadingShimmer lines={5} />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-xl border border-accent-pink/30 bg-accent-pink/5 p-6 text-center">
            <p className="text-accent-pink font-medium">
              Failed to load certifications & awards
            </p>
            <p className="mt-1 text-sm text-text-muted">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && <EmptyState />}

        {/* Content */}
        {!loading && !error && !isEmpty && (
          <div className="space-y-14">
            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-accent-cyan" />
                  <h3 className="text-lg font-semibold text-text-primary">
                    Certifications
                  </h3>
                </div>

                {/* Staggered masonry-like grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {certifications.map((cert, index) => {
                    const meta =
                      badgeLevelMeta[cert.badge_level ?? ""] ??
                      defaultBadgeMeta;

                    if (useHolographic) {
                      return (
                        <HolographicCard
                          key={cert.id}
                          index={index}
                          accentColor={meta.color}
                          unlockEntrance
                          backContent={
                            <CertBackContent cert={cert} meta={meta} />
                          }
                        >
                          <CertFrontContent cert={cert} meta={meta} />
                        </HolographicCard>
                      );
                    }

                    return (
                      <FallbackCertCard
                        key={cert.id}
                        cert={cert}
                        index={index}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Awards */}
            {awards.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent-orange" />
                  <h3 className="text-lg font-semibold text-text-primary">
                    Awards
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {awards.map((award, index) => {
                    if (useHolographic) {
                      return (
                        <HolographicCard
                          key={award.id}
                          index={index}
                          accentColor="var(--color-accent-orange)"
                          unlockEntrance
                        >
                          <AwardFrontContent award={award} />
                        </HolographicCard>
                      );
                    }

                    return (
                      <FallbackAwardCard
                        key={award.id}
                        award={award}
                        index={index}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
