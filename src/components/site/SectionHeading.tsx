export const SectionHeading = ({
  index,
  label,
  title,
  subtitle,
}: {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="mb-14 max-w-2xl">
    <div className="flex items-center gap-3 mb-4">
      <span className="font-mono text-xs text-primary">{index}</span>
      <span className="hairline flex-1" />
      <span className="label-mono">{label}</span>
    </div>
    <h2 className="font-display text-4xl md:text-5xl font-medium leading-tight">{title}</h2>
    {subtitle && <p className="mt-4 text-muted-foreground leading-relaxed">{subtitle}</p>}
  </div>
);
