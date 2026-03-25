import { UserCircle2, Menu, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavSection { id: string; label: string }

interface DashboardHeaderProps {
  sections: NavSection[];
  activeSection: string;
  onNavigate: (id: string) => void;
  onMenuClick: () => void;
  selectedBrand: string | null;
  onClearBrand: () => void;
}

const BRAND_COLORS: Record<string, string> = {
  company:     '#1D4ED8',
  competitorA: '#F59E0B',
  competitorB: '#10B981',
  competitorC: '#F43F5E',
  competitorD: '#8B5CF6',
};
const BRAND_LABELS: Record<string, string> = {
  company:     'Company',
  competitorA: 'Competitor A',
  competitorB: 'Competitor B',
  competitorC: 'Competitor C',
  competitorD: 'Competitor D',
};

const DashboardHeader = ({
  sections, activeSection, onNavigate, onMenuClick, selectedBrand, onClearBrand,
}: DashboardHeaderProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b border-border-dim bg-surface px-4 shadow-md">
        {/* Left: hamburger (mobile/tablet) + brand */}
        <div className="flex shrink-0 items-center gap-2.5">
          {/* Hamburger — only on < lg */}
          <button
            onClick={onMenuClick}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border-dim bg-surface-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            aria-label="Open filters"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary-foreground">
              <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
            </svg>
          </div>
          <span className="hidden whitespace-nowrap text-sm font-bold tracking-tight text-foreground xl:block">
            Brand Health Intelligence Platform
          </span>
        </div>

        {/* Center: Pill nav */}
        <nav className="flex items-center gap-0.5 overflow-x-auto rounded-full border border-border-dim bg-background px-2 py-1">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`nav-pill whitespace-nowrap${activeSection === id ? " active" : ""}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right: selected brand chip + wave badge + avatar */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Selected brand chip */}
          {selectedBrand && (
            <div
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium animate-fade-in"
              style={{
                borderColor: `${BRAND_COLORS[selectedBrand]}50`,
                background: `${BRAND_COLORS[selectedBrand]}15`,
                color: BRAND_COLORS[selectedBrand],
              }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: BRAND_COLORS[selectedBrand] }} />
              {BRAND_LABELS[selectedBrand]}
              <button
                onClick={onClearBrand}
                className="ml-0.5 rounded-full p-0.5 opacity-70 transition-opacity hover:opacity-100"
                aria-label="Clear brand selection"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <span className="hidden rounded-full border border-border-dim bg-surface-2 px-3 py-1 text-xs font-medium text-muted-foreground sm:block">
            Wave Q4 2024
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-dim bg-surface-2 text-muted-foreground transition-colors hover:text-foreground">
                <UserCircle2 className="h-5 w-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="border-border-dim bg-surface text-foreground text-xs">
              Admin User
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default DashboardHeader;
