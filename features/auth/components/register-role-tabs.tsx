import type { UserRole } from "../types";
import { Building2, User as UserIcon } from "lucide-react";

interface RegisterRoleTabsProps {
  role: UserRole;
  onSelectRole: (role: UserRole) => void;
  disabled?: boolean;
}

export function RegisterRoleTabs({ role, onSelectRole, disabled }: RegisterRoleTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg mb-5">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelectRole("CUSTOMER")}
        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
          role === "CUSTOMER"
            ? "bg-card text-blue-600 shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <UserIcon className="size-4" />
        Customer
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelectRole("EVENT_ORGANIZER")}
        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
          role === "EVENT_ORGANIZER"
            ? "bg-card text-indigo-600 shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Building2 className="size-4" />
        Organizer
      </button>
    </div>
  );
}
