import { ReactNode } from "react";

export const AdminHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) => (
  <div className="flex items-end justify-between gap-4 mb-8 pb-6 border-b border-border">
    <div>
      <h1 className="font-display text-3xl font-medium">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block">
    <span className="label-mono block mb-2">{label}</span>
    {children}
  </label>
);

export const inputCls =
  "w-full bg-input border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary transition";

export const btnPrimary =
  "inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 font-mono text-xs uppercase tracking-widest hover:glow-ring transition disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition";

export const btnDanger =
  "inline-flex items-center gap-2 border border-border px-3 py-2 font-mono text-xs uppercase tracking-widest hover:border-destructive hover:text-destructive transition";
