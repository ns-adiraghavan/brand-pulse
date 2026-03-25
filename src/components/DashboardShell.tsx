import { useState, useEffect } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import SectionCard from "@/components/SectionCard";

const sections = [
  { id: "performance", label: "Performance" },
  { id: "perception", label: "Perception" },
  { id: "campaign", label: "Campaign" },
  { id: "behavior", label: "Behavior" },
  { id: "customer", label: "Customer" },
  { id: "deepdive", label: "Deep Dive" },
];

const DashboardShell = () => {
  const [activeSection, setActiveSection] = useState("performance");

  // Update active nav pill on scroll
  useEffect(() => {
    const handleScroll = () => {
      const mainEl = document.getElementById("main-content");
      if (!mainEl) return;

      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // 80px offset for the sticky header
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
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Sticky header */}
      <DashboardHeader
        sections={sections}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-border-dim bg-surface scrollbar-thin lg:block">
          <FilterSidebar />
        </aside>

        {/* Main scrollable content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto scrollbar-thin"
        >
          <div className="mx-auto max-w-6xl space-y-8 p-6">
            {sections.map(({ id, label }) => (
              <SectionCard key={id} id={id} label={label} />
            ))}
            {/* bottom padding */}
            <div className="h-16" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
