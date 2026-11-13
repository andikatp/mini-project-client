import { DashboardCard } from "@/components/shared-dashboard-card";
import { CardContent } from "@/components/ui/card";
import { Calendar, Ticket, Users } from "lucide-react";

interface EventStatsCardsProps {
  counts: {
    all: number;
    published: number;
    completed: number;
  };
  statusFilter: string;
  onFilterChange: (status: string) => void;
}

export function EventStatsCards({ counts, statusFilter, onFilterChange }: EventStatsCardsProps) {
  const cards = [
    {
      id: "ALL",
      title: "All Events",
      value: counts.all,
      icon: Calendar,
      desc: "Total registered events",
    },
    {
      id: "PUBLISHED",
      title: "Active / Published",
      value: counts.published,
      icon: Ticket,
      desc: "Currently on sale",
    },
    {
      id: "COMPLETED",
      title: "Completed",
      value: counts.completed,
      icon: Users,
      desc: "Finished events",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = statusFilter === c.id;

        return (
          <button
            key={c.id}
            type="button"
            aria-label={`Filter by ${c.title}`}
            onClick={() => onFilterChange(c.id)}
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
                      <p className="text-sm font-normal text-muted-foreground">{c.title}</p>
                      <h3 className="text-2xl font-semibold text-foreground">{c.value}</h3>
                    </div>
                    <div className="border border-border p-2.5 w-fit rounded-md text-foreground">
                      <Icon size={16} />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{c.desc}</div>
                </div>
              </CardContent>
            </DashboardCard>
          </button>
        );
      })}
    </div>
  );
}
