"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";

const FullLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
        <Calendar className="size-4" />
      </div>
      <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
        <span className="text-base font-bold tracking-tight text-foreground leading-none">
          EventMgmt
        </span>
        <span className="text-[10px] font-medium text-muted-foreground leading-tight">
          Platform
        </span>
      </div>
    </Link>
  );
};

export default FullLogo;
