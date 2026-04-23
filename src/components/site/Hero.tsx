import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Profile } from "@/lib/types";
import profileImg from "@/assets/profile.png";

const phrases = ["Generative AI Student", "Prompt Engineer", "AI Builder", "Lifelong Learner"];

export const Hero = ({ profile }: { profile: Profile | null }) => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = phrases[idx];
    const speed = deleting ? 40 : 80;
    const t = setTimeout(() => {
      if (!deleting && text === target) {
        setTimeout(() => setDeleting(true), 1400);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setIdx((i) => (i + 1) % phrases.length);
        return;
      }
      setText(deleting ? target.slice(0, text.length - 1) : target.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, idx]);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16">
      <div className="container-tight w-full grid lg:grid-cols-[1fr_auto] gap-12 items-center">
        <div>
        <div className="flex items-center gap-3 mb-8 animate-fade-up">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Available for internships
          </span>
        </div>

        <div className="font-mono text-xs text-primary mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          ~/portfolio $ whoami
        </div>

        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-medium leading-[0.95] tracking-tight animate-fade-up" style={{ animationDelay: "0.2s" }}>
          {profile?.name ?? "Rauf Khan"}
          <span className="text-primary">.</span>
        </h1>

        <div className="mt-6 font-mono text-lg md:text-xl text-muted-foreground animate-fade-up min-h-[2rem]" style={{ animationDelay: "0.35s" }}>
          <span className="text-primary">&gt;</span> <span className="text-foreground">{text}</span>
          <span className="caret" />
        </div>

        <p className="mt-8 max-w-xl text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDelay: "0.5s" }}>
          Building with AI from Islamabad — exploring generative models, prompt systems,
          and the line where engineering meets imagination.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: "0.65s" }}>
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 font-mono text-sm uppercase tracking-widest hover:glow-ring transition"
          >
            View Projects
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border border-border px-5 py-3 font-mono text-sm uppercase tracking-widest hover:border-primary hover:text-primary transition"
          >
            Contact Me
          </a>
          {profile?.location && (
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs ml-auto">
              <MapPin size={14} />
              {profile.location}
            </div>
          )}
        </div>
        </div>

        {/* Portrait — circular */}
        <div className="hidden lg:block animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="relative w-[320px] xl:w-[380px] aspect-square">
            <div className="absolute -inset-4 rounded-full border border-dashed border-primary/30 animate-[spin_22s_linear_infinite]" />
            <div className="absolute -inset-1.5 rounded-full border border-primary/40" />
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />

            <div className="absolute -top-1 left-1/2 -translate-x-1/2 font-mono text-[10px] text-primary tracking-widest bg-background px-2 z-10">
              ID.0x01
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] text-muted-foreground tracking-widest bg-background px-2 z-10">
              RAUF.KHAN
            </div>

            <img
              src={profileImg}
              alt={`${profile?.name ?? "Rauf Khan"} — ${profile?.role ?? "Generative AI Student"}`}
              loading="eager"
              decoding="async"
              className="relative w-full h-full object-cover rounded-full grayscale-[0.15] contrast-[1.05] border-2 border-border shadow-[0_0_60px_-15px_hsl(var(--primary)/0.5)]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-primary/15 via-transparent to-transparent mix-blend-overlay" />
          </div>
        </div>
      </div>

      {/* Decorative side rail */}
      <div className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground rotate-180 [writing-mode:vertical-rl] tracking-[0.4em]">
        SYS.0x01 / GENERATIVE-AI / READY
      </div>
    </section>
  );
};
