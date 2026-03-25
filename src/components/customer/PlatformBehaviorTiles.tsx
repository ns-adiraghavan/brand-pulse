interface Props {
  appInstalled: { Yes: number; No: number };
  usageFrequency: { Heavy: number; Medium: number; Light: number };
}

const PlatformBehaviorTiles = ({ appInstalled, usageFrequency }: Props) => {
  const totalUsage = usageFrequency.Heavy + usageFrequency.Medium + usageFrequency.Light;
  const heavy  = Math.round((usageFrequency.Heavy  / totalUsage) * 100);
  const medium = Math.round((usageFrequency.Medium / totalUsage) * 100);
  const light  = 100 - heavy - medium;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* App Install Tile */}
      <div className="rounded-xl border border-border-dim bg-surface p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          App Adoption
        </p>
        <p className="mb-3 text-sm font-bold text-foreground">
          {appInstalled.Yes}% of users have the app installed
        </p>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${appInstalled.Yes}%`, background: 'hsl(var(--primary))' }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: 'hsl(var(--primary))' }} />
            Installed {appInstalled.Yes}%
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-surface-2" />
            Not Installed {appInstalled.No}%
          </span>
        </div>
      </div>

      {/* Usage Frequency Tile */}
      <div className="rounded-xl border border-border-dim bg-surface p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Usage Frequency
        </p>
        <p className="mb-3 text-sm font-bold text-foreground">
          Heavy {heavy}% &nbsp;·&nbsp; Medium {medium}% &nbsp;·&nbsp; Light {light}%
        </p>
        {/* Stacked bar */}
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${heavy}%`, background: 'hsl(158 64% 42%)' }}
          />
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${medium}%`, background: 'hsl(38 92% 55%)' }}
          />
          <div
            className="h-full flex-1 transition-all duration-700"
            style={{ background: 'hsl(215 20% 35%)' }}
          />
        </div>
        <div className="mt-2 flex gap-3 text-[10px] text-muted-foreground">
          {[
            { label: 'Heavy',  color: 'hsl(158 64% 42%)', val: heavy  },
            { label: 'Medium', color: 'hsl(38 92% 55%)',  val: medium },
            { label: 'Light',  color: 'hsl(215 20% 35%)', val: light  },
          ].map(({ label, color, val }) => (
            <span key={label} className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
              {label} {val}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformBehaviorTiles;
