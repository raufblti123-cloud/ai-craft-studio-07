import { Profile, Skill } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";

export const About = ({ profile, skills }: { profile: Profile | null; skills: Skill[] }) => (
  <section id="about" className="py-32">
    <div className="container-tight">
      <SectionHeading index="01" label="About" title="A student building with AI." />

      <div className="grid md:grid-cols-5 gap-12">
        <div className="md:col-span-3 space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-foreground/90 text-lg leading-relaxed">{profile?.bio}</p>

          {profile?.languages?.length ? (
            <div className="pt-6">
              <div className="label-mono mb-3">Languages</div>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((l) => (
                  <span key={l} className="font-mono text-xs px-3 py-1 border border-border">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <div className="label-mono mb-4">Skills</div>
          <ul className="space-y-3">
            {skills.map((s, i) => (
              <li
                key={s.id}
                className="flex items-center justify-between border-b border-border pb-3 group"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm">{s.name}</span>
                </span>
                {s.level && (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition">
                    {s.level}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
