import { useEffect, useState } from "react";
import { useAdminContacts } from "@/hooks/admin/useAdminContacts";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Eye, Mail, RefreshCw } from "lucide-react";
import type { ContactMessage } from "@/hooks/admin/useAdminContacts";

export default function ContactMessages() {
  const { messages, loading, fetchAll, remove } = useAdminContacts();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMsg, setViewMsg] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      toast.success("Message deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Messages</h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            Contact form submissions ({messages.length})
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchAll}
          className="border-border-custom"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
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
                <TableHead className="text-text-secondary font-mono text-xs">
                  Name
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden md:table-cell">
                  Email
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs">
                  Message
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs hidden lg:table-cell">
                  Date
                </TableHead>
                <TableHead className="text-text-secondary font-mono text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((m) => (
                <TableRow key={m.id} className="border-border-custom">
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <a
                      href={`mailto:${m.email}`}
                      className="font-mono text-xs text-accent-cyan hover:underline flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" /> {m.email}
                    </a>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate font-mono text-xs text-text-secondary">
                      {m.message}
                    </p>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs text-text-secondary">
                    {new Date(m.created_at).toLocaleDateString()}{" "}
                    {new Date(m.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setViewMsg(m)}
                        className="rounded p-1.5 hover:bg-bg-elevated transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => setDeleteId(m.id)}
                        className="rounded p-1.5 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {messages.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center font-mono text-sm text-text-muted"
                  >
                    No messages yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Message Dialog */}
      <Dialog open={!!viewMsg} onOpenChange={() => setViewMsg(null)}>
        <DialogContent className="max-w-lg bg-bg-secondary border-border-custom text-text-primary">
          <DialogHeader>
            <DialogTitle className="font-display">
              Message from {viewMsg?.name}
            </DialogTitle>
          </DialogHeader>
          {viewMsg && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-xs text-text-muted mb-1">Name</p>
                  <p className="text-sm">{viewMsg.name}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-text-muted mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${viewMsg.email}`}
                    className="text-sm text-accent-cyan hover:underline"
                  >
                    {viewMsg.email}
                  </a>
                </div>
              </div>
              <div>
                <p className="font-mono text-xs text-text-muted mb-1">Date</p>
                <p className="text-sm">
                  {new Date(viewMsg.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-text-muted mb-1">
                  Message
                </p>
                <div className="rounded-lg border border-border-custom bg-bg-primary p-4 font-mono text-sm text-text-primary whitespace-pre-wrap">
                  {viewMsg.message}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setViewMsg(null)}
                  className="border-border-custom"
                >
                  Close
                </Button>
                <Button
                  asChild
                  className="bg-accent-cyan text-bg-primary hover:bg-accent-cyan/90"
                >
                  <a href={`mailto:${viewMsg.email}`}>Reply via Email</a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-bg-secondary border-border-custom">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-text-primary">
              Delete Message?
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
