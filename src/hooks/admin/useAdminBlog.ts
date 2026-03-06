import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/types";

type BlogPostInput = Omit<BlogPost, "id" | "views">;

export function useAdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    // Admin can see all posts, including unpublished
    const { data, error: err } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (err) setError(err.message);
    else setPosts(data ?? []);
    setLoading(false);
  }, []);

  const create = useCallback(
    async (input: BlogPostInput) => {
      const { error: err } = await supabase.from("blog_posts").insert({
        ...input,
        views: 0,
      });
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  const update = useCallback(
    async (id: string, input: Partial<BlogPostInput>) => {
      const { error: err } = await supabase
        .from("blog_posts")
        .update(input)
        .eq("id", id);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  const remove = useCallback(
    async (id: string) => {
      const { error: err } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
      if (err) throw new Error(err.message);
      await fetchAll();
    },
    [fetchAll],
  );

  return { posts, loading, error, fetchAll, create, update, remove };
}
