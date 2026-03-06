import { useEffect, useState } from "react";
import { useAdminAwards } from "@/hooks/admin/useAdminAwards";
import type { Award } from "@/types";
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

const empty: Omit<Award, "id"> = {
  title: "",
  issuer: "",
  description: null,
  highlights: [],
  order_index: 0,
};

export default function AwardsManager() {
  const { awards, loading, fetchAll, create, update, remove } =
    useAdminAwards();
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

  const openEdit = (a: Award) => {
    setEditId(a.id);
    setForm({
      title: a.title,
      issuer: a.issuer,
      description: a.description,
      highlights: a.highlights,
      order_index: a.order_index,
    });
    setHighlightsInput(a.highlights.join("\n"));
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
        toast.success("Award updated");
      } else {
        await create(data);
        toast.success("Award created");
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
      toast.success("Award deleted");
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
          <h1 className="font-display text-2xl font-bold">Awards</h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Manage awards and recognitions
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Award
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
                  Title
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden md:table-cell">
                  Issuer
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden lg:table-cell">
                  Description
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {awards.map((a) => (
                <TableRow key={a.id} className="border-border-custom">
                  <TableCell className="font-mono text-xs text-text-muted">
                    {a.order_index}
                  </TableCell>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs text-text-secondary">
                    {a.issuer}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs text-text-secondary max-w-xs truncate">
                    {a.description ?? "–"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(a)}
                        className="rounded p-1.5 hover:bg-bg-elevated transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => setDeleteId(a.id)}
                        className="rounded p-1.5 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {awards.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center font-mono text-sm text-text-muted"
                  >
                    No awards yet.
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
              {editId ? "Edit Award" : "New Award"}
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
                  Issuer *
                </Label>
                <Input
                  value={form.issuer}
                  onChange={(e) => set("issuer", e.target.value)}
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
                placeholder="Won 1st place&#10;Presented to 200+ audience"
                className="bg-bg-primary border-border-custom"
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
              disabled={saving || !form.title || !form.issuer}
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
              Delete Award?
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
