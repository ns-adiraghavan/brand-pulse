import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Brand, TrendEntry } from '@/data/mockData';
import { cn } from '@/lib/utils';

type Metric = 'awareness' | 'consideration' | 'nps';

const METRIC_OPTIONS: { key: Metric; label: string }[] = [
  { key: 'awareness', label: 'Awareness' },
  { key: 'consideration', label: 'Consideration' },
  { key: 'nps', label: 'NPS' },
];

interface Props {
  brands: Brand[];
  trendData: TrendEntry[];
}

// ── Custom Tooltip ──────────────────────────────────────────────────────────

const CustomTooltip = ({
  active, payload, label, brands,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number; color: string }[];
  label?: string;
  brands: Brand[];
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border-dim p-3 shadow-xl" style={{ background: '#0F172A' }}>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">{label} 2024</p>
      {payload.map((entry) => {
        const brand = brands.find((b) => b.id === entry.dataKey);
        return (
          <div key={entry.dataKey} className="flex items-center gap-2 py-0.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-muted-foreground">{brand?.label ?? entry.dataKey}:</span>
            <span className="text-xs font-bold text-foreground">{entry.value}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────

const TrendView = ({ brands, trendData }: Props) => {
  const [metric, setMetric] = useState<Metric>('awareness');

  const chartData = useMemo(
    () =>
      ['Q1', 'Q2', 'Q3', 'Q4'].map((wave) => {
        const row: Record<string, string | number> = { wave };
        trendData.forEach((entry) => {
          const w = entry.waves.find((wv) => wv.wave === wave);
          if (w) row[entry.brandId] = w[metric];
        });
        return row;
      }),
    [trendData, metric]
  );

  const { minY, maxY } = useMemo(() => {
    let min = Infinity,
      max = -Infinity;
    chartData.forEach((row) => {
      brands.forEach((b) => {
        const v = row[b.id] as number;
        if (v < min) min = v;
        if (v > max) max = v;
      });
    });
    return {
      minY: Math.max(0, Math.floor(min / 10) * 10 - 10),
      maxY: Math.min(100, Math.ceil(max / 10) * 10 + 5),
    };
  }, [chartData, brands]);

  return (
    <div className="rounded-xl border border-border-dim bg-surface p-5">
      {/* Metric toggle */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Metric:
        </span>
        {METRIC_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMetric(key)}
            className={cn(
              'rounded-full px-4 py-1 text-xs font-medium transition-all duration-150',
              metric === key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border-dim bg-surface-2 text-muted-foreground hover:text-foreground hover:border-primary/40'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={chartData} margin={{ top: 5, right: 24, left: -8, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 28% / 0.6)" vertical={false} />
          <XAxis
            dataKey="wave"
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
            tickFormatter={(v) => `${v} '24`}
          />
          <YAxis
            domain={[minY, maxY]}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}${metric === 'nps' ? '' : '%'}`}
            width={38}
          />
          <Tooltip
            content={(props) => (
              <CustomTooltip
                active={props.active}
                payload={props.payload as { dataKey: string; value: number; color: string }[]}
                label={props.label}
                brands={brands}
              />
            )}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const brand = brands.find((b) => b.id === value);
              return (
                <span style={{ color: '#94A3B8', fontSize: '12px' }}>
                  {brand?.label ?? value}
                </span>
              );
            }}
          />
          {brands.map((brand) => (
            <Line
              key={brand.id}
              type="monotone"
              dataKey={brand.id}
              name={brand.id}
              stroke={brand.color}
              strokeWidth={brand.id === 'company' ? 2.5 : 1.75}
              dot={{ r: 4, fill: brand.color, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: brand.color, stroke: brand.color, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendView;
