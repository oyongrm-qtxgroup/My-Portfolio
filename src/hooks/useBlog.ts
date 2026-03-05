import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/types";

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supaError } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (supaError) {
        throw supaError;
      }

      setPosts(data ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch blog posts";
      setError(message);
      console.error("useBlog error:", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the post
        const { data, error: supaError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();

        if (supaError) {
          throw supaError;
        }

        setPost(data);

        // Increment view count (fire-and-forget)
        if (data) {
          supabase
            .rpc("increment_blog_views", { post_id: data.id })
            .then(({ error: rpcError }) => {
              if (rpcError) {
                console.warn("Failed to increment views:", rpcError.message);
              }
            });
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch blog post";
        setError(message);
        console.error("useBlogPost error:", message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
}
