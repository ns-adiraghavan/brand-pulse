import { useMemo, useState } from 'react';
import { useFilters } from '@/context/FilterContext';
import { getMockData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useChartFade } from '@/hooks/useChartFade';
import KPITiles from './KPITiles';
import BrandFunnelGrid from './BrandFunnelGrid';
import TrendView from './TrendView';

type View = 'snapshot' | 'trend';

const PerformanceSection = () => {
  const { filters } = useFilters();
  const data = useMemo(() => getMockData(filters), [filters]);
  const [view, setView] = useState<View>('snapshot');
  const fadeClass = useChartFade(filters);

  return (
    <div className="space-y-5">
      <KPITiles kpis={data.kpis} />

      <div className="flex items-center justify-between">
        <div className="flex items-center rounded-lg border border-border-dim bg-surface p-1" role="group" aria-label="View mode">
          {(['snapshot', 'trend'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'rounded-md px-5 py-1.5 text-sm font-medium transition-all duration-200',
                view === v
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {v === 'snapshot' ? 'Snapshot' : 'Trend'}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {view === 'snapshot'
            ? 'Bars show absolute % · Δ vs. category average across 5 brands'
            : 'Q1 – Q4 2024 · Company brand highlighted'}
        </p>
      </div>

      <div className={fadeClass}>
        {view === 'snapshot' ? (
          <BrandFunnelGrid
            brands={data.brands}
            funnel={data.funnel}
            willingnessToPay={data.willingnessToPay}
          />
        ) : (
          <TrendView brands={data.brands} trendData={data.trendData} />
        )}
      </div>
    </div>
  );
};

export default PerformanceSection;
