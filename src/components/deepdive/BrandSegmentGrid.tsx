import type { Brand, FunnelEntry, DeepDiveRow } from '@/data/mockData';

interface Props {
  brands: Brand[];
  funnel: FunnelEntry[];
  matrix: DeepDiveRow[];
}

type MiniMetric = 'awareness' | 'familiarity' | 'consideration' | 'purchaseIntent';

const MINI_METRICS: { key: MiniMetric; short: string }[] = [
  { key: 'awareness',      short: 'Aware.' },
  { key: 'familiarity',    short: 'Famil.' },
  { key: 'consideration',  short: 'Consid.' },
  { key: 'purchaseIntent', short: 'Intent' },
];

const MINI_SEGMENTS: { segment: string; short: string }[] = [
  { segment: 'Gen Z (18-24)',    short: 'Gen Z'    },
  { segment: 'Millennials (25-34)', short: 'Millen.' },
  { segment: 'Tier 1',           short: 'Tier 1'  },
];

const IndexBadge = ({ value }: { value: number }) => {
  const isHigh = value >= 110;
  const isLow  = value <= 90;
  const bg   = isHigh ? 'rgba(34,197,94,0.12)'  : isLow ? 'rgba(239,68,68,0.12)'  : 'rgba(148,163,184,0.08)';
  const text = isHigh ? '#22C55E' : isLow ? '#EF4444' : 'hsl(215 16% 70%)';
  const arrow = isHigh ? '↑' : isLow ? '↓' : '';
  return (
    <span
      className="inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
      style={{ background: bg, color: text, minWidth: 38 }}
    >
      {arrow}{value}
    </span>
  );
};

const BrandSegmentGrid = ({ brands, funnel, matrix }: Props) => {
  const rowMap = Object.fromEntries(matrix.map((r) => [r.segment, r]));

  // For each brand, synthesise segment indices by scaling the global matrix with the
  // brand's funnel deviation vs company (brand funnel / company funnel * global index)
  const companyFunnel = funnel.find((f) => f.brandId === 'company');

  const getBrandIndex = (
    brand: Brand,
    segment: string,
    metric: MiniMetric,
  ): number => {
    const globalRow = rowMap[segment];
    if (!globalRow) return 100;
    const globalVal = globalRow[metric];
    const brandEntry = funnel.find((f) => f.brandId === brand.id);
    if (!brandEntry || !companyFunnel) return globalVal;
    // Approximate by scaling: if brand is stronger in metric vs company, shift index
    const brandMetricMap: Record<MiniMetric, number> = {
      awareness:     brandEntry.awareness,
      familiarity:   brandEntry.familiarity,
      consideration: brandEntry.consideration,
      purchaseIntent: brandEntry.purchaseIntent,
    };
    const compMetricMap: Record<MiniMetric, number> = {
      awareness:     companyFunnel.awareness,
      familiarity:   companyFunnel.familiarity,
      consideration: companyFunnel.consideration,
      purchaseIntent: companyFunnel.purchaseIntent,
    };
    const ratio = brandMetricMap[metric] / (compMetricMap[metric] || 1);
    return Math.round(Math.min(160, Math.max(50, globalVal * ratio)));
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {brands.map((brand) => {
        const isCompany = brand.id === 'company';
        return (
          <div
            key={brand.id}
            className="rounded-xl border bg-surface overflow-hidden"
            style={{
              borderColor: isCompany ? brand.color : 'hsl(215 20% 32%)',
              boxShadow: isCompany ? `0 0 16px ${brand.color}30` : undefined,
            }}
          >
            {/* Brand header */}
            <div
              className="px-3 py-2.5 flex items-center gap-2"
              style={{ background: `${brand.color}18`, borderBottom: `1px solid ${brand.color}30` }}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                style={{ background: brand.color }}
              />
              <span className="text-xs font-bold text-foreground truncate">{brand.label}</span>
              {isCompany && (
                <span className="ml-auto text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded"
                  style={{ background: brand.color, color: '#fff' }}>
                  Focus
                </span>
              )}
            </div>

            {/* Mini matrix */}
            <div className="p-2">
              <table className="w-full border-collapse text-[10px]">
                <thead>
                  <tr>
                    <th className="pb-1.5 text-left font-semibold text-muted-foreground" style={{ width: 52 }}>Seg.</th>
                    {MINI_METRICS.map((m) => (
                      <th key={m.key} className="pb-1.5 text-center font-semibold text-muted-foreground">
                        {m.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MINI_SEGMENTS.map(({ segment, short }) => (
                    <tr key={segment} className="border-t border-border-dim/30">
                      <td className="py-1.5 pr-1 text-left text-[10px] text-muted-foreground font-medium">
                        {short}
                      </td>
                      {MINI_METRICS.map((m) => (
                        <td key={m.key} className="py-1.5 text-center">
                          <IndexBadge value={getBrandIndex(brand, segment, m.key)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BrandSegmentGrid;
