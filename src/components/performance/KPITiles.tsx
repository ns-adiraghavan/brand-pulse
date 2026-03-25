import { Brain, ThumbsUp, Wallet, Award } from 'lucide-react';
import type { KPIs } from '@/data/mockData';

interface Props {
  kpis: KPIs;
}

const tiles = [
  {
    key: 'toma' as const,
    abbr: 'TOMA',
    label: 'Top of Mind Awareness',
    icon: Brain,
    format: (v: number) => `${v}%`,
    color: (v: number) => (v >= 40 ? '#10B981' : '#f1f5f9'),
  },
  {
    key: 'nps' as const,
    abbr: 'NPS',
    label: 'Net Promoter Score',
    icon: ThumbsUp,
    format: (v: number) => `${v}`,
    color: (v: number) => (v > 40 ? '#10B981' : '#F59E0B'),
  },
  {
    key: 'shareOfWallet' as const,
    abbr: 'SoW',
    label: 'Share of Wallet',
    icon: Wallet,
    format: (v: number) => `${v}%`,
    color: () => '#f1f5f9',
  },
  {
    key: 'bei' as const,
    abbr: 'BEI',
    label: 'Brand Equity Index',
    icon: Award,
    format: (v: number) => `${v.toFixed(1)}/10`,
    color: () => '#f1f5f9',
  },
];

const KPITiles = ({ kpis }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map(({ key, abbr, label, icon: Icon, format, color }) => {
        const value = kpis[key] as number;
        return (
          <div
            key={key}
            className="relative overflow-hidden rounded-xl border border-border-dim bg-surface px-5 py-4"
            style={{ borderLeft: '3px solid hsl(var(--primary))' }}
          >
            {/* Background glow decoration */}
            <div
              className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-5"
              style={{ background: 'hsl(var(--primary))' }}
            />
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {abbr}
                </p>
                <p
                  className="text-3xl font-bold leading-none tabular-nums transition-all duration-500"
                  style={{ color: color(value) }}
                >
                  {format(value)}
                </p>
                <p className="mt-2 text-xs leading-snug text-muted-foreground">{label}</p>
              </div>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: 'hsl(var(--primary) / 0.12)' }}
              >
                <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPITiles;
