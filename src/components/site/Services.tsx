import * as Icons from "lucide-react";
import { Service } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";

export const Services = ({ services }: { services: Service[] }) => (
  <section id="services" className="py-32">
    <div className="container-tight">
      <SectionHeading index="03" label="Services" title="What I can help with." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {services.map((s, i) => {
          const Icon = (s.icon && (Icons as any)[s.icon]) || Icons.Sparkles;
          return (
            <div key={s.id} className="bg-background p-8 group hover:bg-card transition">
              <div className="flex items-center justify-between mb-6">
                <Icon className="text-primary" size={22} />
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition">{s.title}</h3>
              {s.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
