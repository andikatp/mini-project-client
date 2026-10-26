import Link from "next/link";
import { Ticket } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  inverted?: boolean;
}

export function BrandLogo({ className = "", size = "default", inverted = false }: BrandLogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    default: "text-2xl",
    lg: "text-3xl",
  };

  const iconSizes = {
    sm: "size-5",
    default: "size-6",
    lg: "size-7",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 group transition-transform hover:scale-[1.02] ${className}`}
      aria-label="EventMgmt Beranda"
    >
      <div className="relative flex items-center justify-center bg-blue-600 text-white rounded-xl p-1.5 shadow-sm group-hover:bg-blue-700 transition-colors">
        <Ticket className={iconSizes[size]} />
      </div>
      <div
        className={`flex items-baseline font-black tracking-tight ${inverted ? "text-white" : "text-foreground"}`}
      >
        <span className={sizeClasses[size]}>EVENT</span>
        <span className={`${sizeClasses[size]} ${inverted ? "text-blue-400" : "text-blue-600"}`}>
          MGMT
        </span>
        <span className="ml-1 text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded px-1 py-0.5 leading-none">
          Live
        </span>
      </div>
    </Link>
  );
}
