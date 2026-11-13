import { FilterableStatGrid, type FilterStatCardItem } from "@/components/shared-stat-filter-grid";
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
  const cards: FilterStatCardItem[] = [
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
    <FilterableStatGrid
      items={cards}
      activeId={statusFilter}
      onSelect={onFilterChange}
      columnsClassName="grid-cols-1 md:grid-cols-3"
    />
  );
}
