import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { getMockData } from "@/data/mockData";
import PerformanceSection from "@/components/performance/PerformanceSection";

interface SectionCardProps {
  id: string;
  label: string;
}

const sectionMeta: Record<string, { icon: string; description: string }> = {
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

// ── Performance section wrapper ──────────────────────────────────────────────

const PerformanceSectionWrapper = () => (
  <section id="performance" className="scroll-mt-20">
    <div className="mb-5 flex items-center gap-3">
      <span className="text-xl">📊</span>
      <h2 className="text-lg font-bold tracking-tight text-foreground">Performance</h2>
      <div className="flex-1 border-t border-border-dim" />
      <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
        Wave Q4 2024
      </span>
    </div>
    <PerformanceSection />
  </section>
);

// ── Placeholder sections ─────────────────────────────────────────────────────

const PlaceholderSection = ({ id, label }: SectionCardProps) => {
  const { filters } = useFilters();
  const data = useMemo(() => getMockData(filters), [filters]);
  const meta = sectionMeta[id] ?? { icon: "📋", description: "Content coming soon." };

  const previewStats = useMemo(() => {
    if (id === "perception") {
      const c = data.funnel.find((f) => f.brandId === "company")!;
      return [
        { label: "Familiarity",    value: `${c.familiarity}%`       },
        { label: "Consideration",  value: `${c.consideration}%`     },
        { label: "BEI",            value: `${c.brandEquityIndex}`   },
      ];
    }
    if (id === "campaign") {
      return [
        { label: "Ad Recall",     value: `${data.campaignKpis.adRecall}%`           },
        { label: "Cmpn. Aware.",  value: `${data.campaignKpis.campaignAwareness}%`  },
        { label: "Msg Recall",    value: `${data.campaignKpis.messageRecall}%`      },
      ];
    }
    if (id === "behavior") {
      return [
        { label: "Co. SoV",          value: `${data.behavior.shareOfAwareness["company"]}%`            },
        { label: "SoW",              value: `${data.kpis.shareOfWallet}%`                              },
        { label: "Purchase Intent",  value: `${data.funnel.find((f) => f.brandId === "company")!.purchaseIntent}%` },
      ];
    }
    if (id === "customer") {
      return [
        { label: "App Installed",  value: `${data.customerProfile.appInstalled.Yes}%`     },
        { label: "Heavy Users",    value: `${data.customerProfile.usageFrequency.Heavy}%` },
        { label: "Mid Income",     value: `${data.customerProfile.income.Mid}%`           },
      ];
    }
    if (id === "deepdive") {
      const appUser   = data.deepDiveMatrix.find((r) => r.segment === "App User")!;
      const highInc   = data.deepDiveMatrix.find((r) => r.segment === "High Income")!;
      const genZ      = data.deepDiveMatrix.find((r) => r.segment === "Gen Z (18-24)")!;
      return [
        { label: "App User Aware.",   value: `${appUser.awareness}`  },
        { label: "High Inc. Intent",  value: `${highInc.purchaseIntent}` },
        { label: "GenZ Aware.",       value: `${genZ.awareness}` },
      ];
    }
    return [];
  }, [id, data]);

  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xl">{meta.icon}</span>
        <h2 className="text-lg font-bold tracking-tight text-foreground">{label}</h2>
        <div className="flex-1 border-t border-border-dim" />
        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
          Wave Q4 2024
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-full rounded-xl border border-border-dim bg-surface p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Section Overview
          </p>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        </div>

        {previewStats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 rounded-xl border border-border-dim bg-surface p-5 transition-all duration-300"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">Wave Q4 2024 · filtered view</p>
          </div>
        ))}

        {Array.from({ length: Math.max(0, 3 - previewStats.length) }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="flex flex-col gap-2 rounded-xl border border-border-dim bg-surface p-5"
          >
            <div className="h-2.5 w-24 animate-pulse rounded bg-surface-2" />
            <div className="h-8 w-16 animate-pulse rounded bg-surface-2" />
            <div className="h-2 w-full animate-pulse rounded bg-surface-2" />
            <div className="h-2 w-3/4 animate-pulse rounded bg-surface-2" />
            <p className="mt-2 text-xs text-muted-foreground">Charts coming in next phase.</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── Router ───────────────────────────────────────────────────────────────────

const SectionCard = ({ id, label }: SectionCardProps) => {
  if (id === "performance") return <PerformanceSectionWrapper />;
  return <PlaceholderSection id={id} label={label} />;
};

export default SectionCard;
