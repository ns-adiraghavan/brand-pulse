import { useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Brand, PerceptionAttributes, PerceptionRow } from '@/data/mockData';

// ── Axes config ───────────────────────────────────────────────────────────────

const RADAR_AXES: { key: PerceptionAttributes; label: string }[] = [
  { key: 'priceCompetitiveness', label: 'Price'       },
  { key: 'deliverySpeed',        label: 'Delivery'    },
  { key: 'trustworthy',          label: 'Trust'       },
  { key: 'innovative',           label: 'Innovation'  },
  { key: 'productVariety',       label: 'Variety'     },
  { key: 'valueForMoney',        label: 'Value'       },
];

// ── Custom Legend ─────────────────────────────────────────────────────────────

const CustomLegend = () => (
  <div className="mt-2 flex items-center justify-center gap-6">
    <div className="flex items-center gap-2">
      <div className="h-2.5 w-8 rounded-full" style={{ background: '#1D4ED8', opacity: 0.8 }} />
      <span className="text-xs text-muted-foreground">Company</span>
    </div>
    <div className="flex items-center gap-2">
      <div
        className="h-0.5 w-8 rounded-full"
        style={{ background: '#64748B', borderTop: '2px dashed #64748B' }}
      />
      <span className="text-xs text-muted-foreground">Category Average</span>
    </div>
  </div>
);

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  brands: Brand[];
  perceptionHeatmap: PerceptionRow[];
}

// ── Component ─────────────────────────────────────────────────────────────────

const RadarChartView = ({ brands, perceptionHeatmap }: Props) => {
  const radarData = useMemo(
    () =>
      RADAR_AXES.map(({ key, label }) => {
        const row = perceptionHeatmap.find((r) => r.attribute.key === key);
        if (!row) return { attribute: label, company: 0, average: 0 };
        const companyScore = row.scores['company'];
        const avgScore = Math.round(
          brands.reduce((s, b) => s + row.scores[b.id], 0) / brands.length
        );
        return { attribute: label, company: companyScore, average: avgScore };
      }),
    [brands, perceptionHeatmap]
  );

  return (
    <div className="flex h-full flex-col rounded-xl border border-border-dim bg-surface p-5">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-foreground">Company Brand DNA</h3>
        <p className="mt-1 text-xs text-muted-foreground">vs Category Average across 6 key axes</p>
      </div>

      <div className="flex flex-1 flex-col">
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="attribute"
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748B', fontSize: 9 }}
              tickCount={4}
              axisLine={false}
            />
            <Radar
              name="Company"
              dataKey="company"
              stroke="#1D4ED8"
              strokeWidth={2}
              fill="#1D4ED8"
              fillOpacity={0.22}
            />
            <Radar
              name="Category Average"
              dataKey="average"
              stroke="#64748B"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="transparent"
            />
            <Legend content={<CustomLegend />} />
          </RadarChart>
        </ResponsiveContainer>

        {/* Score table below radar */}
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {radarData.map((d) => (
            <div
              key={d.attribute}
              className="rounded-lg border border-border-dim bg-surface-2 px-2 py-1.5 text-center"
            >
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                {d.attribute}
              </p>
              <div className="mt-0.5 flex items-center justify-center gap-2">
                <span className="text-xs font-bold" style={{ color: '#1D4ED8' }}>
                  {d.company}%
                </span>
                <span className="text-[10px] text-muted-foreground">vs {d.average}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadarChartView;
