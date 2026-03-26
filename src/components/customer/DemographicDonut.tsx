import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Slice { label: string; value: number; color: string }

interface Props {
  title: string;
  data: Slice[];
}

const RADIAN = Math.PI / 180;

const renderLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) => {
  if (percent < 0.07) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 10, fontWeight: 700 }}>
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

const DemographicDonut = ({ title, data }: Props) => {
  const dominant = [...data].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="flex flex-col rounded-xl border border-border-dim bg-surface p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>

      <div className="relative mx-auto" style={{ width: 160, height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="78%"
              dataKey="value"
              nameKey="label"
              paddingAngle={2}
              labelLine={false}
              label={renderLabel}
            >
              {data.map((entry) => (
                <Cell key={entry.label} fill={entry.color} stroke="hsl(215 28% 17%)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Centre label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-[11px] font-bold leading-none text-foreground">{dominant?.label}</span>
          <span className="text-[10px] leading-none text-muted-foreground">{dominant?.value}%</span>
        </div>
      </div>

      {/* Compact legend */}
      <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-[10px] text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemographicDonut;
