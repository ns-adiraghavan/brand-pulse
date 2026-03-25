import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useFilters } from '@/context/FilterContext';
import type { Brand, PerceptionRow } from '@/data/mockData';

// ── Cell styling ─────────────────────────────────────────────────────────────

function getCellStyle(score: number): { background: string; color: string } {
  if (score >= 70) return { background: '#14532D', color: '#ffffff' };
  if (score >= 55) return { background: '#166534', color: '#ffffff' };
  if (score >= 45) return { background: '#1E293B', color: '#94A3B8' };
  if (score >= 30) return { background: '#7F1D1D', color: '#ffffff' };
  return { background: '#450A0A', color: '#ffffff' };
}

// ── Constants ─────────────────────────────────────────────────────────────────

const LEGEND_ITEMS = [
  { label: 'Strong Ownership', bg: '#14532D', range: '≥ 70' },
  { label: 'Above Average',    bg: '#166534', range: '55–69' },
  { label: 'Neutral',          bg: '#1E293B', border: '#334155', range: '45–54' },
  { label: 'Below Average',    bg: '#7F1D1D', range: '30–44' },
  { label: 'Weak',             bg: '#450A0A', range: '< 30' },
];

const GROUP_ORDER = ['functional', 'emotional', 'personality'] as const;

const GROUP_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  functional:  { label: 'FUNCTIONAL',  icon: '🔵', color: '#38BDF8' },
  emotional:   { label: 'EMOTIONAL',   icon: '🟡', color: '#FBBF24' },
  personality: { label: 'PERSONALITY', icon: '🟣', color: '#A78BFA' },
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  brands: Brand[];
  perceptionHeatmap: PerceptionRow[];
}

// ── Component ─────────────────────────────────────────────────────────────────

const HeatmapTable = ({ brands, perceptionHeatmap }: Props) => {
  const { selectedBrand, setSelectedBrand } = useFilters();
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  const groupedRows = GROUP_ORDER.map((group) => ({
    group,
    config: GROUP_CONFIG[group],
    rows: perceptionHeatmap.filter((row) => row.attribute.group === group),
  }));

  const toggleBrand = (id: string) =>
    setSelectedBrand(selectedBrand === id ? null : id);

  return (
    <div className="space-y-3">
      {/* Top legend row: perception scale + index score legend */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        {/* Perception colour scale */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Scale:
          </span>
          {LEGEND_ITEMS.map(({ label, bg, border, range }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="h-3.5 w-8 rounded-sm"
                style={{
                  background: bg,
                  border: border ? `1px solid ${border}` : undefined,
                }}
              />
              <span className="text-[10px] text-muted-foreground">{label}</span>
              <span className="text-[10px] text-muted-foreground/50">{range}</span>
            </div>
          ))}
        </div>

        {/* Index score legend */}
        <div className="flex items-center gap-3 rounded-lg border border-border-dim bg-surface-2 px-3 py-1.5">
          <span className="text-[10px] text-muted-foreground">Index:</span>
          <span className="text-[10px] font-bold" style={{ color: '#22C55E' }}>↑ ≥110 over-index</span>
          <span className="text-[10px] font-bold" style={{ color: '#EF4444' }}>↓ ≤90 under-index</span>
          <span className="text-[10px] text-muted-foreground">91–109 avg</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border-dim">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-border-dim bg-surface">
              <th className="py-3 pl-4 pr-3 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Attribute
              </th>
              {brands.map((brand) => {
                const isHovered  = hoveredBrand === brand.id;
                const isSelected = selectedBrand === brand.id;
                const isDimmed   = selectedBrand !== null && !isSelected;
                return (
                  <th
                    key={brand.id}
                    onClick={() => toggleBrand(brand.id)}
                    onMouseEnter={() => setHoveredBrand(brand.id)}
                    onMouseLeave={() => setHoveredBrand(null)}
                    className={cn(
                      'w-[13%] cursor-pointer select-none px-3 py-3 text-center align-bottom text-xs font-semibold transition-all duration-200',
                      isDimmed && 'opacity-40',
                    )}
                    style={{ color: brand.color }}
                  >
                    {/* Colour bar indicator */}
                    <div
                      className="mb-1.5 h-1 w-full rounded-full transition-all duration-200"
                      style={{
                        background: brand.color,
                        opacity: isHovered || isSelected ? 1 : 0.3,
                        transform: isHovered || isSelected ? 'scaleY(1.5)' : 'scaleY(1)',
                      }}
                    />
                    {brand.label}
                    {isSelected && (
                      <div
                        className="mx-auto mt-1 w-fit rounded-full px-1.5 py-0.5 text-[8px] font-bold"
                        style={{ background: brand.color + '30', color: brand.color }}
                      >
                        ● selected
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {groupedRows.map(({ group, config, rows }) => (
              <React.Fragment key={group}>
                {/* Group header row */}
                <tr style={{ background: 'hsl(215 28% 13%)' }}>
                  <td
                    colSpan={6}
                    className="py-2 pl-4 text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: config.color }}
                  >
                    {config.icon} {config.label}
                  </td>
                </tr>

                {/* Attribute rows */}
                {rows.map((row) => (
                  <tr
                    key={row.attribute.key}
                    className="border-b border-border-dim/40 transition-colors hover:bg-surface-2/20"
                  >
                    <td className="py-2.5 pl-4 pr-3 text-xs text-muted-foreground">
                      {row.attribute.label}
                    </td>
                    {brands.map((brand) => {
                      const score      = row.scores[brand.id];
                      const cs         = getCellStyle(score);
                      const isHovered  = hoveredBrand === brand.id;
                      const isSelected = selectedBrand === brand.id;
                      const isDimmed   = selectedBrand !== null && !isSelected;
                      return (
                        <td
                          key={brand.id}
                          className={cn(
                            'px-3 py-2.5 text-center text-xs font-bold tabular-nums transition-all duration-200',
                            isDimmed && 'opacity-30',
                          )}
                          style={{
                            background: cs.background,
                            color: cs.color,
                            boxShadow:
                              isHovered || isSelected
                                ? `inset 0 0 0 2px ${brand.color}70`
                                : undefined,
                          }}
                        >
                          {score}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interaction hint */}
      {selectedBrand && (
        <p className="text-center text-xs text-muted-foreground">
          💡 Scroll up to Performance to see{' '}
          <span style={{ color: brands.find((b) => b.id === selectedBrand)?.color }}>
            {brands.find((b) => b.id === selectedBrand)?.label}
          </span>{' '}
          highlighted in the funnel grid. Click again to deselect.
        </p>
      )}
    </div>
  );
};

export default HeatmapTable;
