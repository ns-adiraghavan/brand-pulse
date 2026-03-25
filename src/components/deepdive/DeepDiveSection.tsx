import { useMemo, useState } from 'react';
import { useFilters } from '@/context/FilterContext';
import { getMockData } from '@/data/mockData';
import { useChartFade } from '@/hooks/useChartFade';
import SegmentIndexTable from './SegmentIndexTable';
import BrandSegmentGrid from './BrandSegmentGrid';
import InsightCallouts from './InsightCallouts';

type ViewMode = 'segment' | 'brand';

const DeepDiveSection = () => {
  const { filters } = useFilters();
  const data = useMemo(() => getMockData(filters), [filters]);
  const [mode, setMode] = useState<ViewMode>('segment');
  const fadeClass = useChartFade(filters);

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-border-dim bg-surface p-1 w-fit">
        {([
          { key: 'segment', label: 'Segment Funnel' },
          { key: 'brand',   label: 'Brand Funnel'   },
        ] as { key: ViewMode; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className="rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200"
            style={
              mode === key
                ? { background: 'hsl(var(--primary))', color: '#fff' }
                : { color: 'hsl(215 16% 65%)' }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Matrix or Brand Grid */}
      {mode === 'segment' ? (
        <SegmentIndexTable matrix={data.deepDiveMatrix} />
      ) : (
        <BrandSegmentGrid
          brands={data.brands}
          funnel={data.funnel}
          matrix={data.deepDiveMatrix}
        />
      )}

      {/* Insight Callouts — always visible */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Key Insights
        </p>
        <InsightCallouts matrix={data.deepDiveMatrix} />
      </div>
    </div>
  );
};

export default DeepDiveSection;
