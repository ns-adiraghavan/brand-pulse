import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Filters } from '@/data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_FILTERS: Filters = {
  quarters:     ['Q1', 'Q2', 'Q3', 'Q4'],
  gender:       'All',
  ageGroup:     'All',
  income:       'All',
  geography:    'All',
  category:     'All',
  customerType: 'All',
};

// ─────────────────────────────────────────────────────────────────────────────
// Context shape
// ─────────────────────────────────────────────────────────────────────────────

interface FilterContextValue {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;
  /** Brand selected via Perception heatmap column click — highlights funnel card */
  selectedBrand: string | null;
  setSelectedBrand: (id: string | null) => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSelectedBrand(null);
  }, []);

  return (
    <FilterContext.Provider value={{ filters, setFilter, resetFilters, selectedBrand, setSelectedBrand }}>
      {children}
    </FilterContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used inside <FilterProvider>');
  return ctx;
}
