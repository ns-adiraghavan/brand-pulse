import { useMemo } from 'react';
import { useFilters } from '@/context/FilterContext';
import { getMockData } from '@/data/mockData';
import ShareOfAwarenessChart from './ShareOfAwarenessChart';
import ConsiderationSplitChart from './ConsiderationSplitChart';
import NonConsiderationChart from './NonConsiderationChart';
import DiscoveryChannelsChart from './DiscoveryChannelsChart';
import PurchaseBehaviorTiles from './PurchaseBehaviorTiles';

const BehaviorSection = () => {
  const { filters } = useFilters();
  const data = useMemo(() => getMockData(filters), [filters]);
  const { behavior } = data;

  // Synthetic purchase behaviour values derived from kpis/behavior seed
  const cartAbandonmentRate = useMemo(() => {
    const base = 61;
    const company = data.funnel.find((f) => f.brandId === 'company');
    if (!company) return base;
    // Shift ±5 based on consideration to make it filter-reactive
    return Math.min(80, Math.max(40, Math.round(base - (company.consideration - 47) * 0.5)));
  }, [data]);

  const codRate = useMemo(() => {
    const base = 44;
    return Math.min(70, Math.max(25, Math.round(base + (data.kpis.shareOfWallet - 31) * 0.3)));
  }, [data]);

  const repeatPurchaseRate = useMemo(() => {
    const base = 58;
    return Math.min(80, Math.max(35, Math.round(base + (data.kpis.nps - 51) * 0.2)));
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Row 1 — Donut + Consideration Split */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ShareOfAwarenessChart
          shareOfAwareness={behavior.shareOfAwareness}
          brands={data.brands}
        />
        <ConsiderationSplitChart
          considerationSplit={behavior.considerationSplit}
          brands={data.brands}
        />
      </div>

      {/* Row 2 — Non-Consideration Reasons + Discovery Channels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NonConsiderationChart reasons={behavior.nonConsiderationReasons} />
        <DiscoveryChannelsChart channels={behavior.discoveryChannels} />
      </div>

      {/* Row 3 — Purchase Behavior Circular Tiles */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Purchase Behaviour
        </p>
        <PurchaseBehaviorTiles
          cartAbandonmentRate={cartAbandonmentRate}
          codRate={codRate}
          repeatPurchaseRate={repeatPurchaseRate}
        />
      </div>
    </div>
  );
};

export default BehaviorSection;
