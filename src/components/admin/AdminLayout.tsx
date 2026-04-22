import { ReactNode } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FolderGit2, Wrench, User, Sparkles, Mail, LogOut, ArrowLeft } from "lucide-react";

const items = [
  { to: "/admin", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/messages", label: "Messages", icon: Mail },
];

export const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-muted-foreground">loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-mono text-xs text-destructive mb-4">ACCESS DENIED</p>
          <p className="text-sm text-muted-foreground mb-6">This account does not have admin privileges.</p>
          <button onClick={async () => { await signOut(); navigate("/auth"); }} className="font-mono text-xs px-4 py-2 border border-border hover:border-primary">Sign out</button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-64 border-b md:border-b-0 md:border-r border-border bg-card/40 md:min-h-screen p-6 flex flex-col">
        <div className="font-mono text-xs tracking-widest mb-8">
          <span className="text-primary">▮</span> ADMIN<span className="text-muted-foreground">/_</span>
        </div>
        <nav className="space-y-1 flex-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 font-mono text-xs uppercase tracking-widest transition border-l-2 ${
                  isActive
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <it.icon size={14} /> {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2 pt-6 border-t border-border">
          <NavLink to="/" className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary">
            <ArrowLeft size={12} /> View site
          </NavLink>
          <button
            onClick={async () => { await signOut(); navigate("/"); }}
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-destructive"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 max-w-5xl">{children ?? <Outlet />}</main>
    </div>
  );
};
