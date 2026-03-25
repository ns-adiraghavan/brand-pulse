import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList,
} from 'recharts';
import type { DiscoveryChannels } from '@/data/mockData';

interface Props {
  channels: DiscoveryChannels;
}

const CHANNEL_LABELS: { key: keyof DiscoveryChannels; label: string; icon: string }[] = [
  { key: 'socialMedia',   label: 'Social Media',      icon: '📱' },
  { key: 'googleSearch',  label: 'Google Search',     icon: '🔍' },
  { key: 'influencer',    label: 'Influencer',         icon: '⭐' },
  { key: 'wordOfMouth',   label: 'Word of Mouth',     icon: '💬' },
  { key: 'directApp',     label: 'Direct / App Entry', icon: '📲' },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-primary mt-0.5">{payload[0].value}% of respondents</p>
    </div>
  );
};

const DiscoveryChannelsChart = ({ channels }: Props) => {
  const data = CHANNEL_LABELS.map(({ key, label }) => ({
    label,
    value: channels[key],
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-xl border border-border-dim bg-surface p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Discovery Channels
      </p>
      <h3 className="mb-1 text-sm font-bold text-foreground">How Customers Discover Brands</h3>
      <p className="mb-4 text-xs text-muted-foreground">Where to invest in marketing reach</p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 52, left: 8, bottom: 0 }}
          barSize={18}
        >
          <CartesianGrid horizontal={false} stroke="hsl(215 20% 25%)" strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 80]} tick={{ fill: 'hsl(215 16% 55%)', fontSize: 10 }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" width={130} tick={{ fill: 'hsl(215 16% 72%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(215 25% 22% / 0.4)' }} />
          <Bar
            dataKey="value"
            radius={[0, 4, 4, 0]}
            fill="hsl(var(--primary))"
          >
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

export default DiscoveryChannelsChart;
