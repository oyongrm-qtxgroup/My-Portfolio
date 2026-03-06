import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Cpu,
  BookOpen,
  Award,
  Trophy,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/skills", label: "Skills", icon: Cpu },
  { to: "/admin/blog", label: "Blog", icon: BookOpen },
  { to: "/admin/certifications", label: "Certifications", icon: Award },
  { to: "/admin/awards", label: "Awards", icon: Trophy },
  { to: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-custom bg-bg-secondary transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between border-b border-border-custom px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-cyan/10 border border-accent-cyan/30">
              <LayoutDashboard className="h-4 w-4 text-accent-cyan" />
            </div>
            <span className="font-display text-sm font-bold text-text-primary">
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden rounded p-1 hover:bg-bg-elevated"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-xs transition-all",
                  isActive
                    ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20"
                    : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary border border-transparent",
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-border-custom p-3">
          <div className="mb-2 truncate px-3 font-mono text-xs text-text-muted">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-xs text-red-400 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-border-custom bg-bg-secondary/50 px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded p-1.5 hover:bg-bg-elevated lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="font-mono text-xs text-text-muted hidden sm:block">
            Portfolio Admin
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161b22",
            border: "1px solid #21262d",
            color: "#e6edf3",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
          },
        }}
      />
    </div>
  );
}
