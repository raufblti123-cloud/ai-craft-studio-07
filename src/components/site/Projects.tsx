import { useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { Project } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";

/**
 * Build a resized thumbnail URL using Supabase Storage's image transformation
 * endpoint. Falls back to the original URL for non-Supabase-hosted images.
 *
 * Supabase exposes transforms via:
 *   /storage/v1/object/public/<bucket>/<path>
 *   → /storage/v1/render/image/public/<bucket>/<path>?width=...&quality=...
 */
const buildThumb = (url: string, width: number, quality = 60) => {
  if (!url) return url;
  if (url.includes("/storage/v1/object/public/")) {
    const transformed = url.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/"
    );
    const sep = transformed.includes("?") ? "&" : "?";
    return `${transformed}${sep}width=${width}&quality=${quality}&resize=cover`;
  }
  return url;
};

const ProjectThumb = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  // Tiny blurred placeholder (~24px) loaded instantly, then swapped for the
  // crisp ~800px thumbnail on load. A 1600px srcSet entry serves retina screens.
  const placeholder = buildThumb(src, 24, 30);
  const thumb = buildThumb(src, 800, 65);
  const retina = buildThumb(src, 1600, 65);

  return (
    <div className="relative aspect-video mb-5 overflow-hidden border border-border bg-muted">
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover scale-110 blur-lg transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
      />
      <img
        src={thumb}
        srcSet={`${thumb} 1x, ${retina} 2x`}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`relative w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};

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
              <ProjectThumb src={p.image_url} alt={`${p.title} preview`} />
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
