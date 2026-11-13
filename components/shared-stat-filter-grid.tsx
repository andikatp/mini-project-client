import { DashboardCard } from "@/components/shared-dashboard-card";
import { CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export interface FilterStatCardItem {
  id: string;
  title: string;
  value: number | string;
  icon: LucideIcon;
  desc: string;
}

interface FilterableStatGridProps {
  items: FilterStatCardItem[];
  activeId: string;
  onSelect: (id: string) => void;
  columnsClassName?: string;
}

export function FilterableStatGrid({
  items,
  activeId,
  onSelect,
  columnsClassName = "grid-cols-1 md:grid-cols-3",
}: FilterableStatGridProps) {
  return (
    <div className={`grid ${columnsClassName} gap-px bg-border border border-border`}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;

        return (
          <button
            key={item.id}
            type="button"
            aria-label={`Filter by ${item.title}`}
            onClick={() => onSelect(item.id)}
            className={`text-left cursor-pointer transition-colors relative bg-background ${
              isActive
                ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground"
                : "hover:bg-muted/30"
            }`}
          >
            <DashboardCard className="py-6 bg-transparent">
              <CardContent className="flex justify-between flex-row px-6">
                <div className="flex flex-col items-start gap-4 w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-normal text-muted-foreground">{item.title}</p>
                      <h3 className="text-2xl font-semibold text-foreground">{item.value}</h3>
                    </div>
                    <div className="border border-border p-2.5 w-fit rounded-md text-foreground">
                      <Icon size={16} />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </CardContent>
            </DashboardCard>
          </button>
        );
      })}
    </div>
  );
}
