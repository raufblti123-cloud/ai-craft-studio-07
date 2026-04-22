import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, btnDanger, btnGhost } from "@/components/admin/ui";
import { Message } from "@/lib/types";
import { toast } from "sonner";
import { Trash2, Mail, MailOpen } from "lucide-react";

export default function AdminMessages() {
  const [list, setList] = useState<Message[]>([]);

  const load = async () => {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    if (data) setList(data as Message[]);
  };
  useEffect(() => { load(); }, []);

  const toggleRead = async (m: Message) => {
    await supabase.from("messages").update({ read: !m.read }).eq("id", m.id);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete message?")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <>
      <AdminHeader title="Messages" subtitle={`${list.filter(m => !m.read).length} unread`} />
      {list.length === 0 && <p className="text-muted-foreground font-mono text-sm">// no messages</p>}
      <div className="space-y-3">
        {list.map((m) => (
          <div key={m.id} className={`border p-5 ${m.read ? "border-border bg-card/30" : "border-primary/40 bg-card/60"}`}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <div className="font-display text-lg">{m.name}</div>
                <a href={`mailto:${m.email}`} className="font-mono text-xs text-primary hover:underline">{m.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()}
                </span>
                <button className={btnGhost} onClick={() => toggleRead(m)} title={m.read ? "Mark unread" : "Mark read"}>
                  {m.read ? <MailOpen size={12} /> : <Mail size={12} />}
                </button>
                <button className={btnDanger} onClick={() => del(m.id)}><Trash2 size={12} /></button>
              </div>
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{m.message}</p>
          </div>
        ))}
      </div>
    </>
  );
}
