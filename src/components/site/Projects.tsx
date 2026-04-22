import { ArrowUpRight, Github } from "lucide-react";
import { Project } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";

export const Projects = ({ projects }: { projects: Project[] }) => (
  <section id="projects" className="py-32">
    <div className="container-tight">
      <SectionHeading
        index="02"
        label="Projects"
        title="Selected work."
        subtitle="A growing collection of AI experiments, tools, and prototypes."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <article key={p.id} className="card-cyber corner-brackets group p-6 flex flex-col">
            {p.image_url && (
              <div className="aspect-video mb-5 overflow-hidden border border-border bg-muted">
                <img
                  src={p.image_url}
                  alt={`${p.title} preview`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}
            <h3 className="font-display text-2xl font-medium mb-2">{p.title}</h3>
            {p.description && (
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.description}</p>
            )}
            {p.tech_stack?.length ? (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {p.tech_stack.map((t) => (
                  <span key={t} className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 bg-secondary text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="flex items-center gap-4 mt-5 pt-5 border-t border-border">
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition">
                  <Github size={14} /> Code
                </a>
              )}
              {p.demo_url && (
                <a href={p.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary ml-auto group/d">
                  Live Demo <ArrowUpRight size={14} className="group-hover/d:translate-x-0.5 group-hover/d:-translate-y-0.5 transition" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      {projects.length === 0 && (
        <p className="text-center text-muted-foreground font-mono text-sm py-12">// no projects yet</p>
      )}
    </div>
  </section>
);
