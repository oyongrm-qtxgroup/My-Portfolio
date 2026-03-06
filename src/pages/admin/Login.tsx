import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ArrowLeft, Loader2, Terminal } from "lucide-react";

export default function Login() {
  const { user, loading: authLoading, signIn, resetPassword } = useAuth();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  if (!authLoading && user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const { error } = await resetPassword(email);
    if (error) setError(error);
    else setSuccess("Password reset email sent. Check your inbox.");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      {/* Subtle background grid */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative w-full max-w-md">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent-cyan/20 via-accent-purple/20 to-accent-cyan/20 opacity-50 blur-xl" />

        <div className="relative rounded-2xl border border-border-custom bg-bg-secondary/90 p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-cyan/30 bg-accent-cyan/10">
              <Terminal className="h-6 w-6 text-accent-cyan" />
            </div>
            <div className="text-center">
              <h1 className="font-display text-xl font-bold text-text-primary">
                {mode === "login" ? "Admin Access" : "Reset Password"}
              </h1>
              <p className="mt-1 font-mono text-xs text-text-secondary">
                {mode === "login"
                  ? "Authenticate to manage portfolio"
                  : "Enter your email to receive a reset link"}
              </p>
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-mono text-xs text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-accent-green/30 bg-accent-green/10 px-4 py-2 font-mono text-xs text-accent-green">
              {success}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-mono text-xs text-text-secondary"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="pl-10 bg-bg-primary border-border-custom text-text-primary placeholder:text-text-muted focus:border-accent-cyan focus:ring-accent-cyan/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-mono text-xs text-text-secondary"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-bg-primary border-border-custom text-text-primary placeholder:text-text-muted focus:border-accent-cyan focus:ring-accent-cyan/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-cyan text-bg-primary font-semibold hover:bg-accent-cyan/90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Sign In
              </Button>

              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError(null);
                  setSuccess(null);
                }}
                className="w-full text-center font-mono text-xs text-text-secondary hover:text-accent-cyan transition-colors"
              >
                Forgot password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="reset-email"
                  className="font-mono text-xs text-text-secondary"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
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
                Send Reset Link
              </Button>

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccess(null);
                }}
                className="flex w-full items-center justify-center gap-1 font-mono text-xs text-text-secondary hover:text-accent-cyan transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
