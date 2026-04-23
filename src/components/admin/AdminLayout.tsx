import { ReactNode, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, FolderGit2, Wrench, User, Sparkles, Mail,
  LogOut, ArrowLeft, Menu, X, ShieldCheck,
} from "lucide-react";

const items = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/messages", label: "Messages", icon: Mail },
];

export const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading)
    return (
      <div className="admin-scope min-h-screen flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin)
    return (
      <div className="admin-scope min-h-screen flex items-center justify-center px-6">
        <div className="admin-card p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/15 text-destructive mb-4">
            <ShieldCheck size={20} />
          </div>
          <h2 className="font-display text-xl font-semibold mb-2">Access denied</h2>
          <p className="text-sm text-muted-foreground mb-6">This account does not have admin privileges.</p>
          <button
            onClick={async () => { await signOut(); navigate("/auth"); }}
            className="inline-flex items-center gap-2 bg-secondary border border-border px-4 py-2 rounded-md text-sm hover:border-primary/50 hover:text-primary transition"
          >
            Sign out
          </button>
        </div>
      </div>
    );

  const currentItem = items.find((i) =>
    i.end ? location.pathname === i.to : location.pathname.startsWith(i.to),
  );

  const Sidebar = (
    <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-primary/15 border border-primary/30 grid place-items-center">
            <ShieldCheck size={16} className="text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-sidebar-foreground">Admin Console</div>
            <div className="text-[11px] text-muted-foreground">Rauf Khan</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Manage
        </div>
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition relative ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-primary" />}
                <it.icon size={16} className={isActive ? "text-primary" : ""} />
                {it.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="admin-card p-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 grid place-items-center text-primary text-xs font-semibold">
              {user.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{user.email}</div>
              <div className="text-[10px] text-primary">● Online</div>
            </div>
          </div>
        </div>
        <NavLink to="/" className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-primary hover:bg-sidebar-accent transition">
          <ArrowLeft size={12} /> View site
        </NavLink>
        <button
          onClick={async () => { await signOut(); navigate("/"); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
        >
          <LogOut size={12} /> Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="admin-scope min-h-screen flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block sticky top-0 h-screen">{Sidebar}</div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full">{Sidebar}</div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-secondary transition"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <nav className="text-xs text-muted-foreground flex items-center gap-2">
              <span>Admin</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-foreground font-medium">{currentItem?.label ?? "Dashboard"}</span>
            </nav>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-[11px] text-muted-foreground font-mono">v1.0</span>
            <span className="h-4 w-px bg-border" />
            <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
          </div>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} className="md:hidden p-2 rounded-md hover:bg-secondary">
              <X size={18} />
            </button>
          )}
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
};
