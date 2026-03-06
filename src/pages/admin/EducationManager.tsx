import { useEffect, useState } from "react";
import { useAdminEducation } from "@/hooks/admin/useAdminEducation";
import type { Education } from "@/types";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const empty: Omit<Education, "id"> = {
  degree: "",
  institution: "",
  location: null,
  period: null,
  highlights: [],
  order_index: 0,
};

export default function EducationManager() {
  const { education, loading, fetchAll, create, update, remove } =
    useAdminEducation();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [highlightsInput, setHighlightsInput] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openNew = () => {
    setEditId(null);
    setForm(empty);
    setHighlightsInput("");
    setOpen(true);
  };

  const openEdit = (e: Education) => {
    setEditId(e.id);
    setForm({
      degree: e.degree,
      institution: e.institution,
      location: e.location,
      period: e.period,
      highlights: e.highlights,
      order_index: e.order_index,
    });
    setHighlightsInput(e.highlights.join("\n"));
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
      };
      if (editId) {
        await update(editId, data);
        toast.success("Education updated");
      } else {
        await create(data);
        toast.success("Education created");
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
      toast.success("Education deleted");
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
          <h1 className="font-display text-2xl font-bold">Education</h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Manage education entries shown in the downloadable CV/resume
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Education
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
                <TableHead className="text-text-secondary font-mono text-xs w-12">
                  #
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs">
                  Degree
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden md:table-cell">
                  Institution
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
              {education.map((e) => (
                <TableRow key={e.id} className="border-border-custom">
                  <TableCell className="font-mono text-xs text-text-muted">
                    {e.order_index}
                  </TableCell>
                  <TableCell className="font-medium">{e.degree}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs text-text-secondary">
                    {e.institution}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs text-text-secondary">
                    {e.period ?? "–"}
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
              {education.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center font-mono text-sm text-text-muted"
                  >
                    No education entries yet.
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
              {editId ? "Edit Education" : "New Education"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Degree *
              </Label>
              <Input
                value={form.degree}
                onChange={(e) => set("degree", e.target.value)}
                placeholder="Bachelor of Science in Computer Science"
                className="bg-bg-primary border-border-custom"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Institution *
                </Label>
                <Input
                  value={form.institution}
                  onChange={(e) => set("institution", e.target.value)}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Period
                </Label>
                <Input
                  value={form.period ?? ""}
                  onChange={(e) => set("period", e.target.value || null)}
                  placeholder="2014 – 2018"
                  className="bg-bg-primary border-border-custom"
                />
              </div>
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
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-text-secondary">
                Highlights (one per line)
              </Label>
              <Textarea
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                rows={4}
                placeholder="Dean's lister&#10;Graduated with honors"
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
              disabled={saving || !form.degree || !form.institution}
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
              Delete Education?
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
