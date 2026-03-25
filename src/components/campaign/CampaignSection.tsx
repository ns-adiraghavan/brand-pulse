import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import {
  Megaphone,
  Eye,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useFilters } from '@/context/FilterContext';
import { getMockData } from '@/data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const SOURCE_COLORS: Record<string, string> = {
  Instagram:   '#EC4899',
  YouTube:     '#EF4444',
  Influencer:  '#A78BFA',
  'Search Ads':'#F59E0B',
  TV:          '#10B981',
};

const ACTION_COLORS: Record<string, string> = {
  'Visited App':   '#1D4ED8',
  'Installed App': '#2563EB',
  'Added to Cart': '#3B82F6',
  'No Action':     '#475569',
};

// ─────────────────────────────────────────────────────────────────────────────
// Custom Tooltips
// ─────────────────────────────────────────────────────────────────────────────

const ActionTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border-dim bg-surface p-3 shadow-xl">
      <p className="mb-1 text-xs font-bold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">
        <span className="font-bold text-foreground">{payload[0].value}%</span> of respondents
      </p>
    </div>
  );
};

const RecallTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border-dim bg-surface p-3 shadow-xl">
      <p className="mb-1 text-xs font-bold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">
        Recall:{' '}
        <span className="font-bold text-foreground">{payload[0].value}%</span>
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Part A — KPI Cards
// ─────────────────────────────────────────────────────────────────────────────

const KPI_CONFIG: {
  key: 'adRecall' | 'campaignAwareness' | 'messageRecall';
  label: string;
  sub: string;
  icon: LucideIcon;
}[] = [
  {
    key: 'adRecall',
    label: 'Ad Recall',
    sub: '% of respondents who recalled the ad',
    icon: Megaphone,
  },
  {
    key: 'campaignAwareness',
    label: 'Campaign Awareness',
    sub: '% aware of the campaign',
    icon: Eye,
  },
  {
    key: 'messageRecall',
    label: 'Message Recall',
    sub: '% who recall the key message',
    icon: MessageSquare,
  },
];

interface KPIValues {
  adRecall: number;
  campaignAwareness: number;
  messageRecall: number;
}

const CampaignKPICards = (vals: KPIValues) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
    {KPI_CONFIG.map(({ key, label, sub, icon: Icon }) => (
      <div
        key={key}
        className="relative overflow-hidden rounded-xl border border-border-dim bg-surface px-5 pb-5 pt-4"
      >
        {/* Faint background glow */}
        <div
          className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full"
          style={{ background: '#1D4ED8', opacity: 0.05 }}
        />

        {/* Icon */}
        <div
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: 'hsl(var(--primary) / 0.12)' }}
        >
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
        </div>

        {/* Value */}
        <p className="text-4xl font-bold tabular-nums text-foreground transition-all duration-500">
          {vals[key]}%
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>

        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-xl"
          style={{ background: 'hsl(var(--primary))' }}
        />
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Part B — Action Taken Horizontal Bar Chart
// ─────────────────────────────────────────────────────────────────────────────

const ActionTakenChart = ({
  data,
}: {
  data: { label: string; value: number }[];
}) => {
  const maxVal = Math.max(...data.map((d) => d.value));
  const domainMax = Math.ceil((maxVal + 18) / 10) * 10;

  return (
    <div className="rounded-xl border border-border-dim bg-surface p-5">
      <h3 className="text-sm font-bold text-foreground">
        Action Taken After Seeing Campaign
      </h3>
      <p className="mb-5 mt-1 text-xs text-muted-foreground">
        % of respondents who took each action after ad exposure
      </p>

      <ResponsiveContainer width="100%" height={210}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 52, left: 4, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(215 20% 28% / 0.5)"
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[0, domainMax]}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip
            content={<ActionTooltip />}
            cursor={{ fill: 'hsl(215 25% 23% / 0.4)' }}
          />
          <Bar dataKey="value" radius={[0, 5, 5, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={ACTION_COLORS[entry.label] ?? '#475569'}
              />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              style={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
              formatter={(v: number | string) => `${v}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Action legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border-dim pt-3">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: ACTION_COLORS[d.label] ?? '#475569' }}
            />
            <span className="text-xs text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Part C — Source of Recall Vertical Bar Chart
// ─────────────────────────────────────────────────────────────────────────────

const SourceOfRecallChart = ({
  data,
}: {
  data: { channel: string; value: number }[];
}) => {
  const avg = Math.round(data.reduce((s, r) => s + r.value, 0) / data.length);
  const maxVal = Math.max(...data.map((d) => d.value));
  const domainMax = Math.ceil((maxVal + 10) / 10) * 10;

  return (
    <div className="rounded-xl border border-border-dim bg-surface p-5">
      <h3 className="text-sm font-bold text-foreground">
        Where Did Customers Recall the Campaign?
      </h3>
      <p className="mb-5 mt-1 text-xs text-muted-foreground">
        % of ad-aware respondents who recalled from each channel · dashed line = channel average
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 28, right: 24, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(215 20% 28% / 0.5)"
            vertical={false}
          />
          <XAxis
            dataKey="channel"
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, domainMax]}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={34}
          />
          <Tooltip
            content={<RecallTooltip />}
            cursor={{ fill: 'hsl(215 25% 23% / 0.4)' }}
          />

          {/* Category average reference line */}
          <ReferenceLine
            y={avg}
            stroke="#64748B"
            strokeDasharray="5 3"
            strokeWidth={1.5}
            label={{
              value: `Avg ${avg}%`,
              position: 'insideTopRight',
              fill: '#64748B',
              fontSize: 10,
              dy: -14,
            }}
          />

          <Bar dataKey="value" radius={[5, 5, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={SOURCE_COLORS[entry.channel] ?? '#64748B'}
              />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              style={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
              formatter={(v: number | string) => `${v}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Channel legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-border-dim pt-3">
        {data.map((d) => (
          <div key={d.channel} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: SOURCE_COLORS[d.channel] ?? '#64748B' }}
            />
            <span className="text-xs text-muted-foreground">{d.channel}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="h-px w-5 border-t-2 border-dashed border-[#64748B]" />
          <span className="text-xs text-muted-foreground">Channel average</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Part D — Campaign Lift Card
// ─────────────────────────────────────────────────────────────────────────────

interface LiftRowProps {
  icon: LucideIcon;
  metric: string;
  pre: number;
  post: number;
  delta: number;
}

const LiftRow = ({ icon: Icon, metric, pre, post, delta }: LiftRowProps) => (
  <div className="flex items-center gap-3 py-3">
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
      style={{ background: 'hsl(var(--primary) / 0.1)' }}
    >
      <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
    </div>
    <span className="flex-1 text-sm text-muted-foreground">{metric}</span>
    <div className="flex items-center gap-1.5">
      <span className="text-sm tabular-nums text-muted-foreground">{pre}%</span>
      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
      <span className="text-sm font-bold tabular-nums text-foreground">{post}%</span>
    </div>
    <div
      className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
      style={{ background: '#10B98120', color: '#10B981' }}
    >
      +{delta}pp
    </div>
    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2} />
  </div>
);

const CampaignLiftCard = ({ adRecall }: { adRecall: number }) => {
  const liftData: LiftRowProps[] = [
    { icon: Eye,        metric: 'Awareness',     pre: 74, post: 78,       delta: 4            },
    { icon: TrendingUp, metric: 'Consideration', pre: 44, post: 47,       delta: 3            },
    { icon: Megaphone,  metric: 'Ad Recall',     pre: 28, post: adRecall, delta: adRecall - 28 },
  ];

  return (
    <div className="flex flex-col rounded-xl border border-border-dim bg-surface p-5">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: '#10B98118' }}
        >
          <TrendingUp className="h-4 w-4 text-emerald-400" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">Q2 Campaign Impact</h3>
          <p className="text-xs text-muted-foreground">Pre Wave → Post Wave lift</p>
        </div>
      </div>

      {/* Lift rows */}
      <div className="my-2 divide-y divide-border-dim/60">
        {liftData.map((item) => (
          <LiftRow key={item.metric} {...item} />
        ))}
      </div>

      {/* Footnote */}
      <div className="mt-auto rounded-lg border border-border-dim bg-surface-2 px-3 py-2.5">
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          📌 Lift computed for{' '}
          <span className="font-semibold text-primary">Company brand</span> across Q2 2024
          wave (n=1,200 respondents)
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Section
// ─────────────────────────────────────────────────────────────────────────────

const CampaignSection = () => {
  const { filters } = useFilters();
  const { campaignKpis } = useMemo(() => getMockData(filters), [filters]);

  // Empty state: all KPIs are 0
  const isEmpty = campaignKpis.adRecall === 0 && campaignKpis.campaignAwareness === 0 && campaignKpis.messageRecall === 0;
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border-dim bg-surface px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">No data available for this filter combination. Try adjusting your selections.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <CampaignKPICards
        adRecall={campaignKpis.adRecall}
        campaignAwareness={campaignKpis.campaignAwareness}
        messageRecall={campaignKpis.messageRecall}
      />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <ActionTakenChart data={campaignKpis.actionTaken} />
        <CampaignLiftCard adRecall={campaignKpis.adRecall} />
      </div>
      <SourceOfRecallChart data={campaignKpis.sourceOfRecall} />
    </div>
  );
};

export default CampaignSection;
