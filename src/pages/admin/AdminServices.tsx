import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, Field, inputCls, btnPrimary, btnDanger, btnGhost } from "@/components/admin/ui";
import { Service } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2, Save, X } from "lucide-react";

const empty = (): Partial<Service> => ({ title: "", description: "", icon: "Sparkles", sort_order: 0 });

export default function AdminServices() {
  const [list, setList] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    if (data) setList(data as Service[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title) return toast.error("Title required");
    const payload = {
      title: editing.title!,
      description: editing.description ?? null,
      icon: editing.icon ?? null,
      sort_order: editing.sort_order ?? list.length + 1,
    };
    const { error } = editing.id
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <>
      <AdminHeader
        title="Services"
        subtitle="What you offer."
        action={<button className={btnPrimary} onClick={() => setEditing(empty())}><Plus size={14} /> New</button>}
      />

      {editing && (
        <div className="border border-primary/40 bg-card/60 p-6 mb-8 corner-brackets relative">
          <div className="flex items-center justify-between mb-5">
            <span className="label-mono text-primary">{editing.id ? "Editing" : "New service"}</span>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Title"><input className={inputCls} value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Icon (Lucide name, e.g. Sparkles)"><input className={inputCls} value={editing.icon ?? ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea rows={3} className={inputCls + " resize-none"} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </Field>
            </div>
            <Field label="Sort order"><input type="number" className={inputCls} value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></Field>
          </div>
          <div className="mt-6 flex gap-3">
            <button className={btnPrimary} onClick={save}><Save size={12} /> Save</button>
            <button className={btnGhost} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.map((s) => (
          <div key={s.id} className="border border-border p-4 flex gap-4 items-center">
            <div className="font-mono text-xs text-primary w-20">{s.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg">{s.title}</div>
              <div className="text-xs text-muted-foreground truncate">{s.description}</div>
            </div>
            <button className={btnGhost} onClick={() => setEditing(s)}>Edit</button>
            <button className={btnDanger} onClick={() => del(s.id)}><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
    </>
  );
}
