"use client";

import Link from "next/link";
import { RameinIcon } from "@/components/common/ramein-icon";

const FullLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-xs transition-transform group-hover:scale-105">
        <RameinIcon size={32} />
      </div>
      <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
        <span className="text-base font-black tracking-tight text-foreground leading-none">
          RAME<span className="text-blue-600">IN</span>
        </span>
        <span className="text-[10px] font-semibold text-muted-foreground leading-tight tracking-wider uppercase">
          Event Platform
        </span>
      </div>
    </Link>
  );
};

export default FullLogo;
