import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader } from "@/components/admin/ui";
import { FolderGit2, Wrench, Mail, Sparkles } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({ projects: 0, services: 0, messages: 0, skills: 0, unread: 0 });

  useEffect(() => {
    (async () => {
      const [pr, sv, ms, sk, un] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("read", false),
      ]);
      setStats({
        projects: pr.count ?? 0,
        services: sv.count ?? 0,
        messages: ms.count ?? 0,
        skills: sk.count ?? 0,
        unread: un.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Projects", value: stats.projects, icon: FolderGit2 },
    { label: "Services", value: stats.services, icon: Wrench },
    { label: "Skills", value: stats.skills, icon: Sparkles },
    { label: "Messages", value: stats.messages, icon: Mail, hint: stats.unread ? `${stats.unread} unread` : undefined },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="At a glance." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-border bg-card/40 p-5 corner-brackets relative">
            <div className="flex items-center justify-between mb-4">
              <span className="label-mono">{c.label}</span>
              <c.icon size={16} className="text-primary" />
            </div>
            <div className="font-display text-4xl font-medium">{c.value}</div>
            {c.hint && <div className="font-mono text-xs text-primary mt-2">{c.hint}</div>}
          </div>
        ))}
      </div>

      <div className="mt-10 border border-border p-6 font-mono text-xs text-muted-foreground bg-card/30">
        <span className="text-primary">$</span> system.status
        <br />
        <span className="text-foreground">→ all services online — content fully editable</span>
      </div>
    </>
  );
}
