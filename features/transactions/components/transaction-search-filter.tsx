import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TransactionSearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const filterOptions = [
  { value: "ALL", label: "All" },
  { value: "WAITING_FOR_PAYMENT", label: "Needs Payment" },
  { value: "WAITING_FOR_ADMIN_CONFIRMATION", label: "Waiting Review" },
  { value: "DONE", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELED", label: "Canceled" },
  { value: "EXPIRED", label: "Expired" },
];

export function TransactionSearchFilter({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: TransactionSearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by order code or event title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {filterOptions.map((opt) => {
          const isSelected = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
