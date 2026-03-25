import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList, Cell,
} from 'recharts';
import type { NonConsiderationReason } from '@/data/mockData';

interface Props {
  reasons: NonConsiderationReason[];
}

const COLORS = [
  'hsl(350 89% 60%)',
  'hsl(0 72% 51%)',
  'hsl(350 89% 60%)',
  'hsl(0 72% 51%)',
  'hsl(350 72% 55%)',
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; payload: NonConsiderationReason }[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{d.payload.label}</p>
      <p className="text-muted-foreground mt-0.5">{d.value}% of non-considerers</p>
    </div>
  );
};

const NonConsiderationChart = ({ reasons }: Props) => {
  const sorted = [...reasons].sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-xl border border-border-dim bg-surface p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Barrier Analysis
      </p>
      <h3 className="mb-1 text-sm font-bold text-foreground">Why Customers Are Not Considering Us</h3>
      <p className="mb-4 text-xs text-muted-foreground">% of non-considerers citing this reason</p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 52, left: 4, bottom: 0 }}
          barSize={18}
        >
          <CartesianGrid horizontal={false} stroke="hsl(215 20% 25%)" strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 80]} tick={{ fill: 'hsl(215 16% 55%)', fontSize: 10 }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" width={148} tick={{ fill: 'hsl(215 16% 72%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(215 25% 22% / 0.4)' }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {sorted.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v: number) => `${v}%`}
              style={{ fill: 'hsl(215 16% 65%)', fontSize: 10, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NonConsiderationChart;
