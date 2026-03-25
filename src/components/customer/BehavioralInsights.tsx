import { Search, CreditCard, Heart, type LucideIcon } from 'lucide-react';

interface InsightCard {
  icon: LucideIcon;
  title: string;
  stat: string;
  description: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}

interface Props {
  repeatPurchaseRate: number;
  codRate: number;
  socialMediaPct: number;
}

const BehavioralInsights = ({ appInstalled, repeatPurchaseRate, codRate, socialMediaPct }: Props) => {
  const cards: InsightCard[] = [
    {
      icon: Search,
      title: 'Discovery Behavior',
      stat: `${socialMediaPct}%`,
      description: `are social-media-led discoverers. Search-led users show higher conversion intent and lower bounce rates.`,
      borderColor: 'hsl(var(--primary))',
      iconBg:    'hsl(var(--primary) / 0.12)',
      iconColor: 'text-primary',
    },
    {
      icon: CreditCard,
      title: 'Payment Behavior',
      stat: `${codRate}%`,
      description: `prefer Cash on Delivery. UPI adoption is highest in Tier 1 cities with faster checkout completion.`,
      borderColor: 'hsl(38 92% 55%)',
      iconBg:    'hsl(38 92% 55% / 0.12)',
      iconColor: 'text-amber-400',
    },
    {
      icon: Heart,
      title: 'Loyalty Signals',
      stat: `${repeatPurchaseRate}%`,
      description: `repeat purchase rate. App users show 2.3× higher loyalty vs web-only users with shorter reorder cycles.`,
      borderColor: 'hsl(158 64% 42%)',
      iconBg:    'hsl(158 64% 42% / 0.12)',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map(({ icon: Icon, title, stat, description, borderColor, iconBg, iconColor }) => (
        <div
          key={title}
          className="rounded-xl border border-border-dim bg-surface p-5"
          style={{ borderLeft: `3px solid ${borderColor}` }}
        >
          <div
            className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: iconBg }}
          >
            <Icon className={`h-4 w-4 ${iconColor}`} strokeWidth={2} />
          </div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </p>
          <p className="mb-2 text-3xl font-bold tabular-nums text-foreground">{stat}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      ))}
    </div>
  );
};

export default BehavioralInsights;
