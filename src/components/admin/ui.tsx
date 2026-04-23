import { ReactNode } from "react";

export const AdminHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) => (
  <div className="flex items-end justify-between gap-4 mb-8 pb-6 border-b border-border">
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Field = ({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) => (
  <label className="block">
    <span className="block mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    {children}
    {hint && <span className="block mt-1.5 text-xs text-muted-foreground/70">{hint}</span>}
  </label>
);

export const inputCls =
  "w-full bg-input border border-border rounded-md px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

export const btnPrimary =
  "inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.18)] transition disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center gap-2 bg-secondary/60 border border-border text-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:bg-secondary hover:border-primary/50 hover:text-primary transition";

export const btnDanger =
  "inline-flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive px-3 py-2 rounded-md text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition";
