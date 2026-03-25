interface SectionCardProps {
  id: string;
  label: string;
}

const sectionMeta: Record<string, { icon: string; description: string }> = {
  performance: {
    icon: "📊",
    description: "Brand KPI trends, market share, and share of voice across tracked categories.",
  },
  perception: {
    icon: "🧠",
    description: "Awareness, consideration, preference, and brand equity funnel metrics.",
  },
  campaign: {
    icon: "📣",
    description: "Campaign recall, messaging resonance, and media effectiveness analysis.",
  },
  behavior: {
    icon: "🛒",
    description: "Purchase intent, trial rates, repeat purchase behaviour, and basket analysis.",
  },
  customer: {
    icon: "👥",
    description: "Customer satisfaction (CSAT), NPS, loyalty drivers, and segment profiling.",
  },
  deepdive: {
    icon: "🔬",
    description: "Advanced cross-tabulations, verbatim analysis, and custom insight explorations.",
  },
};

const SectionCard = ({ id, label }: SectionCardProps) => {
  const meta = sectionMeta[id] ?? { icon: "📋", description: "Content coming soon." };

  return (
    <section id={id} className="scroll-mt-20">
      {/* Section heading row */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xl">{meta.icon}</span>
        <h2 className="text-lg font-bold tracking-tight text-foreground">{label}</h2>
        <div className="flex-1 border-t border-border-dim" />
        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
          Wave Q4 2024
        </span>
      </div>

      {/* Placeholder card grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Description card */}
        <div className="col-span-full rounded-xl border border-border-dim bg-surface p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Section Overview
          </p>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        </div>

        {/* Three placeholder metric tiles */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-xl border border-border-dim bg-surface p-5"
          >
            <div className="h-2.5 w-24 animate-pulse rounded bg-surface-2" />
            <div className="h-8 w-16 animate-pulse rounded bg-surface-2" />
            <div className="h-2 w-full animate-pulse rounded bg-surface-2" />
            <div className="h-2 w-3/4 animate-pulse rounded bg-surface-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              Section content coming in next phase.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionCard;
