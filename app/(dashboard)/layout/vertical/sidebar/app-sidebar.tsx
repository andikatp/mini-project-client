"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/context/auth-store";
import * as React from "react";
import { Suspense } from "react";
import SimpleBar from "simplebar-react";
import FullLogo from "../../shared/logo/full-logo";
import NavCollapse from "./nav-collapse";
import { NavUser } from "./nav-user";
import { getSidebarItems } from "./sidebaritems";

function NavSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-4 w-20 mt-2" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((s) => s.user);
  const menu = React.useMemo(() => getSidebarItems(user?.role), [user?.role]);

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      {...props}
      className="sidebar-box **:data-[slot=sidebar-inner]:bg-background **:data-[slot=sidebar-inner]:border **:data-[slot=sidebar-inner]:border-border group-data-[state=collapsed]:hover:shadow-xl"
      side="left"
    >
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center flex flex-row items-center justify-between border-b border-border">
        <FullLogo />
        <Badge className="group-data-[collapsible=icon]:hidden" variant={"secondary"}>
          {user?.role === "EVENT_ORGANIZER" ? "Organizer" : "User"}
        </Badge>
      </SidebarHeader>

      <SidebarContent>
        <SimpleBar style={{ height: "100%" }}>
          <SidebarGroup className="flex items-center justify-center group-data-[collapsible=icon]:px-1 px-3 py-4">
            <div className="px-0 group-data-[collapsible=icon]:px-0 w-full flex flex-col gap-4">
              <Suspense fallback={<NavSkeleton />}>
                <NavCollapse menu={menu} className="text-sm" />
              </Suspense>
            </div>
          </SidebarGroup>
        </SimpleBar>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
        <div className="hide-menu flex flex-col gap-2">
          <NavUser />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
