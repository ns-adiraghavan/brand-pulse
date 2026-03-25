import { useMemo } from 'react';
import { useFilters } from '@/context/FilterContext';
import { getMockData } from '@/data/mockData';
import DemographicDonut from './DemographicDonut';
import PlatformBehaviorTiles from './PlatformBehaviorTiles';
import InfoSourcesChart from './InfoSourcesChart';
import BehavioralInsights from './BehavioralInsights';

const CustomerSection = () => {
  const { filters } = useFilters();
  const data = useMemo(() => getMockData(filters), [filters]);
  const { customerProfile } = data;

  // ── Demographic donut data ──────────────────────────────────────────────────

  const genderData = [
    { label: 'Male',   value: customerProfile.gender.Male,   color: 'hsl(221 82% 55%)' },
    { label: 'Female', value: customerProfile.gender.Female, color: 'hsl(330 80% 65%)' },
  ];

  const ageData = [
    { label: '18-24', value: customerProfile.ageGroup['18-24'], color: 'hsl(199 89% 55%)' },
    { label: '25-34', value: customerProfile.ageGroup['25-34'], color: 'hsl(221 82% 55%)' },
    { label: '35-44', value: customerProfile.ageGroup['35-44'], color: 'hsl(245 60% 60%)' },
    { label: '45+',   value: customerProfile.ageGroup['45+'],   color: 'hsl(262 52% 55%)' },
  ];

  const incomeData = [
    { label: 'Low',  value: customerProfile.income.Low,  color: 'hsl(0 72% 51%)'   },
    { label: 'Mid',  value: customerProfile.income.Mid,  color: 'hsl(38 92% 55%)'  },
    { label: 'High', value: customerProfile.income.High, color: 'hsl(158 64% 42%)' },
  ];

  const geoData = [
    { label: 'Tier 1', value: customerProfile.geography['Tier1'], color: 'hsl(221 82% 55%)' },
    { label: 'Tier 2', value: customerProfile.geography['Tier2'], color: 'hsl(221 65% 68%)' },
    { label: 'Tier 3', value: customerProfile.geography['Tier3'], color: 'hsl(221 45% 78%)' },
  ];

  // Normalise slices to 100% (some profiles may not sum exactly)
  const normalise = (slices: { label: string; value: number; color: string }[]) => {
    const total = slices.reduce((s, d) => s + d.value, 0);
    if (total === 0) return slices;
    return slices.map((d) => ({ ...d, value: Math.round((d.value / total) * 100) }));
  };

  // ── Insight derivations ────────────────────────────────────────────────────

  const socialMediaPct = useMemo(() => {
    const sm = customerProfile.infoSources.find((s) => s.label === 'Social Media');
    return sm ? sm.v : 54;
  }, [customerProfile]);

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

      {/* Part A — Demographic Donuts */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Respondent Profile
        </p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DemographicDonut title="Gender"         data={normalise(genderData)} />
          <DemographicDonut title="Age Group"      data={normalise(ageData)}    />
          <DemographicDonut title="Income Level"   data={normalise(incomeData)} />
          <DemographicDonut title="Geography"      data={normalise(geoData)}    />
        </div>
      </div>

      {/* Part B — Platform Behavior Tiles */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Platform Behaviour
        </p>
        <PlatformBehaviorTiles
          appInstalled={customerProfile.appInstalled}
          usageFrequency={customerProfile.usageFrequency}
        />
      </div>

      {/* Part C — Information Sources */}
      <InfoSourcesChart sources={customerProfile.infoSources} />

      {/* Part D — Behavioral Insight Summary */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Behavioural Insights
        </p>
        <BehavioralInsights
          repeatPurchaseRate={repeatPurchaseRate}
          codRate={codRate}
          socialMediaPct={socialMediaPct}
        />
      </div>

    </div>
  );
};

export default CustomerSection;
