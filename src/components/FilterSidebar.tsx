import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw } from "lucide-react";
import { useFilters } from "@/context/FilterContext";
import type { Filters } from "@/data/mockData";
import { cn } from "@/lib/utils";

// ─── shared sub-components ────────────────────────────────────────────────

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

function ButtonGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150",
            value === opt
              ? "bg-primary text-primary-foreground"
              : "border border-border-dim bg-surface-2 text-muted-foreground hover:text-foreground hover:border-primary/50"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── main component ────────────────────────────────────────────────────────

const FilterSidebar = () => {
  const { filters, setFilter, resetFilters } = useFilters();

  const quarters: Filters['quarters'][number][] = ['Q1', 'Q2', 'Q3', 'Q4'];

  const toggleQuarter = (q: Filters['quarters'][number]) => {
    const next = filters.quarters.includes(q)
      ? filters.quarters.filter((x) => x !== q)
      : [...filters.quarters, q].sort() as Filters['quarters'];
    // Always keep at least one quarter selected
    if (next.length === 0) return;
    setFilter('quarters', next as Filters['quarters']);
  };

  const hasActiveFilters =
    filters.quarters.length < 4 ||
    filters.gender !== 'All' ||
    filters.ageGroup !== 'All' ||
    filters.income !== 'All' ||
    filters.geography !== 'All' ||
    filters.category !== 'All' ||
    filters.customerType !== 'All';

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-dim px-4 py-3">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Filters &amp; Slicers
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[10px] text-primary hover:text-primary-glow transition-colors"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            Reset
          </button>
        )}
      </div>

      {/* Accordion groups */}
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={['time', 'demographics', 'category', 'customer-type']}
      >
        {/* ── TIME ── */}
        <AccordionItem value="time" className="border-b border-border-dim">
          <AccordionTrigger className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:no-underline [&[data-state=open]]:text-foreground">
            TIME
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-0">
            <div className="space-y-2">
              {quarters.map((q) => (
                <label
                  key={q}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-surface-2"
                >
                  <Checkbox
                    checked={filters.quarters.includes(q)}
                    onCheckedChange={() => toggleQuarter(q)}
                    className="border-border-dim data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-xs text-foreground">{q} 2024</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ── DEMOGRAPHICS ── */}
        <AccordionItem value="demographics" className="border-b border-border-dim">
          <AccordionTrigger className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:no-underline [&[data-state=open]]:text-foreground">
            DEMOGRAPHICS
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-0 space-y-3">
            {/* Gender */}
            <div>
              <FilterLabel>Gender</FilterLabel>
              <Select
                value={filters.gender}
                onValueChange={(v) => setFilter('gender', v as Filters['gender'])}
              >
                <SelectTrigger className="h-8 border-border-dim bg-surface-2 text-xs text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-dim">
                  {(['All', 'Male', 'Female'] as Filters['gender'][]).map((o) => (
                    <SelectItem key={o} value={o} className="text-xs text-foreground focus:bg-surface-2">
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Age Group */}
            <div>
              <FilterLabel>Age Group</FilterLabel>
              <Select
                value={filters.ageGroup}
                onValueChange={(v) => setFilter('ageGroup', v as Filters['ageGroup'])}
              >
                <SelectTrigger className="h-8 border-border-dim bg-surface-2 text-xs text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-dim">
                  {(['All', '18-24', '25-34', '35-44', '45+'] as Filters['ageGroup'][]).map((o) => (
                    <SelectItem key={o} value={o} className="text-xs text-foreground focus:bg-surface-2">
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Income */}
            <div>
              <FilterLabel>Income</FilterLabel>
              <Select
                value={filters.income}
                onValueChange={(v) => setFilter('income', v as Filters['income'])}
              >
                <SelectTrigger className="h-8 border-border-dim bg-surface-2 text-xs text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-dim">
                  {(['All', 'Low', 'Mid', 'High'] as Filters['income'][]).map((o) => (
                    <SelectItem key={o} value={o} className="text-xs text-foreground focus:bg-surface-2">
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Geography */}
            <div>
              <FilterLabel>Geography</FilterLabel>
              <Select
                value={filters.geography}
                onValueChange={(v) => setFilter('geography', v as Filters['geography'])}
              >
                <SelectTrigger className="h-8 border-border-dim bg-surface-2 text-xs text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-dim">
                  {(['All', 'Tier 1', 'Tier 2', 'Tier 3'] as Filters['geography'][]).map((o) => (
                    <SelectItem key={o} value={o} className="text-xs text-foreground focus:bg-surface-2">
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ── PLATFORM (placeholder) ── */}
        <AccordionItem value="platform" className="border-b border-border-dim">
          <AccordionTrigger className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:no-underline [&[data-state=open]]:text-foreground">
            PLATFORM
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-0">
            <div className="rounded-lg border border-border-dim bg-surface-2 px-3 py-3">
              <p className="text-xs text-muted-foreground">
                Platform filters coming in next phase.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ── CATEGORY ── */}
        <AccordionItem value="category" className="border-b border-border-dim">
          <AccordionTrigger className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:no-underline [&[data-state=open]]:text-foreground">
            CATEGORY
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-0">
            <ButtonGroup
              options={['All', 'Electronics', 'Fashion', 'Grocery'] as Filters['category'][]}
              value={filters.category}
              onChange={(v) => setFilter('category', v)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* ── CUSTOMER TYPE ── */}
        <AccordionItem value="customer-type" className="border-b border-border-dim">
          <AccordionTrigger className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:no-underline [&[data-state=open]]:text-foreground">
            CUSTOMER TYPE
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-0">
            <ButtonGroup
              options={['All', 'New', 'Repeat', 'Lapsed'] as Filters['customerType'][]}
              value={filters.customerType}
              onChange={(v) => setFilter('customerType', v)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Active filter summary */}
      {hasActiveFilters && (
        <div className="mx-4 mt-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
            Active Filters
          </p>
          <div className="flex flex-wrap gap-1">
            {filters.quarters.length < 4 && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                {filters.quarters.join(', ')}
              </span>
            )}
            {filters.gender !== 'All' && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                {filters.gender}
              </span>
            )}
            {filters.ageGroup !== 'All' && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                {filters.ageGroup}
              </span>
            )}
            {filters.income !== 'All' && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                {filters.income} Income
              </span>
            )}
            {filters.geography !== 'All' && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                {filters.geography}
              </span>
            )}
            {filters.category !== 'All' && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                {filters.category}
              </span>
            )}
            {filters.customerType !== 'All' && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                {filters.customerType}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="h-6" />
    </div>
  );
};

export default FilterSidebar;
