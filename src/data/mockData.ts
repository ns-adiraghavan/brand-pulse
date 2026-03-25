// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Filters {
  quarters: ('Q1' | 'Q2' | 'Q3' | 'Q4')[];
  gender: 'All' | 'Male' | 'Female';
  ageGroup: 'All' | '18-24' | '25-34' | '35-44' | '45+';
  income: 'All' | 'Low' | 'Mid' | 'High';
  geography: 'All' | 'Tier 1' | 'Tier 2' | 'Tier 3';
  category: 'All' | 'Electronics' | 'Fashion' | 'Grocery';
  customerType: 'All' | 'New' | 'Repeat' | 'Lapsed';
}

export interface Brand {
  id: string;
  label: string;
  color: string;
}

export interface FunnelEntry {
  brandId: string;
  awareness: number;
  familiarity: number;
  consideration: number;
  purchaseIntent: number;
  totalAwareness: number;
  brandEquityIndex: number;
}

export interface TrendWave {
  wave: string;
  awareness: number;
  consideration: number;
  nps: number;
}

export interface TrendEntry {
  brandId: string;
  waves: TrendWave[];
}

export interface KPIs {
  toma: number;
  nps: number;
  shareOfWallet: number;
  bei: number;
}

export interface WTPBrand {
  brandId: string;
  premium10Plus: number;
  premium5: number;
  noPremium: number;
  unwilling: number;
}

export type PerceptionAttributes =
  | 'priceCompetitiveness'
  | 'deliverySpeed'
  | 'appUX'
  | 'productVariety'
  | 'returnRefundEase'
  | 'discountsOffers'
  | 'trustworthy'
  | 'valueForMoney'
  | 'convenience'
  | 'reliability'
  | 'innovative'
  | 'youthful';

export type AttributeGroup = 'functional' | 'emotional' | 'personality';

export interface PerceptionAttribute {
  key: PerceptionAttributes;
  label: string;
  group: AttributeGroup;
}

export interface PerceptionRow {
  attribute: PerceptionAttribute;
  scores: Record<string, number>; // brandId → score
}

export interface CampaignAction {
  label: string;
  value: number;
}

export interface SourceOfRecall {
  channel: string;
  value: number;
}

export interface CampaignKPIs {
  adRecall: number;
  campaignAwareness: number;
  messageRecall: number;
  actionTaken: CampaignAction[];
  sourceOfRecall: SourceOfRecall[];
}

export interface ConsiderationSplit {
  brandId: string;
  stronglyConsider: number;
  mightConsider: number;
  notConsider: number;
}

export interface NonConsiderationReason {
  label: string;
  value: number;
}

export interface DiscoveryChannels {
  socialMedia: number;
  googleSearch: number;
  influencer: number;
  wordOfMouth: number;
  directApp: number;
}

export interface BehaviorData {
  shareOfAwareness: Record<string, number>; // brandId → %
  considerationSplit: ConsiderationSplit[];
  nonConsiderationReasons: NonConsiderationReason[];
  discoveryChannels: DiscoveryChannels;
}

export interface InfoSource {
  label: string;
  v: number;
}

export interface CustomerProfile {
  gender: { Male: number; Female: number };
  ageGroup: Record<string, number>;
  income: Record<string, number>;
  geography: Record<string, number>;
  appInstalled: { Yes: number; No: number };
  usageFrequency: { Heavy: number; Medium: number; Light: number };
  infoSources: InfoSource[];
}

export type DeepDiveSegment =
  | 'Gen Z (18-24)'
  | 'Millennials (25-34)'
  | 'Gen X (35-44)'
  | 'Male'
  | 'Female'
  | 'Tier 1'
  | 'Tier 2'
  | 'Low Income'
  | 'High Income'
  | 'App User'
  | 'Non-App User';

export type DeepDiveMetric = 'awareness' | 'familiarity' | 'consideration' | 'purchaseIntent';

export interface DeepDiveRow {
  segment: DeepDiveSegment;
  awareness: number;
  familiarity: number;
  consideration: number;
  purchaseIntent: number;
}

export interface MockData {
  brands: Brand[];
  funnel: FunnelEntry[];
  trendData: TrendEntry[];
  kpis: KPIs;
  willingnessToPay: WTPBrand[];
  perceptionHeatmap: PerceptionRow[];
  campaignKpis: CampaignKPIs;
  behavior: BehaviorData;
  customerProfile: CustomerProfile;
  deepDiveMatrix: DeepDiveRow[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Seeded variation engine
// ─────────────────────────────────────────────────────────────────────────────

/** Deterministic float in [min, max] that shifts subtly per filter key/value */
function filterSeed(filters: Filters): number {
  const str = [
    filters.quarters.join(''),
    filters.gender,
    filters.ageGroup,
    filters.income,
    filters.geography,
    filters.category,
    filters.customerType,
  ].join('|');

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  // Normalise to [-1, 1] then scale to ±6% variation
  const normalised = ((hash & 0xffff) / 0xffff) * 2 - 1;
  return 1 + normalised * 0.06;
}

/** Apply multiplier and round, keeping value within [lo, hi] */
function vary(base: number, m: number, lo = 0, hi = 100, decimals = 0): number {
  const raw = base * m;
  const clamped = Math.max(lo, Math.min(hi, raw));
  const factor = Math.pow(10, decimals);
  return Math.round(clamped * factor) / factor;
}

/** Quarter-count multiplier: fewer quarters → slight downtick */
function quarterMult(quarters: string[]): number {
  return 0.88 + (quarters.length / 4) * 0.12;
}

// ─────────────────────────────────────────────────────────────────────────────
// Brand definitions (static)
// ─────────────────────────────────────────────────────────────────────────────

const BRANDS: Brand[] = [
  { id: 'company',     label: 'Company',      color: '#1D4ED8' },
  { id: 'competitorA', label: 'Competitor A',  color: '#F59E0B' },
  { id: 'competitorB', label: 'Competitor B',  color: '#10B981' },
  { id: 'competitorC', label: 'Competitor C',  color: '#F43F5E' },
  { id: 'competitorD', label: 'Competitor D',  color: '#8B5CF6' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Attribute definitions (static)
// ─────────────────────────────────────────────────────────────────────────────

const PERCEPTION_ATTRIBUTES: PerceptionAttribute[] = [
  { key: 'priceCompetitiveness', label: 'Price Competitiveness', group: 'functional' },
  { key: 'deliverySpeed',        label: 'Delivery Speed',         group: 'functional' },
  { key: 'appUX',                label: 'App UX',                 group: 'functional' },
  { key: 'productVariety',       label: 'Product Variety',        group: 'functional' },
  { key: 'returnRefundEase',     label: 'Return / Refund Ease',   group: 'functional' },
  { key: 'discountsOffers',      label: 'Discounts & Offers',     group: 'functional' },
  { key: 'trustworthy',          label: 'Trustworthy',            group: 'emotional'  },
  { key: 'valueForMoney',        label: 'Value for Money',        group: 'emotional'  },
  { key: 'convenience',          label: 'Convenience',            group: 'emotional'  },
  { key: 'reliability',          label: 'Reliability',            group: 'emotional'  },
  { key: 'innovative',           label: 'Innovative',             group: 'personality'},
  { key: 'youthful',             label: 'Youthful',               group: 'personality'},
];

// Raw base perception scores per attribute per brand
const RAW_PERCEPTION: Record<string, Record<string, number>> = {
  priceCompetitiveness: { company: 58, competitorA: 82, competitorB: 32, competitorC: 54, competitorD: 48 },
  deliverySpeed:        { company: 61, competitorA: 55, competitorB: 62, competitorC: 86, competitorD: 47 },
  appUX:                { company: 63, competitorA: 52, competitorB: 64, competitorC: 57, competitorD: 55 },
  productVariety:       { company: 65, competitorA: 58, competitorB: 61, competitorC: 36, competitorD: 52 },
  returnRefundEase:     { company: 60, competitorA: 49, competitorB: 68, competitorC: 53, competitorD: 44 },
  discountsOffers:      { company: 62, competitorA: 78, competitorB: 36, competitorC: 58, competitorD: 50 },
  trustworthy:          { company: 64, competitorA: 38, competitorB: 84, competitorC: 56, competitorD: 46 },
  valueForMoney:        { company: 62, competitorA: 66, competitorB: 58, competitorC: 60, competitorD: 52 },
  convenience:          { company: 63, competitorA: 58, competitorB: 65, competitorC: 74, competitorD: 50 },
  reliability:          { company: 62, competitorA: 44, competitorB: 79, competitorC: 60, competitorD: 48 },
  innovative:           { company: 59, competitorA: 54, competitorB: 71, competitorC: 52, competitorD: 68 },
  youthful:             { company: 55, competitorA: 58, competitorB: 60, competitorC: 49, competitorD: 72 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export function getMockData(filters: Filters): MockData {
  const m  = filterSeed(filters);
  const qm = quarterMult(filters.quarters);
  const mv = m * qm; // combined multiplier

  // ── 1. brands ────────────────────────────────────────────────────────────
  const brands = BRANDS;

  // ── 2. funnel ────────────────────────────────────────────────────────────
  const funnelBase: Omit<FunnelEntry, 'brandId'>[] = [
    { awareness: 78, familiarity: 61, consideration: 47, purchaseIntent: 29, totalAwareness: 85, brandEquityIndex: 6.8 },
    { awareness: 71, familiarity: 54, consideration: 38, purchaseIntent: 22, totalAwareness: 79, brandEquityIndex: 5.4 },
    { awareness: 65, familiarity: 52, consideration: 41, purchaseIntent: 26, totalAwareness: 74, brandEquityIndex: 6.1 },
    { awareness: 60, familiarity: 44, consideration: 33, purchaseIntent: 18, totalAwareness: 68, brandEquityIndex: 4.9 },
    { awareness: 48, familiarity: 35, consideration: 25, purchaseIntent: 13, totalAwareness: 55, brandEquityIndex: 3.7 },
  ];

  const funnel: FunnelEntry[] = brands.map((b, i) => {
    const base = funnelBase[i];
    // Ensure funnel ordering is preserved after variation
    const awareness      = vary(base.awareness, mv, 1, 100);
    const familiarity    = vary(base.familiarity, mv, 1, awareness);
    const consideration  = vary(base.consideration, mv, 1, familiarity);
    const purchaseIntent = vary(base.purchaseIntent, mv, 1, consideration);
    return {
      brandId: b.id,
      awareness,
      familiarity,
      consideration,
      purchaseIntent,
      totalAwareness:    vary(base.totalAwareness, mv, 1, 100),
      brandEquityIndex:  vary(base.brandEquityIndex, mv, 0, 10, 1),
    };
  });

  // ── 3. trendData ─────────────────────────────────────────────────────────
  type WaveBase = [number, number, number]; // awareness, consideration, nps
  const trendBase: Record<string, WaveBase[]> = {
    company:     [[71,41,42],[74,44,47],[76,45,48],[78,47,51]],
    competitorA: [[68,35,38],[70,36,39],[71,37,40],[71,38,41]],
    competitorB: [[61,38,42],[63,40,44],[64,41,45],[65,41,46]],
    competitorC: [[57,30,35],[58,32,36],[59,33,37],[60,33,38]],
    competitorD: [[45,22,28],[46,24,29],[47,24,30],[48,25,31]],
  };

  const waveLabels: ('Q1'|'Q2'|'Q3'|'Q4')[] = ['Q1','Q2','Q3','Q4'];

  const trendData: TrendEntry[] = brands.map((b) => {
    const waves: TrendWave[] = waveLabels.map((wave, wi) => {
      const [aw, co, np] = trendBase[b.id][wi];
      const wm = filters.quarters.includes(wave) ? mv : mv * 0.9;
      return {
        wave,
        awareness:     vary(aw, wm, 1, 100),
        consideration: vary(co, wm, 1, 100),
        nps:           vary(np, wm, 0, 100),
      };
    });
    return { brandId: b.id, waves };
  });

  // ── 4. kpis ──────────────────────────────────────────────────────────────
  const kpis: KPIs = {
    toma:           vary(42, mv, 1, 100),
    nps:            vary(51, mv, 0, 100),
    shareOfWallet:  vary(31, mv, 1, 100),
    bei:            vary(6.8, mv, 0, 10, 1),
  };

  // ── 5. willingnessToPay ──────────────────────────────────────────────────
  type WTPBase = [number, number, number, number];
  const wtpBase: Record<string, WTPBase> = {
    company:     [18, 24, 38, 20],
    competitorA: [ 8, 16, 42, 34],
    competitorB: [22, 28, 34, 16],
    competitorC: [10, 18, 40, 32],
    competitorD: [ 6, 12, 38, 44],
  };

  const willingnessToPay: WTPBrand[] = brands.map((b) => {
    const [p10, p5, nop, un] = wtpBase[b.id];
    // Apply variation and re-normalise to 100
    const raw = [p10, p5, nop, un].map((v) => Math.max(1, vary(v, mv)));
    const total = raw.reduce((a, c) => a + c, 0);
    const norm  = raw.map((v) => Math.round((v / total) * 100));
    // Fix rounding drift
    const drift = 100 - norm.reduce((a, c) => a + c, 0);
    norm[2] += drift;
    return {
      brandId: b.id,
      premium10Plus: norm[0],
      premium5:      norm[1],
      noPremium:     norm[2],
      unwilling:     norm[3],
    };
  });

  // ── 6. perceptionHeatmap ─────────────────────────────────────────────────
  const perceptionHeatmap: PerceptionRow[] = PERCEPTION_ATTRIBUTES.map((attr) => {
    const scores: Record<string, number> = {};
    brands.forEach((b) => {
      const base = RAW_PERCEPTION[attr.key]?.[b.id] ?? 50;
      scores[b.id] = vary(base, mv, 5, 100);
    });
    return { attribute: attr, scores };
  });

  // ── 7. campaignKpis ──────────────────────────────────────────────────────
  const campaignKpis: CampaignKPIs = {
    adRecall:           vary(38, mv, 0, 100),
    campaignAwareness:  vary(52, mv, 0, 100),
    messageRecall:      vary(29, mv, 0, 100),
    actionTaken: [
      { label: 'Visited App',    value: vary(44, mv, 0, 100) },
      { label: 'Installed App',  value: vary(28, mv, 0, 100) },
      { label: 'Added to Cart',  value: vary(19, mv, 0, 100) },
      { label: 'No Action',      value: vary(31, mv, 0, 100) },
    ],
    sourceOfRecall: [
      { channel: 'Instagram',   value: vary(41, mv, 0, 100) },
      { channel: 'YouTube',     value: vary(33, mv, 0, 100) },
      { channel: 'Influencer',  value: vary(28, mv, 0, 100) },
      { channel: 'Search Ads',  value: vary(22, mv, 0, 100) },
      { channel: 'TV',          value: vary(14, mv, 0, 100) },
    ],
  };

  // ── 8. behavior ──────────────────────────────────────────────────────────
  const soaBase: Record<string, number> = { company: 34, competitorA: 26, competitorB: 21, competitorC: 13, competitorD: 6 };
  const shareOfAwareness: Record<string, number> = {};
  brands.forEach((b) => { shareOfAwareness[b.id] = vary(soaBase[b.id], mv, 1, 70); });

  type SplitBase = [number, number, number];
  const splitBase: Record<string, SplitBase> = {
    company:     [29, 38, 33],
    competitorA: [19, 34, 47],
    competitorB: [24, 38, 38],
    competitorC: [16, 32, 52],
    competitorD: [11, 27, 62],
  };

  const considerationSplit: ConsiderationSplit[] = brands.map((b) => {
    const [s, mi, n] = splitBase[b.id];
    const raw = [s, mi, n].map((v) => Math.max(1, vary(v, mv)));
    const total = raw.reduce((a, c) => a + c, 0);
    const norm  = raw.map((v) => Math.round((v / total) * 100));
    const drift = 100 - norm.reduce((a, c) => a + c, 0);
    norm[1] += drift;
    return { brandId: b.id, stronglyConsider: norm[0], mightConsider: norm[1], notConsider: norm[2] };
  });

  const nonConsiderationReasons: NonConsiderationReason[] = [
    { label: 'High Price',             value: vary(48, mv, 0, 100) },
    { label: 'Slow Delivery',          value: vary(37, mv, 0, 100) },
    { label: 'Trust Issues',           value: vary(31, mv, 0, 100) },
    { label: 'Better Competitor Deal', value: vary(44, mv, 0, 100) },
    { label: 'App Experience',         value: vary(22, mv, 0, 100) },
  ];

  const behavior: BehaviorData = {
    shareOfAwareness,
    considerationSplit,
    nonConsiderationReasons,
    discoveryChannels: {
      socialMedia:   vary(52, mv, 0, 100),
      googleSearch:  vary(41, mv, 0, 100),
      influencer:    vary(34, mv, 0, 100),
      wordOfMouth:   vary(28, mv, 0, 100),
      directApp:     vary(18, mv, 0, 100),
    },
  };

  // ── 9. customerProfile ───────────────────────────────────────────────────
  const customerProfile: CustomerProfile = {
    gender: {
      Male:   vary(58, mv, 1, 99),
      Female: 0, // filled below
    },
    ageGroup: {
      '18-24': vary(22, mv, 1, 50),
      '25-34': vary(38, mv, 1, 60),
      '35-44': vary(26, mv, 1, 50),
      '45+':   vary(14, mv, 1, 40),
    },
    income: {
      Low:  vary(28, mv, 1, 60),
      Mid:  vary(45, mv, 1, 70),
      High: vary(27, mv, 1, 60),
    },
    geography: {
      Tier1: vary(44, mv, 1, 70),
      Tier2: vary(35, mv, 1, 60),
      Tier3: vary(21, mv, 1, 50),
    },
    appInstalled: {
      Yes: vary(67, mv, 1, 99),
      No:  0,
    },
    usageFrequency: {
      Heavy:  vary(24, mv, 1, 50),
      Medium: vary(41, mv, 1, 60),
      Light:  vary(35, mv, 1, 50),
    },
    infoSources: [
      { label: 'Social Media',   v: vary(54, mv, 0, 100) },
      { label: 'Google Search',  v: vary(47, mv, 0, 100) },
      { label: 'Friends/WOM',    v: vary(38, mv, 0, 100) },
      { label: 'Influencers',    v: vary(33, mv, 0, 100) },
      { label: 'In-App Ads',     v: vary(28, mv, 0, 100) },
      { label: 'TV/OOH',         v: vary(19, mv, 0, 100) },
    ],
  };
  // Keep binary pairs at 100%
  customerProfile.gender.Female      = 100 - customerProfile.gender.Male;
  customerProfile.appInstalled.No    = 100 - customerProfile.appInstalled.Yes;

  // ── 10. deepDiveMatrix ───────────────────────────────────────────────────
  type SegmentBase = [number, number, number, number]; // aw, fam, con, pi

  const segmentBase: Record<DeepDiveSegment, SegmentBase> = {
    'Gen Z (18-24)':    [112, 100,  92,  88],
    'Millennials (25-34)': [108, 106, 110, 108],
    'Gen X (35-44)':    [ 96,  98, 100,  95],
    'Male':             [102, 103, 104, 105],
    'Female':           [ 99, 100, 101,  98],
    'Tier 1':           [110, 112, 115, 116],
    'Tier 2':           [100, 100, 100, 100],
    'Low Income':       [ 95,  90,  86,  82],
    'High Income':      [108, 112, 118, 122],
    'App User':         [128, 130, 133, 135],
    'Non-App User':     [ 78,  74,  70,  68],
  };

  const deepDiveMatrix: DeepDiveRow[] = (Object.entries(segmentBase) as [DeepDiveSegment, SegmentBase][]).map(
    ([segment, [aw, fam, con, pi]]) => ({
      segment,
      awareness:     vary(aw,  mv, 50, 160),
      familiarity:   vary(fam, mv, 50, 160),
      consideration: vary(con, mv, 50, 160),
      purchaseIntent:vary(pi,  mv, 50, 160),
    })
  );

  return {
    brands,
    funnel,
    trendData,
    kpis,
    willingnessToPay,
    perceptionHeatmap,
    campaignKpis,
    behavior,
    customerProfile,
    deepDiveMatrix,
  };
}
