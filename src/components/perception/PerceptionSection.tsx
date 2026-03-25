import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useFilters } from '@/context/FilterContext';
import { getMockData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useChartFade } from '@/hooks/useChartFade';
import HeatmapTable from './HeatmapTable';
import AttributeOwnershipChart from './AttributeOwnershipChart';
import RadarChartView from './RadarChartView';
import SegmentHeatmap from './SegmentHeatmap';

type View = 'brand' | 'segment';

const PerceptionSection = () => {
  const { filters } = useFilters();
  const data = useMemo(() => getMockData(filters), [filters]);
  const [view, setView] = useState<View>('brand');
  const fadeClass = useChartFade(filters);

  const exportCSV = () => {
    const brands = data.brands;
    const header = ['Attribute', 'Group', ...brands.map((b) => b.label)].join(',');
    const rows = data.perceptionHeatmap.map((row) =>
      [row.attribute.label, row.attribute.group, ...brands.map((b) => row.scores[b.id] ?? '')].join(','),
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'perception-heatmap.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header row: toggle + CSV export */}
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

        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground hidden sm:block">
            {view === 'brand'
              ? '💡 Click a brand column header to highlight its funnel card in Performance ↑'
              : 'Showing Company brand only · split by selected segment dimension'}
          </p>
          {view === 'brand' && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-border-dim bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              title="Export heatmap as CSV"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      <div className={fadeClass}>
        {view === 'brand' ? (
          <>
            <HeatmapTable brands={data.brands} perceptionHeatmap={data.perceptionHeatmap} />
            <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_400px]">
              <AttributeOwnershipChart brands={data.brands} perceptionHeatmap={data.perceptionHeatmap} />
              <RadarChartView brands={data.brands} perceptionHeatmap={data.perceptionHeatmap} />
            </div>
          </>
        ) : (
          <SegmentHeatmap perceptionHeatmap={data.perceptionHeatmap} />
        )}
      </div>
    </div>
  );
};

export default PerceptionSection;
