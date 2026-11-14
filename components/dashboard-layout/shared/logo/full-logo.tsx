"use client";

import { RameinIcon } from "@/components/common/ramein-icon";
import Link from "@/lib/router-compat";

const FullLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg shadow-xs transition-transform group-hover:scale-105">
        <RameinIcon size={24} />
      </div>
      <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
        <span className="text-lg font-black tracking-tight text-foreground leading-none">
          RAME<span className="text-blue-900">IN</span>
        </span>
      </div>
    </Link>
  );
};

export default FullLogo;
