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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        type="button"
        onClick={() => onFilterChange("ALL")}
        className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
          statusFilter === "ALL"
            ? "bg-primary/5 border-primary shadow-xs"
            : "bg-card border-border hover:border-border/80"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">All Events</span>
          <Calendar className="size-4 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mt-2 text-foreground">{counts.all}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">Total registered events</p>
      </button>

      <button
        type="button"
        onClick={() => onFilterChange("PUBLISHED")}
        className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
          statusFilter === "PUBLISHED"
            ? "bg-emerald-500/5 border-emerald-500 shadow-xs"
            : "bg-card border-border hover:border-border/80"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Active / Published</span>
          <Ticket className="size-4 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold mt-2 text-foreground">{counts.published}</h3>
        <p className="text-[11px] text-emerald-600 mt-0.5">Currently on sale</p>
      </button>

      <button
        type="button"
        onClick={() => onFilterChange("COMPLETED")}
        className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
          statusFilter === "COMPLETED"
            ? "bg-blue-500/5 border-blue-500 shadow-xs"
            : "bg-card border-border hover:border-border/80"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Completed</span>
          <Users className="size-4 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold mt-2 text-foreground">{counts.completed}</h3>
        <p className="text-[11px] text-blue-600 mt-0.5">Finished events</p>
      </button>
    </div>
  );
}
