import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import type { ConsiderationSplit, Brand } from '@/data/mockData';

interface Props {
  considerationSplit: ConsiderationSplit[];
  brands: Brand[];
}

const hex2rgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg space-y-1">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ background: p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

const ConsiderationSplitChart = ({ considerationSplit, brands }: Props) => {
  const brandMap = useMemo(() => Object.fromEntries(brands.map((b) => [b.id, b])), [brands]);

  const chartData = useMemo(() =>
    considerationSplit.map((d) => {
      const brand = brandMap[d.brandId];
      return {
        name: brand?.label ?? d.brandId,
        color: brand?.color ?? '#94A3B8',
        stronglyConsider: d.stronglyConsider,
        mightConsider: d.mightConsider,
        notConsider: d.notConsider,
      };
    }),
    [considerationSplit, brandMap],
  );

  return (
    <div className="rounded-xl border border-border-dim bg-surface p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Consideration Intensity
      </p>
      <h3 className="mb-1 text-sm font-bold text-foreground">by Brand</h3>
      <p className="mb-4 text-xs text-muted-foreground">% of category respondents per consideration tier</p>

      {/* Legend */}
      <div className="mb-3 flex flex-wrap gap-3">
        {[
          { key: 'stronglyConsider', label: 'Strongly Consider', alpha: 1.0 },
          { key: 'mightConsider',    label: 'Might Consider',    alpha: 0.45 },
          { key: 'notConsider',      label: 'Not Consider',      alpha: 0 },
        ].map(({ key, label, alpha }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-4 rounded-sm"
              style={{ background: alpha === 0 ? 'hsl(215 20% 28%)' : `rgba(100,150,255,${alpha})` }}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
          barSize={22}
        >
          <CartesianGrid horizontal={false} stroke="hsl(215 20% 25%)" strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(215 16% 55%)', fontSize: 10 }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={90} tick={{ fill: 'hsl(215 16% 75%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(215 25% 22% / 0.5)' }} />

          <Bar dataKey="stronglyConsider" name="Strongly Consider" stackId="a" radius={[0, 0, 0, 0]}>
            {chartData.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
            <LabelList dataKey="stronglyConsider" position="insideRight" formatter={(v: number) => v >= 10 ? `${v}%` : ''} style={{ fill: '#fff', fontSize: 10, fontWeight: 600 }} />
          </Bar>

          <Bar dataKey="mightConsider" name="Might Consider" stackId="a">
            {chartData.map((d) => (
              <Cell key={d.name} fill={hex2rgba(d.color, 0.4)} />
            ))}
            <LabelList dataKey="mightConsider" position="insideRight" formatter={(v: number) => v >= 10 ? `${v}%` : ''} style={{ fill: '#fff', fontSize: 10, fontWeight: 600 }} />
          </Bar>

          <Bar dataKey="notConsider" name="Not Consider" stackId="a" radius={[0, 3, 3, 0]}>
            {chartData.map((d) => (
              <Cell key={d.name} fill="hsl(215 20% 28%)" />
            ))}
            <LabelList dataKey="notConsider" position="insideRight" formatter={(v: number) => v >= 10 ? `${v}%` : ''} style={{ fill: 'hsl(215 16% 55%)', fontSize: 10, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsiderationSplitChart;
