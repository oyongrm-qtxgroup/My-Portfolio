import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  ShieldCheck,
  ExternalLink,
  Trophy,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCertifications } from "@/hooks/useCertifications";
import { useAwards } from "@/hooks/useAwards";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { PillBadge } from "@/components/ui/PillBadge";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";
import type { Certification, Award as AwardType } from "@/types";

/* ── Badge level → accent mapping ────────────────── */
const badgeLevelMeta: Record<
  string,
  { variant: "cyan" | "purple" | "orange" | "green"; icon: React.ReactNode }
> = {
  Fundamentals: {
    variant: "green",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  Associate: {
    variant: "cyan",
    icon: <BadgeCheck className="h-4 w-4" />,
  },
  Expert: {
    variant: "purple",
    icon: <Star className="h-4 w-4" />,
  },
};

const defaultBadgeMeta = {
  variant: "cyan" as const,
  icon: <BadgeCheck className="h-4 w-4" />,
};

/* ── Certification card ──────────────────────────── */
function CertificationCard({
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
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Badge icon */}
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

          <div className="flex-1 min-w-0">
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

        {/* Details grid */}
        <div className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
          {cert.credential_id && (
            <div>
              <span className="text-text-muted">Credential ID</span>
              <p className="font-mono text-text-secondary">
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
            className={cn(
              "mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-colors",
              "text-accent-cyan hover:text-accent-cyan/80",
            )}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Verify online
          </a>
        )}
      </GlowCard>
    </motion.div>
  );
}

/* ── Award card ──────────────────────────────────── */
function AwardCard({ award, index }: { award: AwardType; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      <GlowCard glowVariant="orange" className="p-6">
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
                  delay: index * 0.1 + 0.2 + i * 0.05,
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

  const loading = certsLoading || awardsLoading;
  const error = certsError || awardsError;
  const isEmpty =
    !loading && !error && certifications.length === 0 && awards.length === 0;

  return (
    <section id="certifications" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          label="Credentials"
          title="Certifications & Awards"
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
          <div className="space-y-12">
            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-accent-cyan" />
                  <h3 className="text-lg font-semibold text-text-primary">
                    Certifications
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {certifications.map((cert, index) => (
                    <CertificationCard
                      key={cert.id}
                      cert={cert}
                      index={index}
                    />
                  ))}
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
                  {awards.map((award, index) => (
                    <AwardCard key={award.id} award={award} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
