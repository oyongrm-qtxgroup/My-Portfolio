import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, Terminal, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    if (error) {
      setError(error);
    } else {
      setDone(true);
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent-cyan/20 via-accent-purple/20 to-accent-cyan/20 opacity-50 blur-xl" />

        <div className="relative rounded-2xl border border-border-custom bg-bg-secondary/90 p-8 backdrop-blur-sm">
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-cyan/30 bg-accent-cyan/10">
              <Terminal className="h-6 w-6 text-accent-cyan" />
            </div>
            <div className="text-center">
              <h1 className="font-display text-xl font-bold text-text-primary">
                Set New Password
              </h1>
              <p className="mt-1 font-mono text-xs text-text-secondary">
                Choose a strong password for your admin account
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-mono text-xs text-red-400">
              {error}
            </div>
          )}

          {done ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle className="h-10 w-10 text-accent-green" />
              <p className="font-mono text-sm text-accent-green">
                Password updated! Redirecting…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="new-password"
                  className="font-mono text-xs text-text-secondary"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="pl-10 bg-bg-primary border-border-custom text-text-primary placeholder:text-text-muted focus:border-accent-cyan focus:ring-accent-cyan/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="font-mono text-xs text-text-secondary"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="pl-10 bg-bg-primary border-border-custom text-text-primary placeholder:text-text-muted focus:border-accent-cyan focus:ring-accent-cyan/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-cyan text-bg-primary font-semibold hover:bg-accent-cyan/90 disabled:opacity-50"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
