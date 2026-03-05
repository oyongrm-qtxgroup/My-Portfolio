import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Eye, Tag } from "lucide-react";
import { useBlogPost } from "@/hooks/useBlog";
import { formatDate, formatViews } from "@/lib/utils";
import { PillBadge } from "@/components/ui/PillBadge";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";

/* ── Scroll progress bar ─────────────────────────── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-bg-secondary/50">
      <motion.div
        className="h-full bg-accent-cyan"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

/* ── Blog Post loading skeleton ──────────────────── */
function BlogPostSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-32">
      <div className="mb-8 h-4 w-24 rounded bg-bg-elevated animate-pulse" />
      <div className="mb-4 h-10 w-3/4 rounded bg-bg-elevated animate-pulse" />
      <div className="mb-6 h-6 w-1/2 rounded bg-bg-elevated animate-pulse" />
      <div className="flex gap-3 mb-12">
        <div className="h-6 w-16 rounded-full bg-bg-elevated animate-pulse" />
        <div className="h-6 w-20 rounded-full bg-bg-elevated animate-pulse" />
      </div>
      <LoadingShimmer lines={8} />
    </div>
  );
}

/* ── Blog Post error ─────────────────────────────── */
function BlogPostError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-4 text-5xl opacity-20">📄</div>
      <h2 className="text-2xl font-bold text-text-primary">
        Article not found
      </h2>
      <p className="mt-2 max-w-md text-text-secondary">{message}</p>
      <Link
        to="/#blog"
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-2 text-sm font-mono text-accent-cyan hover:bg-accent-cyan/20 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to articles
      </Link>
    </div>
  );
}

/* ── Blog Post page ──────────────────────────────── */
export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post, loading, error } = useBlogPost(slug ?? "");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <BlogPostSkeleton />;

  if (error || !post) {
    return (
      <BlogPostError
        message={error ?? "This article doesn't exist or has been unpublished."}
      />
    );
  }

  return (
    <>
      <ScrollProgress />

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-2xl px-4 pb-24 pt-28 sm:px-6"
      >
        {/* Back link */}
        <button
          onClick={() => navigate("/#blog")}
          className="group mb-8 inline-flex items-center gap-2 text-sm font-mono text-text-secondary hover:text-accent-cyan transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to articles
        </button>

        {/* Header */}
        <header className="mb-10">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <PillBadge
                  key={tag}
                  label={tag}
                  variant="cyan"
                  size="sm"
                  icon={<Tag className="h-3 w-3" />}
                />
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-muted font-mono border-t border-[--color-border-custom] pt-6">
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.published_at)}
              </span>
            )}
            {post.read_time_minutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.read_time_minutes} min read
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {formatViews(post.views)} views
            </span>
          </div>
        </header>

        {/* Cover image */}
        {post.cover_image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-10 overflow-hidden rounded-xl border border-[--color-border-custom]"
          >
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full object-cover"
            />
          </motion.div>
        )}

        {/* Markdown content */}
        {post.content && (
          <div className="prose-portfolio">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Bottom divider and back link */}
        <div className="mt-16 border-t border-[--color-border-custom] pt-8">
          <button
            onClick={() => navigate("/#blog")}
            className="group inline-flex items-center gap-2 text-sm font-mono text-text-secondary hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to all articles
          </button>
        </div>
      </motion.article>
    </>
  );
}
