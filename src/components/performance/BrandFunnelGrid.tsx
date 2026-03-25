import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Brand, FunnelEntry, WTPBrand } from '@/data/mockData';

// ── Constants ────────────────────────────────────────────────────────────────

type FunnelBarKey = 'totalAwareness' | 'familiarity' | 'consideration' | 'purchaseIntent';

const FUNNEL_STAGES: { key: FunnelBarKey; label: string; alpha: string }[] = [
  { key: 'totalAwareness', label: 'Total Aware.', alpha: 'ff' },
  { key: 'familiarity',    label: 'Familiarity',  alpha: 'cc' },
  { key: 'consideration',  label: 'Consideration',alpha: '99' },
  { key: 'purchaseIntent', label: 'Purch. Intent',alpha: '66' },
];

const WTP_SEGMENTS = [
  { key: 'premium10Plus' as const, label: 'Pay 10%+ Premium', color: '#10B981' },
  { key: 'premium5'      as const, label: 'Pay 5% Premium',   color: '#38BDF8' },
  { key: 'noPremium'     as const, label: 'No Premium',        color: '#F59E0B' },
  { key: 'unwilling'     as const, label: 'Unwilling',         color: '#FB7185' },
];

// ── Category Average ─────────────────────────────────────────────────────────

type CatAvg = Record<FunnelBarKey, number>;

function computeAvg(funnel: FunnelEntry[]): CatAvg {
  const n = funnel.length;
  return {
    totalAwareness: funnel.reduce((s, f) => s + f.totalAwareness, 0) / n,
    familiarity:    funnel.reduce((s, f) => s + f.familiarity, 0) / n,
    consideration:  funnel.reduce((s, f) => s + f.consideration, 0) / n,
    purchaseIntent: funnel.reduce((s, f) => s + f.purchaseIntent, 0) / n,
  };
}

// ── Brand Funnel Card ────────────────────────────────────────────────────────

interface CardProps {
  brand: Brand;
  funnel: FunnelEntry;
  wtp: WTPBrand;
  avg: CatAvg;
}

const BrandFunnelCard = ({ brand, funnel: f, wtp, avg }: CardProps) => {
  const isCompany = brand.id === 'company';

  return (
    <div
      className={cn(
        'relative flex flex-col gap-3 rounded-xl border p-3 transition-all duration-500',
        isCompany ? 'border-primary/50' : 'border-border-dim bg-surface'
      )}
      style={
        isCompany
          ? {
              background: 'hsl(215 28% 19%)',
              boxShadow: `0 0 0 1px hsl(221 82% 48% / 0.25), 0 0 28px hsl(221 82% 48% / 0.18)`,
            }
          : undefined
      }
    >
      {/* Brand header */}
      <div className="flex items-center gap-1.5 pr-10 min-w-0">
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: brand.color }}
        />
        <span className="truncate text-xs font-bold text-foreground">{brand.label}</span>
      </div>

      {/* BEI badge — absolute top-right */}
      <div
        className="absolute right-2.5 top-2.5 flex h-10 w-10 flex-col items-center justify-center rounded-full"
        style={{
          border: `1.5px solid ${brand.color}55`,
          background: `${brand.color}18`,
        }}
      >
        <span className="text-[13px] font-bold leading-none text-foreground">
          {f.brandEquityIndex.toFixed(1)}
        </span>
        <span className="text-[8px] leading-none text-muted-foreground">/10</span>
      </div>

      {/* Funnel bars */}
      <div className="flex flex-col gap-2.5">
        {FUNNEL_STAGES.map(({ key, label, alpha }) => {
          const value = f[key];
          const delta = Math.round(value - avg[key]);
          const above = delta >= 0;

          return (
            <div key={key}>
              {/* Label + value */}
              <div className="mb-0.5 flex items-baseline justify-between gap-1">
                <span className="text-[10px] text-muted-foreground leading-none">{label}</span>
                <span className="text-[11px] font-bold tabular-nums text-foreground leading-none">
                  {value}%
                </span>
              </div>
              {/* Bar track */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${value}%`,
                    backgroundColor: `${brand.color}${alpha}`,
                  }}
                />
              </div>
              {/* Delta vs avg */}
              <div
                className={cn(
                  'mt-0.5 flex items-center gap-0.5',
                  above ? 'text-emerald-400' : 'text-rose-400'
                )}
              >
                {above ? (
                  <ArrowUp className="h-2.5 w-2.5 shrink-0" />
                ) : (
                  <ArrowDown className="h-2.5 w-2.5 shrink-0" />
                )}
                <span className="text-[9px] font-medium">
                  {above ? '+' : ''}
                  {delta} avg
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-border-dim" />

      {/* WTP stacked bar */}
      <div>
        <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          Willingness to Pay
        </p>
        <div className="flex h-2.5 w-full overflow-hidden rounded-full">
          {WTP_SEGMENTS.map(({ key, color }) => (
            <div
              key={key}
              className="h-full transition-all duration-500"
              style={{ width: `${wtp[key]}%`, backgroundColor: color }}
            />
          ))}
        </div>
        {/* % labels per segment */}
        <div className="mt-1 flex justify-between">
          {WTP_SEGMENTS.map(({ key, color }) => (
            <span key={key} className="text-[9px] font-semibold tabular-nums" style={{ color }}>
              {wtp[key]}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Grid ─────────────────────────────────────────────────────────────────────

interface Props {
  brands: Brand[];
  funnel: FunnelEntry[];
  willingnessToPay: WTPBrand[];
}

const BrandFunnelGrid = ({ brands, funnel, willingnessToPay }: Props) => {
  const avg = computeAvg(funnel);

  return (
    <div className="space-y-4">
      {/* 5-column scrollable grid */}
      <div className="overflow-x-auto pb-1">
        <div className="grid min-w-[820px] grid-cols-5 gap-3">
          {brands.map((brand) => {
            const f = funnel.find((x) => x.brandId === brand.id)!;
            const w = willingnessToPay.find((x) => x.brandId === brand.id)!;
            return (
              <BrandFunnelCard key={brand.id} brand={brand} funnel={f} wtp={w} avg={avg} />
            );
          })}
        </div>
      </div>

      {/* Shared WTP legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border-dim bg-surface px-5 py-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          WTP:
        </span>
        {WTP_SEGMENTS.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandFunnelGrid;
