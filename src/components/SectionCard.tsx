import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { getMockData } from "@/data/mockData";
import PerformanceSection from "@/components/performance/PerformanceSection";
import PerceptionSection from "@/components/perception/PerceptionSection";
import CampaignSection from "@/components/campaign/CampaignSection";
import BehaviorSection from "@/components/behavior/BehaviorSection";
import CustomerSection from "@/components/customer/CustomerSection";
import DeepDiveSection from "@/components/deepdive/DeepDiveSection";

interface SectionCardProps {
  id: string;
  label: string;
}

// ── Section heading row ───────────────────────────────────────────────────────

const SECTION_META: Record<string, { icon: string; description: string }> = {
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

// ── Full-section heading wrapper ──────────────────────────────────────────────

function SectionHeading({ label, icon }: { id?: string; label: string; icon: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {/* Left blue accent bar */}
      <div className="h-6 w-[3px] rounded-full shrink-0" style={{ background: 'hsl(var(--primary))' }} />
      <span className="text-xl leading-none">{icon}</span>
      <h2 className="text-[20px] font-bold tracking-tight text-foreground">{label}</h2>
      <div className="flex-1 border-t border-border-dim" />
      <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
        Wave Q4 2024
      </span>
    </div>
  );
}

// ── Placeholder sections ─────────────────────────────────────────────────────

const PlaceholderSection = ({ id, label }: SectionCardProps) => {
  const { filters } = useFilters();
  const data = useMemo(() => getMockData(filters), [filters]);
  const meta = SECTION_META[id] ?? { icon: "📋", description: "Content coming soon." };

  const previewStats = useMemo(() => {
    if (id === "campaign") return [
      { label: "Ad Recall",     value: `${data.campaignKpis.adRecall}%`          },
      { label: "Cmpn. Aware.",  value: `${data.campaignKpis.campaignAwareness}%` },
      { label: "Msg Recall",    value: `${data.campaignKpis.messageRecall}%`     },
    ];
    if (id === "behavior") return [
      { label: "Co. SoV",          value: `${data.behavior.shareOfAwareness["company"]}%`                              },
      { label: "SoW",              value: `${data.kpis.shareOfWallet}%`                                                },
      { label: "Purchase Intent",  value: `${data.funnel.find((f) => f.brandId === "company")!.purchaseIntent}%`       },
    ];
    if (id === "customer") return [
      { label: "App Installed",  value: `${data.customerProfile.appInstalled.Yes}%`     },
      { label: "Heavy Users",    value: `${data.customerProfile.usageFrequency.Heavy}%` },
      { label: "Mid Income",     value: `${data.customerProfile.income.Mid}%`           },
    ];
    if (id === "deepdive") {
      const au = data.deepDiveMatrix.find((r) => r.segment === "App User")!;
      const hi = data.deepDiveMatrix.find((r) => r.segment === "High Income")!;
      const gz = data.deepDiveMatrix.find((r) => r.segment === "Gen Z (18-24)")!;
      return [
        { label: "App User Aware.",   value: `${au.awareness}`        },
        { label: "High Inc. Intent",  value: `${hi.purchaseIntent}`   },
        { label: "GenZ Aware.",       value: `${gz.awareness}`        },
      ];
    }
    return [];
  }, [id, data]);

  return (
    <section id={id} className="scroll-mt-20">
      <SectionHeading id={id} label={label} icon={meta.icon} />

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
          <div key={i} className="flex flex-col gap-2 rounded-xl border border-border-dim bg-surface p-5">
            <div className="h-2.5 w-24 animate-pulse rounded bg-surface-2" />
            <div className="h-8 w-16 animate-pulse rounded bg-surface-2" />
            <div className="h-2 w-full animate-pulse rounded bg-surface-2" />
            <p className="mt-2 text-xs text-muted-foreground">Charts coming in next phase.</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── Router ────────────────────────────────────────────────────────────────────

const SectionCard = ({ id, label }: SectionCardProps) => {
  if (id === "performance") {
    return (
      <section id="performance" className="scroll-mt-20">
        <SectionHeading id="performance" label="Performance" icon="📊" />
        <PerformanceSection />
      </section>
    );
  }

  if (id === "perception") {
    return (
      <section id="perception" className="scroll-mt-20">
        <SectionHeading id="perception" label="Perception" icon="🧠" />
        <PerceptionSection />
      </section>
    );
  }

  if (id === "campaign") {
    return (
      <section id="campaign" className="scroll-mt-20">
        <SectionHeading label="Campaign" icon="📣" />
        <CampaignSection />
      </section>
    );
  }

  if (id === "behavior") {
    return (
      <section id="behavior" className="scroll-mt-20">
        <SectionHeading id="behavior" label="Category & Behaviour" icon="🛒" />
        <BehaviorSection />
      </section>
    );
  }

  if (id === "customer") {
    return (
      <section id="customer" className="scroll-mt-20">
        <SectionHeading id="customer" label="Customer Understanding" icon="👥" />
        <CustomerSection />
      </section>
    );
  }

  if (id === "deepdive") {
    return (
      <section id="deepdive" className="scroll-mt-20">
        <SectionHeading id="deepdive" label="Funnel Deep Dive" icon="🔬" />
        <DeepDiveSection />
      </section>
    );
  }

  return <PlaceholderSection id={id} label={label} />;
};

export default SectionCard;
