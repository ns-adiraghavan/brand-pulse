import { useState, useEffect } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import SectionCard from "@/components/SectionCard";
import FilterPillBar from "@/components/FilterPillBar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useFilters } from "@/context/FilterContext";
import Copilot from "@/components/Copilot";

const sections = [
  { id: "performance", label: "Performance" },
  { id: "perception",  label: "Perception"  },
  { id: "campaign",    label: "Campaign"    },
  { id: "behavior",    label: "Behavior"    },
  { id: "customer",    label: "Customer"    },
  { id: "deepdive",    label: "Deep Dive"   },
];

const DashboardShell = ({ onLogout }: { onLogout: () => void }) => {
  const [activeSection, setActiveSection] = useState("performance");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedBrand, setSelectedBrand } = useFilters();

  // Update active nav pill on scroll
  useEffect(() => {
    const handleScroll = () => {
      const mainEl = document.getElementById("main-content");
      if (!mainEl) return;
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) {
            setActiveSection(section.id);
            return;
          }
        }
      }
      setActiveSection("performance");
    };
    const mainEl = document.getElementById("main-content");
    mainEl?.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainEl?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const mainEl = document.getElementById("main-content");
    const targetEl = document.getElementById(id);
    if (mainEl && targetEl) {
      const offset = targetEl.offsetTop - 16;
      mainEl.scrollTo({ top: offset, behavior: "smooth" });
    }
    setActiveSection(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Sticky header */}
      <DashboardHeader
        sections={sections}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onMenuClick={() => setSidebarOpen(true)}
        selectedBrand={selectedBrand}
        onClearBrand={() => setSelectedBrand(null)}
        onLogout={onLogout}
      />

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar — always visible lg+ */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-border-dim bg-surface scrollbar-thin lg:block">
          <FilterSidebar />
        </aside>

        {/* Mobile/tablet slide-in drawer */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="w-72 border-r border-border-dim bg-surface p-0"
          >
            <FilterSidebar />
          </SheetContent>
        </Sheet>

        {/* Main scrollable content */}
        <main id="main-content" className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Filter pill summary bar */}
          <FilterPillBar />

          <div className="mx-auto max-w-6xl space-y-8 p-6">
            {sections.map(({ id, label }) => (
              <SectionCard key={id} id={id} label={label} />
            ))}
            <div className="h-16" />
          </div>
        </main>
      </div>

      {/* Mobile floating "Filters" button at bottom */}
      <div className="fixed bottom-5 right-5 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="12" y2="18" />
          </svg>
          Filters
        </button>
      </div>
    </div>
  );
};

export default DashboardShell;
