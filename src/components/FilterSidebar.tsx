import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter } from "lucide-react";

const filterGroups = [
  { key: "time", label: "TIME" },
  { key: "demographics", label: "DEMOGRAPHICS" },
  { key: "platform", label: "PLATFORM" },
  { key: "category", label: "CATEGORY" },
  { key: "customer-type", label: "CUSTOMER TYPE" },
];

const FilterSidebar = () => {
  return (
    <div className="flex flex-col gap-0">
      {/* Sidebar header */}
      <div className="flex items-center gap-2 border-b border-border-dim px-4 py-3">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Filters &amp; Slicers
        </span>
      </div>

      {/* Accordion filter groups */}
      <Accordion type="multiple" className="w-full" defaultValue={["time"]}>
        {filterGroups.map(({ key, label }) => (
          <AccordionItem
            key={key}
            value={key}
            className="border-b border-border-dim"
          >
            <AccordionTrigger className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:no-underline [&[data-state=open]]:text-foreground">
              {label}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-0">
              <div className="rounded-lg border border-border-dim bg-surface-2 px-3 py-3">
                <p className="text-xs text-muted-foreground">
                  Filter options coming in next phase.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
