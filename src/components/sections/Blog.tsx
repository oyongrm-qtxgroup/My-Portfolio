import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatViews } from "@/lib/utils";
import { useBlog } from "@/hooks/useBlog";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { PillBadge } from "@/components/ui/PillBadge";
import { GridShimmer } from "@/components/ui/LoadingShimmer";
import type { BlogPost } from "@/types";

/* ── Blog card ───────────────────────────────────── */
function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
    >
      <Link to={`/blog/${post.slug}`} className="group block h-full">
        <GlowCard
          as="article"
          tilt
          glowVariant="cyan"
          className="h-full p-0 flex flex-col overflow-hidden"
        >
          {/* Cover image */}
          {post.cover_image_url ? (
            <div className="relative h-48 overflow-hidden">
              <img
                src={post.cover_image_url}
                alt={post.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated via-bg-elevated/40 to-transparent" />
            </div>
          ) : (
            <div className="relative h-48 bg-gradient-to-br from-bg-secondary to-bg-elevated flex items-center justify-center">
              <div className="text-6xl opacity-10 font-display font-bold select-none">
                AI
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated via-transparent to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col p-6 pt-4">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <PillBadge key={tag} label={tag} variant="cyan" size="sm" />
                ))}
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
            <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-cyan transition-colors duration-200 line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mt-2 text-sm text-text-secondary line-clamp-2 flex-1">
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
                  {post.read_time_minutes} min read
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

  return (
    <section
      id="blog"
      className={cn("relative px-4 py-24 sm:px-6 lg:px-8", "bg-bg-secondary")}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="Blog"
          title="Latest Articles"
          subtitle="Deep dives into AI engineering, system architecture, and lessons from the trenches."
        />

        {/* Loading */}
        {loading && <GridShimmer count={3} />}

        {/* Error */}
        {!loading && error && <BlogError message={error} onRetry={refetch} />}

        {/* Empty */}
        {!loading && !error && posts.length === 0 && <EmptyBlog />}

        {/* Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
