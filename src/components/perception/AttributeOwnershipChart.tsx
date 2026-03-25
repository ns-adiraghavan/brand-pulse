import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import type { Brand, PerceptionRow } from '@/data/mockData';

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface ScoreEntry { label: string; value: number; color: string }

const OwnershipTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { attribute: string; score: number; leadBrandLabel: string; color: string; allScores: ScoreEntry[] } }[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border-dim bg-surface p-3 shadow-xl min-w-[180px]">
      <p className="mb-1.5 text-xs font-bold text-foreground">{d.attribute}</p>
      <p className="mb-2 text-[10px] text-muted-foreground">
        Leader:{' '}
        <span className="font-semibold" style={{ color: d.color }}>
          {d.leadBrandLabel} ({d.score}%)
        </span>
      </p>
      <div className="space-y-1 border-t border-border-dim pt-2">
        {d.allScores.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[10px] text-muted-foreground">{s.label}</span>
            </div>
            <span className="text-[10px] font-bold text-foreground">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  brands: Brand[];
  perceptionHeatmap: PerceptionRow[];
}

// ── Component ─────────────────────────────────────────────────────────────────

const AttributeOwnershipChart = ({ brands, perceptionHeatmap }: Props) => {
  const chartData = useMemo(() => {
    return perceptionHeatmap.map((row) => {
      let maxScore = -1;
      let leadBrand = brands[0];
      brands.forEach((brand) => {
        if (row.scores[brand.id] > maxScore) {
          maxScore = row.scores[brand.id];
          leadBrand = brand;
        }
      });
      return {
        attribute: row.attribute.label,
        score: maxScore,
        color: leadBrand.color,
        leadBrandLabel: leadBrand.label,
        allScores: brands.map((b) => ({
          label: b.label,
          value: row.scores[b.id],
          color: b.color,
        })),
      };
    });
  }, [brands, perceptionHeatmap]);

  return (
    <div className="rounded-xl border border-border-dim bg-surface p-5">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-foreground">
          Attribute Ownership — Who leads on what?
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Each bar = top-scoring brand per attribute. Hover for all 5 brand scores.
        </p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 126, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(215 20% 28% / 0.5)"
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="attribute"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            content={<OwnershipTooltip />}
            cursor={{ fill: 'hsl(215 25% 23% / 0.4)' }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttributeOwnershipChart;
