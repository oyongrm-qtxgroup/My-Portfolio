import { useEffect, useState } from "react";
import { useAdminExperience } from "@/hooks/admin/useAdminExperience";
import { ImageUpload, ImagePreview } from "@/components/admin/ImageUpload";
import type { Experience } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2, Info } from "lucide-react";

const empty: Omit<Experience, "id"> = {
  company: "",
  role: "",
  period: "",
  location: null,
  description: null,
  highlights: [],
  tech_stack: [],
  company_logo_url: null,
  order_index: 0,
};

export default function ExperienceManager() {
  const { experience, loading, fetchAll, create, update, remove } =
    useAdminExperience();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [highlightsInput, setHighlightsInput] = useState("");
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openNew = () => {
    setEditId(null);
    setForm(empty);
    setHighlightsInput("");
    setTechInput("");
    setOpen(true);
  };

  const openEdit = (e: Experience) => {
    setEditId(e.id);
    setForm({
      company: e.company,
      role: e.role,
      period: e.period,
      location: e.location,
      description: e.description,
      highlights: e.highlights,
      tech_stack: e.tech_stack,
      company_logo_url: e.company_logo_url,
      order_index: e.order_index,
    });
    setHighlightsInput(e.highlights.join("\n"));
    setTechInput(e.tech_stack.join(", "));
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        highlights: highlightsInput
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        tech_stack: techInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      if (editId) {
        await update(editId, data);
        toast.success("Experience updated");
      } else {
        await create(data);
        toast.success("Experience created");
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
      toast.success("Experience deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
    setDeleteId(null);
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Experience</h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Manage work experience entries
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      {/* Sorting explanation */}
      <div className="rounded-lg border border-border-custom bg-bg-elevated/50 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
          <div className="space-y-1 text-xs text-text-secondary">
            <p className="font-semibold text-text-primary">
              How experience sorting works
            </p>
            <p>
              Entries are automatically sorted by the{" "}
              <code className="rounded bg-bg-primary px-1 py-0.5 font-mono text-accent-cyan">
                period
              </code>{" "}
              field, newest first. The start date (e.g. <em>Jan 2026</em>) is
              parsed from the period text — make sure it follows the{" "}
              <code className="rounded bg-bg-primary px-1 py-0.5 font-mono text-accent-cyan">
                Mon YYYY – Mon YYYY
              </code>{" "}
              or{" "}
              <code className="rounded bg-bg-primary px-1 py-0.5 font-mono text-accent-cyan">
                Mon YYYY – Present
              </code>{" "}
              format.
            </p>
          </div>
        </div>
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
                <TableHead className="text-text-secondary font-mono text-xs w-12">
                  #
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs w-10">
                  Logo
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs">
                  Company
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden md:table-cell">
                  Role
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden lg:table-cell">
                  Period
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experience.map((e) => (
                <TableRow key={e.id} className="border-border-custom">
                  <TableCell className="font-mono text-xs text-text-muted">
                    {e.order_index}
                  </TableCell>
                  <TableCell>
                    <ImagePreview url={e.company_logo_url} />
                  </TableCell>
                  <TableCell className="font-medium">{e.company}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs text-text-secondary">
                    {e.role}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs text-text-secondary">
                    {e.period}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(e)}
                        className="rounded p-1.5 hover:bg-bg-elevated transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => setDeleteId(e.id)}
                        className="rounded p-1.5 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {experience.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center font-mono text-sm text-text-muted"
                  >
                    No experience entries yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-bg-secondary border-border-custom text-text-primary">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editId ? "Edit Experience" : "New Experience"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Company *
                </Label>
                <Input
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Role *
                </Label>
                <Input
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                  className="bg-bg-primary border-border-custom"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Period *
                </Label>
                <Input
                  value={form.period}
                  onChange={(e) => set("period", e.target.value)}
                  placeholder="e.g. Jan 2023 – Present"
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Location
                </Label>
                <Input
                  value={form.location ?? ""}
                  onChange={(e) => set("location", e.target.value || null)}
                  className="bg-bg-primary border-border-custom"
                />
              </div>
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
            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Highlights (one per line)
              </Label>
              <Textarea
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                rows={4}
                placeholder="Reduced deployment time by 50%&#10;Led team of 5 developers"
                className="bg-bg-primary border-border-custom"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Tech Stack (comma-separated)
              </Label>
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="React, Node.js, PostgreSQL"
                className="bg-bg-primary border-border-custom"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Company Logo
              </Label>
              <ImageUpload
                value={form.company_logo_url}
                onChange={(url) => set("company_logo_url", url)}
                folder="experience"
              />
            </div>
            <div className="space-y-2 w-32">
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
              disabled={saving || !form.company || !form.role || !form.period}
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
              Delete Experience?
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
