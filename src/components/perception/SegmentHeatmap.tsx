import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { PerceptionRow } from '@/data/mockData';

// ── Segment dimension ─────────────────────────────────────────────────────────

type Dimension = 'gender' | 'quarter';

// Offset = male minus female; positive → males score higher for Company
const GENDER_OFFSETS: Record<string, number> = {
  priceCompetitiveness: -4,
  deliverySpeed:         3,
  appUX:                 5,
  productVariety:       -5,
  returnRefundEase:     -3,
  discountsOffers:      -4,
  trustworthy:           3,
  valueForMoney:        -3,
  convenience:          -4,
  reliability:           2,
  innovative:            6,
  youthful:              5,
};

function clamp(v: number, lo = 0, hi = 100): number {
  return Math.min(hi, Math.max(lo, Math.round(v)));
}

// ── Cell colour ───────────────────────────────────────────────────────────────

function getCellStyle(score: number): { background: string; color: string } {
  if (score >= 70) return { background: '#14532D', color: '#ffffff' };
  if (score >= 55) return { background: '#166534', color: '#ffffff' };
  if (score >= 45) return { background: '#1E293B', color: '#94A3B8' };
  if (score >= 30) return { background: '#7F1D1D', color: '#ffffff' };
  return { background: '#450A0A', color: '#ffffff' };
}

// ── Group config ──────────────────────────────────────────────────────────────

const GROUP_ORDER = ['functional', 'emotional', 'personality'] as const;

const GROUP_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  functional:  { label: 'FUNCTIONAL',  icon: '🔵', color: '#38BDF8' },
  emotional:   { label: 'EMOTIONAL',   icon: '🟡', color: '#FBBF24' },
  personality: { label: 'PERSONALITY', icon: '🟣', color: '#A78BFA' },
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  perceptionHeatmap: PerceptionRow[];
}

// ── Component ─────────────────────────────────────────────────────────────────

const SegmentHeatmap = ({ perceptionHeatmap }: Props) => {
  const [dimension, setDimension] = useState<Dimension>('gender');

  const groupedRows = GROUP_ORDER.map((group) => ({
    group,
    config: GROUP_CONFIG[group],
    rows: perceptionHeatmap.filter((row) => row.attribute.group === group),
  }));

  const getSegment = (row: PerceptionRow) => {
    const base = row.scores['company'];
    const key  = row.attribute.key;

    if (dimension === 'gender') {
      const offset = GENDER_OFFSETS[key] ?? 0;
      const male   = clamp(base + offset / 2);
      const female = clamp(base - offset / 2);
      return { colA: male, colB: female, delta: male - female, colALabel: 'Male', colBLabel: 'Female' };
    } else {
      const q1 = clamp(Math.round(base * 0.88));
      const q4 = base;
      return { colA: q1, colB: q4, delta: q4 - q1, colALabel: 'Q1 2024', colBLabel: 'Q4 2024' };
    }
  };

  const sampleSeg = getSegment(perceptionHeatmap[0]);

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Compare by:
        </span>
        <div className="flex rounded-lg border border-border-dim bg-surface p-1">
          {(['gender', 'quarter'] as Dimension[]).map((dim) => (
            <button
              key={dim}
              onClick={() => setDimension(dim)}
              className={cn(
                'rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200',
                dimension === dim
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {dim === 'gender' ? 'Gender' : 'Quarter Delta'}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Company brand only ·{' '}
          {dimension === 'gender' ? 'Male vs Female split (synthetic ±5pt variance)' : 'Q1 → Q4 improvement'}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border-dim">
        <table className="w-full min-w-[520px] border-collapse">
          <thead>
            <tr className="border-b border-border-dim bg-surface">
              <th className="py-3 pl-4 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Attribute
              </th>
              {[sampleSeg.colALabel, sampleSeg.colBLabel].map((label) => (
                <th
                  key={label}
                  className="w-[18%] px-3 py-3 text-center text-xs font-semibold text-foreground"
                >
                  {label}
                </th>
              ))}
              <th className="w-[14%] px-3 py-3 text-center text-xs font-semibold text-muted-foreground">
                Δ {dimension === 'gender' ? 'M–F' : 'Q4–Q1'}
              </th>
            </tr>
          </thead>
          <tbody>
            {groupedRows.map(({ group, config, rows }) => (
              <React.Fragment key={group}>
                <tr style={{ background: 'hsl(215 28% 13%)' }}>
                  <td
                    colSpan={4}
                    className="py-2 pl-4 text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: config.color }}
                  >
                    {config.icon} {config.label}
                  </td>
                </tr>

                {rows.map((row) => {
                  const seg      = getSegment(row);
                  const deltaPos = seg.delta > 0;

                  return (
                    <tr
                      key={row.attribute.key}
                      className="border-b border-border-dim/40 transition-colors hover:bg-surface-2/20"
                    >
                      <td className="py-2.5 pl-4 pr-3 text-xs text-muted-foreground">
                        {row.attribute.label}
                      </td>
                      {[seg.colA, seg.colB].map((val, idx) => {
                        const cs = getCellStyle(val);
                        return (
                          <td
                            key={idx}
                            className="px-3 py-2.5 text-center text-xs font-bold tabular-nums transition-all duration-300"
                            style={{ background: cs.background, color: cs.color }}
                          >
                            {val}%
                          </td>
                        );
                      })}
                      <td
                        className="px-3 py-2.5 text-center text-xs font-semibold tabular-nums"
                        style={{ color: deltaPos ? '#10B981' : '#FB7185' }}
                      >
                        {deltaPos ? '+' : ''}
                        {seg.delta}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SegmentHeatmap;
