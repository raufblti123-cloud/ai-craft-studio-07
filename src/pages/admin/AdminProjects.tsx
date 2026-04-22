import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, Field, inputCls, btnPrimary, btnDanger, btnGhost } from "@/components/admin/ui";
import { Project } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2, Save, Upload, X } from "lucide-react";

const empty = (): Partial<Project> => ({
  title: "",
  description: "",
  image_url: "",
  tech_stack: [],
  github_url: "",
  demo_url: "",
  sort_order: 0,
});

export default function AdminProjects() {
  const [list, setList] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    if (data) setList(data as Project[]);
  };
  useEffect(() => { load(); }, []);

  const upload = async (f: File) => {
    setUploading(true);
    const ext = f.name.split(".").pop();
    const path = `public/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, f);
    if (error) { setUploading(false); toast.error(error.message); return; }
    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    setEditing((e) => ({ ...e!, image_url: data.publicUrl }));
    setUploading(false);
  };

  const save = async () => {
    if (!editing?.title) return toast.error("Title required");
    const payload = {
      title: editing.title!,
      description: editing.description ?? null,
      image_url: editing.image_url || null,
      tech_stack: editing.tech_stack ?? [],
      github_url: editing.github_url || null,
      demo_url: editing.demo_url || null,
      sort_order: editing.sort_order ?? list.length + 1,
    };
    const { error } = editing.id
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <>
      <AdminHeader
        title="Projects"
        subtitle="Manage your portfolio projects."
        action={<button className={btnPrimary} onClick={() => setEditing(empty())}><Plus size={14} /> New</button>}
      />

      {editing && (
        <div className="border border-primary/40 bg-card/60 p-6 mb-8 corner-brackets relative">
          <div className="flex items-center justify-between mb-5">
            <span className="label-mono text-primary">{editing.id ? "Editing" : "New project"}</span>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Title"><input className={inputCls} value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Sort order"><input type="number" className={inputCls} value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea rows={4} className={inputCls + " resize-none"} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </Field>
            </div>
            <Field label="Tech stack (comma-separated)">
              <input className={inputCls} value={(editing.tech_stack ?? []).join(", ")} onChange={(e) => setEditing({ ...editing, tech_stack: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
            </Field>
            <Field label="GitHub URL"><input className={inputCls} value={editing.github_url ?? ""} onChange={(e) => setEditing({ ...editing, github_url: e.target.value })} /></Field>
            <Field label="Demo URL"><input className={inputCls} value={editing.demo_url ?? ""} onChange={(e) => setEditing({ ...editing, demo_url: e.target.value })} /></Field>
            <div>
              <span className="label-mono block mb-2">Image</span>
              <label className={btnGhost + " cursor-pointer"}>
                <Upload size={12} /> {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              </label>
            </div>
            {editing.image_url && (
              <div className="md:col-span-2">
                <img src={editing.image_url} alt="preview" className="max-h-48 border border-border" />
              </div>
            )}
          </div>
          <div className="mt-6 flex gap-3">
            <button className={btnPrimary} onClick={save}><Save size={12} /> Save</button>
            <button className={btnGhost} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {list.map((p) => (
          <div key={p.id} className="border border-border p-4 flex gap-4 items-center">
            {p.image_url ? <img src={p.image_url} alt="" className="w-16 h-16 object-cover border border-border" /> : <div className="w-16 h-16 bg-secondary" />}
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground truncate">{p.description}</div>
            </div>
            <button className={btnGhost} onClick={() => setEditing(p)}>Edit</button>
            <button className={btnDanger} onClick={() => del(p.id)}><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
    </>
  );
}
