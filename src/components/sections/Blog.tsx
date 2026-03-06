import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, Eye } from "lucide-react";
import { formatDate, formatViews } from "@/lib/utils";
import { useBlog } from "@/hooks/useBlog";
import { useDeviceTier } from "@/contexts/DeviceCapabilityContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { PillBadge } from "@/components/ui/PillBadge";
import { GridShimmer } from "@/components/ui/LoadingShimmer";
import type { BlogPost } from "@/types";

/* ── Reading progress ring ───────────────────────── */
function ReadingProgressRing({
  minutes,
  size = 36,
}: {
  minutes: number;
  size?: number;
}) {
  const maxMinutes = 20;
  const ratio = Math.min(1, minutes / maxMinutes);
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - ratio);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-border-glow)"
          strokeWidth="2"
          opacity="0.3"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-accent-cyan)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute text-[9px] font-mono text-accent-cyan">
        {minutes}m
      </span>
    </div>
  );
}

/* ── Floating tag pill ───────────────────────────── */
function FloatingTag({ tag, delay }: { tag: string; delay: number }) {
  return (
    <motion.span
      className="inline-block"
      style={{
        animation: `float-tag ${3 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <PillBadge label={tag} variant="cyan" size="sm" />
    </motion.span>
  );
}

/* ── Blog card ───────────────────────────────────── */
function BlogCard({
  post,
  index,
  parallaxOffset,
}: {
  post: BlogPost;
  index: number;
  parallaxOffset: number;
}) {
  const tier = useDeviceTier();
  const doParallax = tier !== "low";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      style={doParallax ? { y: parallaxOffset } : undefined}
    >
      <Link to={`/blog/${post.slug}`} className="group block h-full">
        <GlowCard
          as="article"
          tilt
          glowVariant="cyan"
          className="h-full p-0 flex flex-col overflow-hidden"
        >
          {/* Cover image */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "192px",
            }}
          >
            {post.cover_image_url ? (
              <img
                src={post.cover_image_url}
                alt={post.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-bg-secondary to-bg-elevated flex items-center justify-center">
                <div className="text-6xl opacity-10 font-display font-bold select-none">
                  AI
                </div>
              </div>
            )}
            {/* Gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated via-bg-elevated/40 to-transparent" />

            {/* Reading time ring (top-right corner) */}
            {post.read_time_minutes && (
              <div className="absolute top-3 right-3 z-10">
                <ReadingProgressRing minutes={post.read_time_minutes} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-6 pt-4">
            {/* Tags — floating animation for high/medium tier */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {post.tags
                  .slice(0, 3)
                  .map((tag, ti) =>
                    tier !== "low" ? (
                      <FloatingTag key={tag} tag={tag} delay={ti * 0.4} />
                    ) : (
                      <PillBadge
                        key={tag}
                        label={tag}
                        variant="cyan"
                        size="sm"
                      />
                    ),
                  )}
                {post.tags.length > 3 && (
                  <PillBadge
                    label={`+${post.tags.length - 3}`}
                    variant="muted"
                    size="sm"
                  />
                )}
              </div>
            )}

            {/* Title */}
            <h3 className="font-bold text-text-primary group-hover:text-accent-cyan transition-colors duration-200 line-clamp-2 text-lg">
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mt-2 text-sm text-text-secondary flex-1 line-clamp-2">
                {post.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div className="mt-4 flex items-center gap-4 text-xs text-text-muted font-mono border-t border-[--color-border-custom] pt-4">
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.published_at)}
                </span>
              )}
              {post.read_time_minutes && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {post.read_time_minutes} min
                </span>
              )}
              <span className="flex items-center gap-1.5 ml-auto">
                <Eye className="h-3 w-3" />
                {formatViews(post.views)}
              </span>
            </div>
          </div>
        </GlowCard>
      </Link>
    </motion.div>
  );
}

/* ── Empty state ─────────────────────────────────── */
function EmptyBlog() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 text-5xl opacity-20">📝</div>
      <h3 className="text-xl font-bold text-text-primary">No articles yet</h3>
      <p className="mt-2 max-w-sm text-text-secondary">
        Blog posts are on the way. Check back soon for deep dives into AI
        engineering, system design, and more.
      </p>
    </motion.div>
  );
}

/* ── Error state ─────────────────────────────────── */
function BlogError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 text-5xl opacity-20">⚠️</div>
      <h3 className="text-xl font-bold text-text-primary">
        Failed to load articles
      </h3>
      <p className="mt-2 max-w-sm text-text-secondary">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-2 text-sm font-mono text-accent-cyan hover:bg-accent-cyan/20 transition-colors"
      >
        Try again
      </button>
    </motion.div>
  );
}

/* ── Blog section ────────────────────────────────── */
export function Blog() {
  const { posts, loading, error, refetch } = useBlog();
  const tier = useDeviceTier();

  // Parallax offsets — each card drifts at a different scroll speed
  const parallaxSpeeds = useMemo(
    () => posts.map((_, i) => (i % 3 === 0 ? 0 : i % 3 === 1 ? -8 : 8)),
    [posts.length],
  );

  return (
    <section
      id="blog"
      className="section-bg-blog relative px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="Blog"
          title="Latest Articles"
          entrance="cascade"
          subtitle="Deep dives into AI engineering, system architecture, and lessons from the trenches."
        />

        {/* Loading */}
        {loading && <GridShimmer count={3} />}

        {/* Error */}
        {!loading && error && <BlogError message={error} onRetry={refetch} />}

        {/* Empty */}
        {!loading && !error && posts.length === 0 && <EmptyBlog />}

        {/* Uniform grid — all cards same size */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post, i) => (
              <BlogCard
                key={post.id}
                post={post}
                index={i}
                parallaxOffset={parallaxSpeeds[i] ?? 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
