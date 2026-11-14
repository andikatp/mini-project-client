import {
  type LucideIcon,
  LayoutDashboard,
  Calendar,
  Receipt,
  UserCircle,
  Ticket,
  Star,
  Gift,
} from "lucide-react";
import type { UserRole } from "@/features/auth/types";

export interface ChildItem {
  id?: number | string;
  name: string;
  icon?: LucideIcon;
  items?: ChildItem[];
  item?: unknown;
  url?: string;
  color?: string;
  disabled?: boolean;
  subtitle?: string;
  badge?: boolean;
  badgeType?: string;
  badgeContent?: string;
  isActive?: boolean;
  external?: boolean;
  isPro?: boolean;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: LucideIcon;
  id?: number | string;
  to?: string;
  item?: MenuItem[];
  items?: ChildItem[];
  url?: string;
  disabled?: boolean;
  subtitle?: string;
  badgeType?: string;
  badge?: boolean;
  badgeContent?: string;
  isActive?: boolean;
  isPro?: boolean;
}

export function getSidebarItems(role?: UserRole): MenuItem[] {
  if (role === "EVENT_ORGANIZER") {
    return [
      {
        heading: "Organizer Menu",
        items: [
          {
            id: "org-dashboard",
            name: "Dashboard",
            icon: LayoutDashboard,
            url: "/dashboard",
          },
          {
            id: "org-events",
            name: "My Events",
            icon: Calendar,
            url: "/organizer/events",
          },
          {
            id: "org-transactions",
            name: "Transactions",
            icon: Receipt,
            url: "/organizer/transactions",
          },
          {
            id: "org-profile",
            name: "Profile",
            icon: UserCircle,
            url: "/profile",
          },
        ],
      },
    ];
  }

  // Customer menu: My Transactions (first), Reviews, Rewards, Profile
  return [
    {
      heading: "Customer Menu",
      items: [
        {
          id: "cust-transactions",
          name: "My Transactions",
          icon: Ticket,
          url: "/transactions",
        },
        {
          id: "cust-reviews",
          name: "Reviews",
          icon: Star,
          url: "/reviews",
        },
        {
          id: "cust-rewards",
          name: "Rewards",
          icon: Gift,
          url: "/rewards",
        },
        {
          id: "cust-profile",
          name: "Profile",
          icon: UserCircle,
          url: "/profile",
        },
      ],
    },
  ];
}
