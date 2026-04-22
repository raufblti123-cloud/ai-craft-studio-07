import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, Field, inputCls, btnPrimary } from "@/components/admin/ui";
import { Profile } from "@/lib/types";
import { toast } from "sonner";

export default function AdminProfile() {
  const [p, setP] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("profile").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) setP(data as Profile);
    });
  }, []);

  if (!p) return <div className="font-mono text-xs text-muted-foreground">loading...</div>;

  const set = (k: keyof Profile, v: any) => setP({ ...p, [k]: v });

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profile")
      .update({
        name: p.name,
        role: p.role,
        location: p.location,
        email: p.email,
        bio: p.bio,
        languages: p.languages,
        github_url: p.github_url,
        linkedin_url: p.linkedin_url,
        twitter_url: p.twitter_url,
      })
      .eq("id", p.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  };

  return (
    <>
      <AdminHeader title="Profile" subtitle="Update your bio and contact info." />
      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Name"><input className={inputCls} value={p.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Role"><input className={inputCls} value={p.role} onChange={(e) => set("role", e.target.value)} /></Field>
        <Field label="Location"><input className={inputCls} value={p.location ?? ""} onChange={(e) => set("location", e.target.value)} /></Field>
        <Field label="Email"><input className={inputCls} value={p.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Field>
        <div className="md:col-span-2">
          <Field label="Bio">
            <textarea rows={6} className={inputCls + " resize-none"} value={p.bio ?? ""} onChange={(e) => set("bio", e.target.value)} />
          </Field>
        </div>
        <Field label="Languages (comma-separated)">
          <input className={inputCls} value={p.languages.join(", ")} onChange={(e) => set("languages", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} />
        </Field>
        <Field label="GitHub URL"><input className={inputCls} value={p.github_url ?? ""} onChange={(e) => set("github_url", e.target.value)} /></Field>
        <Field label="LinkedIn URL"><input className={inputCls} value={p.linkedin_url ?? ""} onChange={(e) => set("linkedin_url", e.target.value)} /></Field>
        <Field label="Twitter URL"><input className={inputCls} value={p.twitter_url ?? ""} onChange={(e) => set("twitter_url", e.target.value)} /></Field>
      </div>
      <div className="mt-8">
        <button className={btnPrimary} onClick={save} disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
      </div>
    </>
  );
}
