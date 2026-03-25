import { useMemo, useState } from 'react';
import { useFilters } from '@/context/FilterContext';
import { getMockData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import HeatmapTable from './HeatmapTable';
import AttributeOwnershipChart from './AttributeOwnershipChart';
import RadarChartView from './RadarChartView';
import SegmentHeatmap from './SegmentHeatmap';

type View = 'brand' | 'segment';

const PerceptionSection = () => {
  const { filters } = useFilters();
  const data = useMemo(() => getMockData(filters), [filters]);
  const [view, setView] = useState<View>('brand');

  return (
    <div className="space-y-6">
      {/* View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-border-dim bg-surface p-1">
          {(['brand', 'segment'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'rounded-md px-5 py-1.5 text-sm font-medium transition-all duration-200',
                view === v
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {v === 'brand' ? 'Brand Level' : 'Segment Level'}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {view === 'brand'
            ? '💡 Click a brand column header to highlight its funnel card in Performance ↑'
            : 'Showing Company brand only · split by selected segment dimension'}
        </p>
      </div>

      {view === 'brand' ? (
        <>
          {/* Full-width heatmap */}
          <HeatmapTable brands={data.brands} perceptionHeatmap={data.perceptionHeatmap} />

          {/* Ownership chart + Radar side by side */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_400px]">
            <AttributeOwnershipChart
              brands={data.brands}
              perceptionHeatmap={data.perceptionHeatmap}
            />
            <RadarChartView brands={data.brands} perceptionHeatmap={data.perceptionHeatmap} />
          </div>
        </>
      ) : (
        <SegmentHeatmap perceptionHeatmap={data.perceptionHeatmap} />
      )}
    </div>
  );
};

export default PerceptionSection;
