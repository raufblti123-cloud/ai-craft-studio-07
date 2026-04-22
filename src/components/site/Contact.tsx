import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message required").max(2000),
});

export const Contact = ({ profile }: { profile: Profile | null }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("messages").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("Could not send. Try again.");
      return;
    }
    toast.success("Message sent. I'll be in touch.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-32">
      <div className="container-tight">
        <SectionHeading
          index="04"
          label="Contact"
          title="Let's build something."
          subtitle="Internships, collaborations, or a quick hello — I read every message."
        />

        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-6">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="flex items-start gap-4 group">
                <Mail size={18} className="text-primary mt-1" />
                <div>
                  <div className="label-mono mb-1">Email</div>
                  <div className="text-sm group-hover:text-primary transition break-all">{profile.email}</div>
                </div>
              </a>
            )}
            {profile?.location && (
              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-primary mt-1" />
                <div>
                  <div className="label-mono mb-1">Location</div>
                  <div className="text-sm">{profile.location}</div>
                </div>
              </div>
            )}
            <div className="border border-border p-5 bg-card/40 font-mono text-xs text-muted-foreground leading-relaxed">
              <span className="text-primary">$</span> status --availability
              <br />
              <span className="text-foreground">→ open to internships & entry-level roles</span>
            </div>
          </div>

          <form onSubmit={submit} className="md:col-span-3 space-y-4">
            <div>
              <label className="label-mono block mb-2">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                className="w-full bg-input border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="label-mono block mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                className="w-full bg-input border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary transition"
                placeholder="you@domain.com"
              />
            </div>
            <div>
              <label className="label-mono block mb-2">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                maxLength={2000}
                className="w-full bg-input border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary transition resize-none"
                placeholder="Tell me about your idea..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 font-mono text-sm uppercase tracking-widest hover:glow-ring transition disabled:opacity-50"
            >
              {loading ? "Transmitting..." : "Send Message"}
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
