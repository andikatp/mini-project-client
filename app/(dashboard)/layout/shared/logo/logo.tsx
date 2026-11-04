"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { Calendar } from "lucide-react";

const Logo = () => {
  return (
    <Link href="/">
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
          <Calendar className="size-4" />
        </div>
      </SidebarMenuButton>
    </Link>
  );
};

export default Logo;
