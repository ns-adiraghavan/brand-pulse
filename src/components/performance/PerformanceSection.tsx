import { useMemo, useState } from 'react';
import { useFilters } from '@/context/FilterContext';
import { getMockData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import KPITiles from './KPITiles';
import BrandFunnelGrid from './BrandFunnelGrid';
import TrendView from './TrendView';

type View = 'snapshot' | 'trend';

const PerformanceSection = () => {
  const { filters } = useFilters();
  const data = useMemo(() => getMockData(filters), [filters]);
  const [view, setView] = useState<View>('snapshot');

  return (
    <div className="space-y-5">
      {/* KPI tiles */}
      <KPITiles kpis={data.kpis} />

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center rounded-lg border border-border-dim bg-surface p-1"
          role="group"
          aria-label="View mode"
        >
          {(['snapshot', 'trend'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'rounded-md px-5 py-1.5 text-sm font-medium transition-all duration-200',
                view === v
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {v === 'snapshot' ? 'Snapshot' : 'Trend'}
            </button>
          ))}
        </div>

        {view === 'snapshot' && (
          <p className="text-xs text-muted-foreground">
            Bars show absolute % · Δ vs. category average across 5 brands
          </p>
        )}
        {view === 'trend' && (
          <p className="text-xs text-muted-foreground">Q1 – Q4 2024 · Company brand highlighted</p>
        )}
      </div>

      {/* Main content */}
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
  );
};

export default PerformanceSection;
