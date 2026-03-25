interface Tile {
  label: string;
  value: number;
  description: string;
  trackColor: string;
  fillColor: string;
  textColor: string;
}

const SIZE = 100;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

const CircleProgress = ({ value, fillColor, trackColor, textColor }: {
  value: number; fillColor: string; trackColor: string; textColor: string;
}) => {
  const offset = CIRCUMFERENCE - (value / 100) * CIRCUMFERENCE;
  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
      {/* Track */}
      <circle
        cx={SIZE / 2} cy={SIZE / 2} r={R}
        fill="none"
        stroke={trackColor}
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      {/* Fill */}
      <circle
        cx={SIZE / 2} cy={SIZE / 2} r={R}
        fill="none"
        stroke={fillColor}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.7s ease' }}
      />
      {/* Text — counter-rotate so it reads correctly */}
      <text
        x={SIZE / 2} y={SIZE / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="rotate-90"
        style={{
          transform: `rotate(90deg)`,
          transformOrigin: `${SIZE / 2}px ${SIZE / 2}px`,
          fill: textColor,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {value}%
      </text>
    </svg>
  );
};

const PurchaseBehaviorTiles = ({
  cartAbandonmentRate,
  codRate,
  repeatPurchaseRate,
}: {
  cartAbandonmentRate: number;
  codRate: number;
  repeatPurchaseRate: number;
}) => {
  const tiles: Tile[] = [
    {
      label: 'Cart Abandonment Rate',
      value: cartAbandonmentRate,
      description: 'of shoppers leave without purchasing',
      trackColor: 'hsl(350 50% 20%)',
      fillColor: 'hsl(350 89% 60%)',
      textColor: 'hsl(350 89% 70%)',
    },
    {
      label: 'COD vs Prepaid Split',
      value: codRate,
      description: 'choose Cash on Delivery',
      trackColor: 'hsl(38 50% 20%)',
      fillColor: 'hsl(38 92% 55%)',
      textColor: 'hsl(38 92% 65%)',
    },
    {
      label: 'Repeat Purchase Rate',
      value: repeatPurchaseRate,
      description: 'of buyers return for a second order',
      trackColor: 'hsl(158 50% 16%)',
      fillColor: 'hsl(158 64% 42%)',
      textColor: 'hsl(158 64% 55%)',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="flex flex-col items-center gap-3 rounded-xl border border-border-dim bg-surface px-5 py-6 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {tile.label}
          </p>
          <CircleProgress
            value={tile.value}
            fillColor={tile.fillColor}
            trackColor={tile.trackColor}
            textColor={tile.textColor}
          />
          <p className="text-xs leading-snug text-muted-foreground max-w-[160px]">
            {tile.value}% {tile.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PurchaseBehaviorTiles;
