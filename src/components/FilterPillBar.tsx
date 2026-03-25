import { X } from "lucide-react";
import { useFilters } from "@/context/FilterContext";
import { DEFAULT_FILTERS } from "@/context/FilterContext";

const FilterPillBar = () => {
  const { filters, setFilter, resetFilters } = useFilters();

  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.quarters.length < 4) {
    chips.push({
      label: filters.quarters.length === 1 ? filters.quarters[0] : `${filters.quarters[0]}–${filters.quarters[filters.quarters.length - 1]}`,
      onRemove: () => setFilter('quarters', DEFAULT_FILTERS.quarters),
    });
  }
  if (filters.gender !== 'All')
    chips.push({ label: filters.gender, onRemove: () => setFilter('gender', 'All') });
  if (filters.ageGroup !== 'All')
    chips.push({ label: filters.ageGroup, onRemove: () => setFilter('ageGroup', 'All') });
  if (filters.income !== 'All')
    chips.push({ label: `${filters.income} Income`, onRemove: () => setFilter('income', 'All') });
  if (filters.geography !== 'All')
    chips.push({ label: filters.geography, onRemove: () => setFilter('geography', 'All') });
  if (filters.category !== 'All')
    chips.push({ label: filters.category, onRemove: () => setFilter('category', 'All') });
  if (filters.customerType !== 'All')
    chips.push({ label: `${filters.customerType} Customers`, onRemove: () => setFilter('customerType', 'All') });

  const quartersLabel =
    filters.quarters.length === 4
      ? 'Q1–Q4'
      : filters.quarters.join(', ');

  const demographicLabel = [
    filters.gender !== 'All' ? filters.gender : null,
    filters.ageGroup !== 'All' ? filters.ageGroup : null,
    filters.income !== 'All' ? `${filters.income} Income` : null,
    filters.geography !== 'All' ? filters.geography : null,
  ].filter(Boolean).join(' · ') || 'All Demographics';

  const categoryLabel = filters.category !== 'All' ? filters.category : 'All Categories';
  const customerLabel = filters.customerType !== 'All' ? `${filters.customerType} Customers` : '';

  const showingSummary = [quartersLabel, demographicLabel, categoryLabel, customerLabel]
    .filter(Boolean)
    .join(' | ');

  return (
    <div className="sticky top-0 z-20 border-b border-border-dim/50 bg-background/80 backdrop-blur-sm px-6 py-2">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
          Showing:
        </span>

        {chips.length === 0 ? (
          <span className="text-xs text-muted-foreground">{showingSummary}</span>
        ) : (
          <>
            {chips.map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary animate-fade-in"
              >
                {chip.label}
                <button
                  onClick={chip.onRemove}
                  className="rounded-full p-0.5 opacity-60 hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${chip.label} filter`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            <button
              onClick={resetFilters}
              className="ml-auto text-[10px] font-semibold text-muted-foreground underline-offset-2 hover:underline hover:text-foreground transition-colors"
            >
              Reset All
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterPillBar;
