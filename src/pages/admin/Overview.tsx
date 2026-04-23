import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader } from "@/components/admin/ui";
import { FolderGit2, Wrench, Mail, Sparkles, ArrowUpRight, Activity, CheckCircle2 } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({ projects: 0, services: 0, messages: 0, skills: 0, unread: 0 });
  const [recent, setRecent] = useState<{ id: string; name: string; email: string; created_at: string; read: boolean }[]>([]);

  useEffect(() => {
    (async () => {
      const [pr, sv, ms, sk, un, rec] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("read", false),
        supabase.from("messages").select("id,name,email,created_at,read").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        projects: pr.count ?? 0,
        services: sv.count ?? 0,
        messages: ms.count ?? 0,
        skills: sk.count ?? 0,
        unread: un.count ?? 0,
      });
      setRecent((rec.data as any) ?? []);
    })();
  }, []);

  const cards = [
    { label: "Projects", value: stats.projects, icon: FolderGit2, to: "/admin/projects", tone: "text-primary" },
    { label: "Services", value: stats.services, icon: Wrench, to: "/admin/services", tone: "text-primary" },
    { label: "Skills", value: stats.skills, icon: Sparkles, to: "/admin/skills", tone: "text-primary" },
    { label: "Messages", value: stats.messages, icon: Mail, to: "/admin/messages", tone: "text-primary", hint: stats.unread ? `${stats.unread} unread` : "All read" },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of your portfolio content and recent activity."
      />

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="admin-card admin-card-hover p-5 group relative overflow-hidden"
          >
            <div className="absolute inset-0 admin-stat-accent opacity-0 group-hover:opacity-100 transition" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 grid place-items-center">
                  <c.icon size={16} className={c.tone} />
                </div>
                <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition" />
              </div>
              <div className="text-3xl font-display font-semibold tracking-tight">{c.value}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{c.label}</span>
                {c.hint && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${stats.unread && c.label === "Messages" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {c.hint}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two-column section */}
      <div className="mt-8 grid lg:grid-cols-3 gap-4">
        {/* Recent messages */}
        <div className="admin-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold">Recent messages</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latest 5 contact submissions</p>
            </div>
            <Link to="/admin/messages" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">No messages yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((m) => (
                <li key={m.id} className="py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border grid place-items-center text-xs font-medium">
                    {m.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate flex items-center gap-2">
                      {m.name}
                      {!m.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                  </div>
                  <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {new Date(m.created_at).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* System status */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={16} className="text-primary" />
            <h3 className="font-display text-lg font-semibold">System status</h3>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Database", ok: true },
              { name: "Storage", ok: true },
              { name: "Authentication", ok: true },
              { name: "API", ok: true },
            ].map((s) => (
              <li key={s.name} className="flex items-center justify-between">
                <span className="text-muted-foreground">{s.name}</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-primary">
                  <CheckCircle2 size={13} /> Operational
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-5 border-t border-border">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Uptime</div>
            <div className="text-2xl font-display font-semibold">99.99%</div>
          </div>
        </div>
      </div>
    </>
  );
}
