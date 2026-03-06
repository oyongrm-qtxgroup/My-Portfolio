import { useEffect, useState } from "react";
import { useAdminCertifications } from "@/hooks/admin/useAdminCertifications";
import type { Certification } from "@/types";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const empty: Omit<Certification, "id"> = {
  name: "",
  issuer: "",
  credential_id: null,
  certification_number: null,
  earned_date: null,
  expiry_date: null,
  status: "Active",
  verification_url: null,
  badge_level: null,
  order_index: 0,
};

export default function CertificationsManager() {
  const { certifications, loading, fetchAll, create, update, remove } =
    useAdminCertifications();
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

  const openEdit = (c: Certification) => {
    setEditId(c.id);
    setForm({
      name: c.name,
      issuer: c.issuer,
      credential_id: c.credential_id,
      certification_number: c.certification_number,
      earned_date: c.earned_date,
      expiry_date: c.expiry_date,
      status: c.status,
      verification_url: c.verification_url,
      badge_level: c.badge_level,
      order_index: c.order_index,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editId) {
        await update(editId, form);
        toast.success("Certification updated");
      } else {
        await create(form);
        toast.success("Certification created");
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
      toast.success("Certification deleted");
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
          <h1 className="font-display text-2xl font-bold">Certifications</h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Manage professional certifications
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Certification
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
                  Name
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden md:table-cell">
                  Issuer
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden md:table-cell">
                  Status
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden lg:table-cell">
                  Badge
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certifications.map((c) => (
                <TableRow key={c.id} className="border-border-custom">
                  <TableCell className="font-mono text-xs text-text-muted">
                    {c.order_index}
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs text-text-secondary">
                    {c.issuer}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${c.status === "Active" ? "bg-accent-green/10 text-accent-green border-accent-green/20" : "bg-bg-elevated text-text-muted border-border-custom"}`}
                    >
                      {c.status ?? "–"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs text-text-secondary">
                    {c.badge_level ?? "–"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="rounded p-1.5 hover:bg-bg-elevated transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => setDeleteId(c.id)}
                        className="rounded p-1.5 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {certifications.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center font-mono text-sm text-text-muted"
                  >
                    No certifications yet.
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
              {editId ? "Edit Certification" : "New Certification"}
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
                  Issuer *
                </Label>
                <Input
                  value={form.issuer}
                  onChange={(e) => set("issuer", e.target.value)}
                  className="bg-bg-primary border-border-custom"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Credential ID
                </Label>
                <Input
                  value={form.credential_id ?? ""}
                  onChange={(e) => set("credential_id", e.target.value || null)}
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Certification Number
                </Label>
                <Input
                  value={form.certification_number ?? ""}
                  onChange={(e) =>
                    set("certification_number", e.target.value || null)
                  }
                  className="bg-bg-primary border-border-custom"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Earned Date
                </Label>
                <Input
                  value={form.earned_date ?? ""}
                  onChange={(e) => set("earned_date", e.target.value || null)}
                  placeholder="e.g. December 2024"
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Expiry Date
                </Label>
                <Input
                  value={form.expiry_date ?? ""}
                  onChange={(e) => set("expiry_date", e.target.value || null)}
                  placeholder="e.g. December 2027"
                  className="bg-bg-primary border-border-custom"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Status
                </Label>
                <Input
                  value={form.status ?? ""}
                  onChange={(e) => set("status", e.target.value || null)}
                  placeholder="Active"
                  className="bg-bg-primary border-border-custom"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs text-text-secondary">
                  Badge Level
                </Label>
                <Input
                  value={form.badge_level ?? ""}
                  onChange={(e) => set("badge_level", e.target.value || null)}
                  placeholder="e.g. Associate"
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
                Verification URL
              </Label>
              <Input
                value={form.verification_url ?? ""}
                onChange={(e) =>
                  set("verification_url", e.target.value || null)
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
              disabled={saving || !form.name || !form.issuer}
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
              Delete Certification?
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
