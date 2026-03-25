import { Info, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import netscribesLogo from "@/assets/netscribes-logo.png";

interface NavSection { id: string; label: string }

interface DashboardHeaderProps {
  sections: NavSection[];
  activeSection: string;
  onNavigate: (id: string) => void;
  onMenuClick: () => void;
  selectedBrand: string | null;
  onClearBrand: () => void;
  onLogout: () => void;
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
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b border-border-dim bg-surface px-4 shadow-md">

        {/* Left: hamburger (mobile) + Netscribes logo */}
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            onClick={onMenuClick}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border-dim bg-surface-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            aria-label="Open filters"
          >
            <Menu className="h-4 w-4" />
          </button>

          <img
            src={netscribesLogo}
            alt="Netscribes"
            className="h-7 w-auto object-contain"
          />
        </div>

        {/* Center: pill nav */}
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

        {/* Right: info + brand chip + wave badge + avatar */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Info button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setInfoOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border-dim bg-surface-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="About this dashboard"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="border-border-dim bg-surface text-foreground text-xs">
              About This Dashboard
            </TooltipContent>
          </Tooltip>

          {/* Selected brand chip */}
          {selectedBrand && (
            <div
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
              style={{
                borderColor: `${BRAND_COLORS[selectedBrand]}50`,
                background:  `${BRAND_COLORS[selectedBrand]}15`,
                color:        BRAND_COLORS[selectedBrand],
              }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: BRAND_COLORS[selectedBrand] }} />
              {BRAND_LABELS[selectedBrand]}
              <button onClick={onClearBrand} className="ml-0.5 rounded-full p-0.5 opacity-70 hover:opacity-100" aria-label="Clear brand">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <span className="hidden rounded-full border border-border-dim bg-surface-2 px-3 py-1 text-xs font-medium text-muted-foreground sm:block">
            Last Refreshed: Q4 2024
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

      {/* About This Dashboard modal */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-w-lg border-border-dim bg-surface text-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">About This Dashboard</DialogTitle>
            <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This Brand Health Intelligence Platform tracks Company's performance against Competitors A–D
              across e-commerce brand health parameters: Awareness, Consideration, Usage, Loyalty, and Perception.
              Data is based on synthetic wave-on-wave tracking (Q1–Q4). All metrics follow Brand Tracking study
              parameters including the Core Brand Funnel, Imagery (Functional, Emotional &amp; Personality attributes),
              Campaign Effectiveness, Customer Behavior, and Segment-level deep dives.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setInfoOpen(false)} className="border-border-dim bg-surface-2 text-foreground hover:bg-surface">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default DashboardHeader;
