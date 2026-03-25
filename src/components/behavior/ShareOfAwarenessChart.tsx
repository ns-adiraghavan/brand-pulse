import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Brand } from '@/data/mockData';

interface Props {
  shareOfAwareness: Record<string, number>;
  brands: Brand[];
}

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) => {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      className="text-xs font-bold" style={{ fontSize: 11, fontWeight: 700 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string } }[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full" style={{ background: d.payload.color }} />
        <span className="font-semibold text-foreground">{d.name}</span>
        <span className="text-muted-foreground">{d.value}%</span>
      </div>
    </div>
  );
};

const CustomLegend = ({ data }: { data: { label: string; value: number; color: string }[] }) => (
  <div className="flex flex-col gap-2 justify-center pl-4">
    {data.map((item) => (
      <div key={item.label} className="flex items-center gap-2.5 min-w-[140px]">
        <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
        <span className="text-xs text-muted-foreground flex-1">{item.label}</span>
        <span className="text-xs font-semibold tabular-nums text-foreground">{item.value}%</span>
      </div>
    ))}
  </div>
);

const ShareOfAwarenessChart = ({ shareOfAwareness, brands }: Props) => {
  const chartData = useMemo(() => {
    const raw = brands.map((b) => ({
      label: b.label,
      value: shareOfAwareness[b.id] ?? 0,
      color: b.color,
    }));
    // Normalise to 100%
    const total = raw.reduce((s, d) => s + d.value, 0);
    return raw.map((d) => ({ ...d, value: Math.round((d.value / total) * 100) }));
  }, [shareOfAwareness, brands]);

  return (
    <div className="rounded-xl border border-border-dim bg-surface p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Share of Awareness
      </p>
      <h3 className="mb-4 text-sm font-bold text-foreground">Brand Split</h3>

      <div className="flex items-center gap-2">
        <div className="relative flex-1" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="80%"
                dataKey="value"
                nameKey="label"
                paddingAngle={2}
                labelLine={false}
                label={renderCustomLabel}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} stroke="hsl(215 28% 17%)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Centre label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Total</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Awareness</span>
          </div>
        </div>
        <CustomLegend data={chartData} />
      </div>
    </div>
  );
};

export default ShareOfAwarenessChart;
