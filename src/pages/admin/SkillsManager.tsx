import { useEffect, useState } from "react";
import { useAdminSkills } from "@/hooks/admin/useAdminSkills";
import { ImageUpload, ImagePreview } from "@/components/admin/ImageUpload";
import type { Skill } from "@/types";
import { toast } from "sonner";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const empty: Omit<Skill, "id"> = {
  name: "",
  category: "",
  icon_url: null,
  is_featured: false,
};

export default function SkillsManager() {
  const { skills, loading, fetchAll, create, update, remove } =
    useAdminSkills();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openNew = () => {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (s: Skill) => {
    setEditId(s.id);
    setForm({
      name: s.name,
      category: s.category,
      icon_url: s.icon_url,
      is_featured: s.is_featured,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editId) {
        await update(editId, form);
        toast.success("Skill updated");
      } else {
        await create(form);
        toast.success("Skill created");
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
      toast.success("Skill deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
    setDeleteId(null);
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Group for display
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Skills</h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Manage your skill set
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Skill
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
                  Icon
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs">
                  Name
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs">
                  Category
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs text-center">
                  Featured
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((s) => (
                <TableRow key={s.id} className="border-border-custom">
                  <TableCell>
                    <ImagePreview url={s.icon_url} />
                  </TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="font-mono text-xs text-text-secondary">
                    {s.category}
                  </TableCell>
                  <TableCell className="text-center">
                    {s.is_featured && (
                      <span className="text-accent-cyan text-xs">★</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="rounded p-1.5 hover:bg-bg-elevated transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="rounded p-1.5 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {skills.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center font-mono text-sm text-text-muted"
                  >
                    No skills yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-bg-secondary border-border-custom text-text-primary">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editId ? "Edit Skill" : "New Skill"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Name *
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Category *
                </Label>
                <Input
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="e.g. Frontend, Backend"
                  className="bg-bg-primary border-border-custom"
                  list="skill-categories"
                />
                <datalist id="skill-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Icon
              </Label>
              <ImageUpload
                value={form.icon_url}
                onChange={(url) => set("icon_url", url)}
                folder="skills"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_featured}
                onCheckedChange={(v) => set("is_featured", v)}
              />
              <Label className="font-mono text-xs text-text-secondary">
                Featured
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
              disabled={saving || !form.name || !form.category}
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
              Delete Skill?
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
