import type { DeepDiveRow, DeepDiveSegment } from '@/data/mockData';

interface Props {
  matrix: DeepDiveRow[];
}

type GroupDef = {
  label: string;
  emoji: string;
  segments: DeepDiveSegment[];
};

const GROUPS: GroupDef[] = [
  {
    label: 'BY AGE',
    emoji: '🎂',
    segments: ['Gen Z (18-24)', 'Millennials (25-34)', 'Gen X (35-44)', 'Boomers (45+)'],
  },
  {
    label: 'BY GENDER',
    emoji: '⚧',
    segments: ['Male', 'Female'],
  },
  {
    label: 'BY GEOGRAPHY',
    emoji: '🗺️',
    segments: ['Tier 1', 'Tier 2', 'Tier 3'],
  },
  {
    label: 'BY INCOME',
    emoji: '💰',
    segments: ['Low Income', 'Mid Income', 'High Income'],
  },
  {
    label: 'BY PLATFORM',
    emoji: '📱',
    segments: ['App User', 'Non-App User'],
  },
  {
    label: 'BY TYPE',
    emoji: '👤',
    segments: ['New Customer', 'Repeat Customer', 'Lapsed Customer'],
  },
];

const METRICS: { key: keyof Omit<DeepDiveRow, 'segment'>; label: string }[] = [
  { key: 'awareness',      label: 'Awareness'       },
  { key: 'familiarity',    label: 'Familiarity'     },
  { key: 'consideration',  label: 'Consideration'   },
  { key: 'purchaseIntent', label: 'Purchase Intent' },
];

const IndexCell = ({ value }: { value: number }) => {
  const isHigh = value >= 110;
  const isLow  = value <= 90;

  const bg   = isHigh ? 'rgba(34,197,94,0.08)'  : isLow ? 'rgba(239,68,68,0.08)'  : 'transparent';
  const text = isHigh ? '#22C55E'                : isLow ? '#EF4444'               : 'hsl(0 0% 100%)';
  const arrow = isHigh ? '↑' : isLow ? '↓' : '';

  return (
    <td
      className="px-3 py-2.5 text-center text-sm tabular-nums transition-colors"
      style={{ background: bg }}
    >
      <span className="font-bold" style={{ color: text }}>
        {arrow && <span className="mr-0.5 text-xs">{arrow}</span>}
        {value}
      </span>
    </td>
  );
};

const SegmentIndexTable = ({ matrix }: Props) => {
  const rowMap = Object.fromEntries(matrix.map((r) => [r.segment, r]));

  return (
    <div className="rounded-xl border border-border-dim bg-surface">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 border-b border-border-dim px-5 py-3">
        <span className="text-[11px] text-muted-foreground">
          Index vs overall average (100 = average).
        </span>
        <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#22C55E' }}>
          ↑ ≥ 110 over-index
        </span>
        <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#EF4444' }}>
          ↓ ≤ 90 under-index
        </span>
        <span className="text-[11px] text-muted-foreground">91–109 average</span>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {/* Sticky header */}
          <thead>
            <tr className="border-b border-border-dim" style={{ background: 'hsl(215 28% 14%)' }}>
              <th className="sticky left-0 z-10 px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  style={{ background: 'hsl(215 28% 14%)', minWidth: 180 }}>
                Segment
              </th>
              {METRICS.map((m) => (
                <th key={m.key}
                    className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    style={{ minWidth: 130 }}>
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {GROUPS.map((group, gi) => (
              <>
                {/* Group header row */}
                <tr key={`group-${gi}`} style={{ background: 'hsl(215 25% 13%)' }}>
                  <td
                    colSpan={5}
                    className="px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    <span className="mr-2">{group.emoji}</span>
                    {group.label}
                  </td>
                </tr>

                {/* Segment rows */}
                {group.segments.map((seg, si) => {
                  const row = rowMap[seg];
                  if (!row) return null;
                  const isEven = si % 2 === 0;
                  return (
                    <tr
                      key={seg}
                      className="border-b border-border-dim/40 transition-colors hover:bg-surface-2"
                      style={{ background: isEven ? 'transparent' : 'hsl(215 28% 18%)' }}
                    >
                      <td className="sticky left-0 z-10 px-5 py-2.5 text-sm font-medium text-foreground"
                          style={{ background: isEven ? 'hsl(215 28% 17%)' : 'hsl(215 28% 18%)' }}>
                        {seg}
                      </td>
                      {METRICS.map((m) => (
                        <IndexCell key={m.key} value={row[m.key]} />
                      ))}
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SegmentIndexTable;
