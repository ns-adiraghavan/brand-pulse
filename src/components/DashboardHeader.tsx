import { UserCircle2 } from "lucide-react";

interface NavSection {
  id: string;
  label: string;
}

interface DashboardHeaderProps {
  sections: NavSection[];
  activeSection: string;
  onNavigate: (id: string) => void;
}

const DashboardHeader = ({ sections, activeSection, onNavigate }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between gap-4 border-b border-border-dim bg-surface px-6 shadow-md">
      {/* Left: Brand */}
      <div className="flex shrink-0 items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-primary-foreground"
          >
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </svg>
        </div>
        <span className="hidden whitespace-nowrap text-sm font-bold tracking-tight text-foreground lg:block">
          Brand Health Intelligence Platform
        </span>
      </div>

      {/* Center: Pill nav */}
      <nav className="flex items-center gap-1 rounded-full border border-border-dim bg-background px-2 py-1">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-pill${activeSection === id ? " active" : ""}`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Right: wave badge + avatar */}
      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden rounded-full border border-border-dim bg-surface-2 px-3 py-1 text-xs font-medium text-muted-foreground sm:block">
          Last Refreshed: Wave Q4 2024
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border-dim bg-surface-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <UserCircle2 className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
