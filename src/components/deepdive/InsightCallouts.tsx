import type { DeepDiveRow } from '@/data/mockData';

interface Props {
  matrix: DeepDiveRow[];
}

interface Callout {
  emoji: string;
  type: 'positive' | 'warning' | 'star';
  title: string;
  stat: string;
  body: string;
}

const TYPE_STYLES = {
  positive: {
    border: '#22C55E',
    glow: 'rgba(34,197,94,0.12)',
    statColor: '#22C55E',
    iconBg: 'rgba(34,197,94,0.12)',
  },
  warning: {
    border: '#EF4444',
    glow: 'rgba(239,68,68,0.10)',
    statColor: '#EF4444',
    iconBg: 'rgba(239,68,68,0.10)',
  },
  star: {
    border: 'hsl(var(--primary))',
    glow: 'hsl(var(--primary) / 0.10)',
    statColor: 'hsl(var(--primary))',
    iconBg: 'hsl(var(--primary) / 0.10)',
  },
} as const;

const InsightCallouts = ({ matrix }: Props) => {
  const rowMap = Object.fromEntries(matrix.map((r) => [r.segment, r]));

  const appUser   = rowMap['App User'];
  const lapsed    = rowMap['Lapsed Customer'];
  const tier1     = rowMap['Tier 1'];
  const highInc   = rowMap['High Income'];

  const appUserPI   = appUser?.purchaseIntent   ?? 135;
  const lapsedCon   = lapsed?.consideration      ?? 74;
  const tier1Con    = tier1?.consideration        ?? 115;
  const highIncCon  = highInc?.consideration      ?? 118;
  const cohortCon   = Math.round((tier1Con + highIncCon) / 2);

  const callouts: Callout[] = [
    {
      emoji: '📈',
      type: 'positive',
      title: 'App User Strength',
      stat: `+${appUserPI - 100}pts`,
      body: `App Users over-index on Purchase Intent by ${appUserPI - 100} points vs average. Investing in app-first experiences will amplify conversion rates.`,
    },
    {
      emoji: '⚠️',
      type: 'warning',
      title: 'Lapsed Customer Alert',
      stat: `${lapsedCon}`,
      body: `Lapsed Customers show severe under-index on Consideration (${lapsedCon}). This is a high-value re-engagement opportunity — win-back campaigns are recommended.`,
    },
    {
      emoji: '🌟',
      type: 'star',
      title: 'Premium Cohort Opportunity',
      stat: `${cohortCon}`,
      body: `Tier 1 + High Income cohort drives disproportionate consideration for Company (avg index ${cohortCon}). Premium positioning and targeted offers will increase wallet share.`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {callouts.map((c) => {
        const s = TYPE_STYLES[c.type];
        return (
          <div
            key={c.title}
            className="relative overflow-hidden rounded-xl border bg-surface p-5"
            style={{
              borderColor: s.border,
              boxShadow: `0 0 20px ${s.glow}`,
            }}
          >
            {/* Glow blob */}
            <div
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl"
              style={{ background: s.glow }}
            />

            <div
              className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg"
              style={{ background: s.iconBg }}
            >
              {c.emoji}
            </div>

            <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {c.title}
            </p>
            <p className="mb-2 text-3xl font-bold tabular-nums" style={{ color: s.statColor }}>
              {c.stat}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">{c.body}</p>
          </div>
        );
      })}
    </div>
  );
};

export default InsightCallouts;
