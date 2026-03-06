import { useEffect, useState } from "react";
import { useAdminBlog } from "@/hooks/admin/useAdminBlog";
import { ImageUpload, ImagePreview } from "@/components/admin/ImageUpload";
import type { BlogPost } from "@/types";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";

const empty: Omit<BlogPost, "id" | "views"> = {
  title: "",
  slug: "",
  excerpt: null,
  content: null,
  tags: [],
  cover_image_url: null,
  is_published: false,
  read_time_minutes: null,
  published_at: null,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function BlogManager() {
  const { posts, loading, fetchAll, create, update, remove } = useAdminBlog();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [tagsInput, setTagsInput] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openNew = () => {
    setEditId(null);
    setForm(empty);
    setTagsInput("");
    setAutoSlug(true);
    setOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      tags: p.tags,
      cover_image_url: p.cover_image_url,
      is_published: p.is_published,
      read_time_minutes: p.read_time_minutes,
      published_at: p.published_at,
    });
    setTagsInput(p.tags.join(", "));
    setAutoSlug(false);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        published_at:
          form.is_published && !form.published_at
            ? new Date().toISOString()
            : form.published_at,
      };
      if (editId) {
        await update(editId, data);
        toast.success("Post updated");
      } else {
        await create(data);
        toast.success("Post created");
      }
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      toast.success("Post deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
    setDeleteId(null);
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (title: string) => {
    set("title", title);
    if (autoSlug) set("slug", slugify(title));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Blog</h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Manage blog posts with Markdown
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90"
        >
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
        </div>
      ) : (
        <div className="rounded-xl border border-border-custom overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border-custom hover:bg-transparent">
                <TableHead className="text-text-secondary font-mono text-xs w-10">
                  Img
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs">
                  Title
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden md:table-cell">
                  Status
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden md:table-cell">
                  Views
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden lg:table-cell">
                  Published
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((p) => (
                <TableRow key={p.id} className="border-border-custom">
                  <TableCell>
                    <ImagePreview url={p.cover_image_url} />
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{p.title}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.tags.slice(0, 2).map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="text-[10px] bg-bg-elevated text-text-secondary border-border-custom"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {p.is_published ? (
                      <Badge className="text-[10px] bg-accent-green/10 text-accent-green border-accent-green/20">
                        <Eye className="mr-1 h-3 w-3" /> Published
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-bg-elevated text-text-muted border-border-custom"
                      >
                        <EyeOff className="mr-1 h-3 w-3" /> Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs text-text-secondary">
                    {p.views}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs text-text-secondary">
                    {p.published_at
                      ? new Date(p.published_at).toLocaleDateString()
                      : "–"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="rounded p-1.5 hover:bg-bg-elevated transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="rounded p-1.5 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center font-mono text-sm text-text-muted"
                  >
                    No blog posts yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-bg-secondary border-border-custom text-text-primary">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editId ? "Edit Post" : "New Post"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Title *
                </Label>
                <Input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Slug *
                </Label>
                <Input
                  value={form.slug}
                  onChange={(e) => {
                    set("slug", e.target.value);
                    setAutoSlug(false);
                  }}
                  className="bg-bg-primary border-border-custom font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Excerpt
              </Label>
              <Textarea
                value={form.excerpt ?? ""}
                onChange={(e) => set("excerpt", e.target.value || null)}
                rows={2}
                className="bg-bg-primary border-border-custom"
              />
            </div>

            {/* Markdown editor with preview */}
            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Content (Markdown)
              </Label>
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="bg-bg-elevated border border-border-custom">
                  <TabsTrigger
                    value="write"
                    className="font-mono text-xs data-[state=active]:bg-bg-primary"
                  >
                    Write
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="font-mono text-xs data-[state=active]:bg-bg-primary"
                  >
                    Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                  <Textarea
                    value={form.content ?? ""}
                    onChange={(e) => set("content", e.target.value || null)}
                    rows={16}
                    className="bg-bg-primary border-border-custom font-mono text-xs leading-relaxed"
                    placeholder="Write your blog post in Markdown…"
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="min-h-[256px] max-h-[400px] overflow-y-auto rounded-lg border border-border-custom bg-bg-primary p-4 prose prose-invert prose-sm max-w-none">
                    {form.content ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {form.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-text-muted italic">
                        Nothing to preview yet…
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Tags (comma-separated)
                </Label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Azure, AI, Tutorial"
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Read Time (minutes)
                </Label>
                <Input
                  type="number"
                  value={form.read_time_minutes ?? ""}
                  onChange={(e) =>
                    set(
                      "read_time_minutes",
                      e.target.value ? parseInt(e.target.value) : null,
                    )
                  }
                  className="bg-bg-primary border-border-custom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Cover Image
              </Label>
              <ImageUpload
                value={form.cover_image_url}
                onChange={(url) => set("cover_image_url", url)}
                folder="blog"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_published}
                onCheckedChange={(v) => set("is_published", v)}
              />
              <Label className="font-mono text-xs text-text-secondary">
                Published
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border-custom"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.title || !form.slug}
              className="bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-bg-secondary border-border-custom">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-text-primary">
              Delete Post?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-text-secondary">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border-custom text-text-primary">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
