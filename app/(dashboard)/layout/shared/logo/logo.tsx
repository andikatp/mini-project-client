"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { RameinIcon } from "@/components/common/ramein-icon";

const Logo = () => {
  return (
    <Link href="/" title="Ramein">
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div className="flex h-8 w-8 items-center justify-center">
          <RameinIcon size={32} />
        </div>
      </SidebarMenuButton>
    </Link>
  );
};

export default Logo;
