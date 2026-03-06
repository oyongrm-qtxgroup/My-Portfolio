import { useEffect, useState } from "react";
import { useAdminProjects } from "@/hooks/admin/useAdminProjects";
import { ImageUpload, ImagePreview } from "@/components/admin/ImageUpload";
import type { Project } from "@/types";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Info,
  GripVertical,
} from "lucide-react";

const empty: Omit<Project, "id" | "created_at"> = {
  title: "",
  tagline: null,
  description: null,
  industry: null,
  tags: [],
  impact: null,
  difficulty: null,
  build_time: null,
  demo_url: null,
  github_url: null,
  thumbnail_url: null,
  featured: false,
  is_new: false,
  order_index: 0,
};

/* ── Sortable table row ──────────────────────────── */
function SortableRow({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className="border-border-custom">
      <TableCell
        className="w-8 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-text-muted" />
      </TableCell>
      <TableCell className="font-mono text-xs text-text-muted">
        {project.order_index}
      </TableCell>
      <TableCell>
        <ImagePreview url={project.thumbnail_url} />
      </TableCell>
      <TableCell className="font-medium">{project.title}</TableCell>
      <TableCell className="hidden md:table-cell font-mono text-xs text-text-secondary">
        {project.industry ?? "–"}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="text-[10px] bg-bg-elevated text-text-secondary border-border-custom"
            >
              {t}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="text-[10px] bg-bg-elevated text-text-muted border-border-custom"
            >
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center gap-1">
          {project.featured && (
            <Badge className="text-[10px] bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30">
              ★ Featured
            </Badge>
          )}
          {project.is_new && (
            <Badge className="text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
              New
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <button
            onClick={() => onEdit(project)}
            className="rounded p-1.5 hover:bg-bg-elevated transition-colors"
          >
            <Pencil className="h-3.5 w-3.5 text-text-secondary" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="rounded p-1.5 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-400" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function ProjectsManager() {
  const { projects, loading, fetchAll, create, update, remove, reorder } =
    useAdminProjects();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openNew = () => {
    setEditId(null);
    setForm(empty);
    setTagsInput("");
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      tagline: p.tagline,
      description: p.description,
      industry: p.industry,
      tags: p.tags,
      impact: p.impact,
      difficulty: p.difficulty,
      build_time: p.build_time,
      demo_url: p.demo_url,
      github_url: p.github_url,
      thumbnail_url: p.thumbnail_url,
      featured: p.featured,
      is_new: p.is_new,
      order_index: p.order_index,
    });
    setTagsInput(p.tags.join(", "));
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
      };
      if (editId) {
        await update(editId, data);
        toast.success("Project updated");
      } else {
        await create(data);
        toast.success("Project created");
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
      toast.success("Project deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
    setDeleteId(null);
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ── Drag-and-drop ─────────────────────────────── */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = projects.findIndex((p) => p.id === active.id);
    const newIdx = projects.findIndex((p) => p.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;

    const reordered = arrayMove(projects, oldIdx, newIdx);

    try {
      await reorder(reordered);
      toast.success("Order updated");
    } catch (err: any) {
      toast.error(err.message);
      await fetchAll(); // rollback on failure
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Projects</h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Manage your portfolio projects
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      {/* Sorting explanation */}
      <div className="rounded-lg border border-border-custom bg-bg-elevated/50 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
          <div className="space-y-1 text-xs text-text-secondary">
            <p className="font-semibold text-text-primary">
              How project sorting works
            </p>
            <p>
              Projects are sorted by{" "}
              <code className="rounded bg-bg-primary px-1 py-0.5 font-mono text-accent-cyan">
                order_index
              </code>{" "}
              ascending (lowest number first). <strong>Drag &amp; drop</strong>{" "}
              rows below to reorder — the index values are updated
              automatically.
            </p>
            <p>
              The <strong>Featured</strong> and <strong>New</strong> flags are
              purely visual badges and do <em>not</em> affect sort order.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="rounded-xl border border-border-custom overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border-custom hover:bg-transparent">
                    <TableHead className="text-text-secondary font-mono text-xs w-8" />
                    <TableHead className="text-text-secondary font-mono text-xs w-12">
                      #
                    </TableHead>
                    <TableHead className="text-text-secondary font-mono text-xs w-10">
                      Img
                    </TableHead>
                    <TableHead className="text-text-secondary font-mono text-xs">
                      Title
                    </TableHead>
                    <TableHead className="text-text-secondary font-mono text-xs hidden md:table-cell">
                      Industry
                    </TableHead>
                    <TableHead className="text-text-secondary font-mono text-xs hidden lg:table-cell">
                      Tags
                    </TableHead>
                    <TableHead className="text-text-secondary font-mono text-xs text-center">
                      Status
                    </TableHead>
                    <TableHead className="text-text-secondary font-mono text-xs text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((p) => (
                    <SortableRow
                      key={p.id}
                      project={p}
                      onEdit={openEdit}
                      onDelete={setDeleteId}
                    />
                  ))}
                  {projects.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-12 text-center font-mono text-sm text-text-muted"
                      >
                        No projects yet. Click "Add Project" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-bg-secondary border-border-custom text-text-primary">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editId ? "Edit Project" : "New Project"}
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
                  onChange={(e) => set("title", e.target.value)}
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Industry
                </Label>
                <Input
                  value={form.industry ?? ""}
                  onChange={(e) => set("industry", e.target.value || null)}
                  className="bg-bg-primary border-border-custom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Tagline
              </Label>
              <Input
                value={form.tagline ?? ""}
                onChange={(e) => set("tagline", e.target.value || null)}
                className="bg-bg-primary border-border-custom"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Description
              </Label>
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => set("description", e.target.value || null)}
                rows={3}
                className="bg-bg-primary border-border-custom"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Impact
                </Label>
                <Input
                  value={form.impact ?? ""}
                  onChange={(e) => set("impact", e.target.value || null)}
                  placeholder="e.g. Very High"
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Difficulty
                </Label>
                <Input
                  value={form.difficulty ?? ""}
                  onChange={(e) => set("difficulty", e.target.value || null)}
                  placeholder="e.g. Advanced"
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Build Time
                </Label>
                <Input
                  value={form.build_time ?? ""}
                  onChange={(e) => set("build_time", e.target.value || null)}
                  placeholder="e.g. 6 months"
                  className="bg-bg-primary border-border-custom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Tags (comma-separated)
              </Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, TypeScript, Node.js"
                className="bg-bg-primary border-border-custom"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Demo URL
                </Label>
                <Input
                  value={form.demo_url ?? ""}
                  onChange={(e) => set("demo_url", e.target.value || null)}
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  GitHub URL
                </Label>
                <Input
                  value={form.github_url ?? ""}
                  onChange={(e) => set("github_url", e.target.value || null)}
                  className="bg-bg-primary border-border-custom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Thumbnail
              </Label>
              <ImageUpload
                value={form.thumbnail_url}
                onChange={(url) => set("thumbnail_url", url)}
                folder="projects"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Order Index
                </Label>
                <Input
                  type="number"
                  value={form.order_index}
                  onChange={(e) =>
                    set("order_index", parseInt(e.target.value) || 0)
                  }
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => set("featured", v)}
                />
                <Label className="font-mono text-xs text-text-secondary">
                  Featured
                </Label>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={form.is_new}
                  onCheckedChange={(v) => set("is_new", v)}
                />
                <Label className="font-mono text-xs text-text-secondary">
                  New
                </Label>
              </div>
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
              disabled={saving || !form.title}
              className="bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-bg-secondary border-border-custom">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-text-primary">
              Delete Project?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-text-secondary">
              This action cannot be undone. The project will be permanently
              removed.
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
