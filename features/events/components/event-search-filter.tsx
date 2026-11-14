import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "@/lib/router-compat";

interface EventSearchFilterProps {
  search: string;
  onSearchChange: (search: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const statusOptions = ["ALL", "PUBLISHED", "COMPLETED"] as const;

export function EventSearchFilter({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: EventSearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Link
          href="/organizer/events/create"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground h-9 px-3 gap-1.5 text-xs font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus className="size-4" />
          <span>Create Event</span>
        </Link>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search events by title, venue, city..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {statusOptions.map((st) => (
          <Button
            key={st}
            size="sm"
            variant={statusFilter === st ? "default" : "outline"}
            onClick={() => onStatusFilterChange(st)}
            className="h-8 text-xs capitalize cursor-pointer"
          >
            {st === "ALL" ? "All" : st.toLowerCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
