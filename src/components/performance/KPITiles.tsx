import { Brain, ThumbsUp, Wallet, Award } from 'lucide-react';
import type { KPIs } from '@/data/mockData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Props { kpis: KPIs }

const tiles = [
  {
    key: 'toma' as const,
    abbr: 'TOMA',
    label: 'Top of Mind Awareness',
    tooltip: '% of respondents who named our brand first spontaneously — unprompted',
    icon: Brain,
    format: (v: number) => `${v}%`,
    color: (v: number) => (v >= 40 ? '#10B981' : 'hsl(0 0% 94%)'),
  },
  {
    key: 'nps' as const,
    abbr: 'NPS',
    label: 'Net Promoter Score',
    tooltip: 'Likelihood to recommend our brand on a 0–10 scale (scale −100 to +100). Scores >40 are excellent.',
    icon: ThumbsUp,
    format: (v: number) => `${v}`,
    color: (v: number) => (v > 40 ? '#10B981' : '#F59E0B'),
  },
  {
    key: 'shareOfWallet' as const,
    abbr: 'SoW',
    label: 'Share of Wallet',
    tooltip: '% of total category spend that goes to our brand vs. competitors',
    icon: Wallet,
    format: (v: number) => `${v}%`,
    color: () => 'hsl(0 0% 94%)',
  },
  {
    key: 'bei' as const,
    abbr: 'BEI',
    label: 'Brand Equity Index',
    tooltip: 'Composite score derived from funnel strength (awareness → intent), perception, and loyalty signals. Max 10.',
    icon: Award,
    format: (v: number) => `${v.toFixed(1)}/10`,
    color: () => 'hsl(0 0% 94%)',
  },
];

const KPITiles = ({ kpis }: Props) => (
  <TooltipProvider delayDuration={300}>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map(({ key, abbr, label, tooltip, icon: Icon, format, color }) => {
        const value = kpis[key] as number;
        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <div
                className="relative overflow-hidden rounded-xl border border-border-dim bg-surface px-5 py-4 cursor-help transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                style={{ borderLeft: '3px solid hsl(var(--primary))' }}
              >
                {/* BG glow */}
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
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="max-w-[220px] text-center text-xs border-border-dim bg-surface text-muted-foreground"
            >
              <p className="font-semibold text-foreground mb-0.5">{abbr}: {label}</p>
              {tooltip}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  </TooltipProvider>
);

export default KPITiles;
