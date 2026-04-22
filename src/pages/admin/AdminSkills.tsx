import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, btnPrimary, btnDanger, inputCls } from "@/components/admin/ui";
import { Skill } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");

  const load = async () => {
    const { data } = await supabase.from("skills").select("*").order("sort_order");
    if (data) setSkills(data as Skill[]);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from("skills").insert({ name: name.trim(), level: level.trim() || null, sort_order: skills.length + 1 });
    if (error) return toast.error(error.message);
    setName(""); setLevel("");
    load();
  };

  const update = async (s: Skill) => {
    const { error } = await supabase.from("skills").update({ name: s.name, level: s.level, sort_order: s.sort_order }).eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
  };

  const del = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <>
      <AdminHeader title="Skills" subtitle="Add, edit, or remove skills." />
      <div className="border border-border p-4 mb-6 grid sm:grid-cols-[1fr_180px_auto] gap-3">
        <input className={inputCls} placeholder="Skill name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={inputCls} placeholder="Level (optional)" value={level} onChange={(e) => setLevel(e.target.value)} />
        <button className={btnPrimary} onClick={add}><Plus size={14} /> Add</button>
      </div>
      <div className="space-y-2">
        {skills.map((s, i) => (
          <div key={s.id} className="grid sm:grid-cols-[40px_1fr_180px_80px_auto_auto] gap-2 items-center border border-border p-3">
            <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <input className={inputCls} value={s.name} onChange={(e) => setSkills(skills.map(x => x.id === s.id ? { ...x, name: e.target.value } : x))} />
            <input className={inputCls} value={s.level ?? ""} onChange={(e) => setSkills(skills.map(x => x.id === s.id ? { ...x, level: e.target.value } : x))} />
            <input type="number" className={inputCls} value={s.sort_order} onChange={(e) => setSkills(skills.map(x => x.id === s.id ? { ...x, sort_order: Number(e.target.value) } : x))} />
            <button className={btnPrimary} onClick={() => update(s)}><Save size={12} /></button>
            <button className={btnDanger} onClick={() => del(s.id)}><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
    </>
  );
}
