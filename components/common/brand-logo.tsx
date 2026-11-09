import Link from "next/link";
import { RameinIcon } from "./ramein-icon";

interface BrandLogoProps {
  readonly className?: string;
  readonly size?: "sm" | "default" | "lg";
  readonly inverted?: boolean;
}

export function BrandLogo({
  className = "",
  size = "default",
  inverted = false,
}: Readonly<BrandLogoProps>) {
  const sizeClasses = {
    sm: "text-lg",
    default: "text-2xl",
    lg: "text-3xl",
  };

  const iconSizes = {
    sm: 24,
    default: 32,
    lg: 40,
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group transition-transform hover:scale-[1.02] ${className}`}
      aria-label="Ramein Beranda"
    >
      <div className="relative flex items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105">
        <RameinIcon size={iconSizes[size]} />
      </div>
      <div
        className={`flex items-baseline font-black tracking-tight ${inverted ? "text-white" : "text-foreground"}`}
      >
        <span className={sizeClasses[size]}>RAME</span>
        <span
          className={`${sizeClasses[size]} text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600`}
        >
          IN
        </span>
      </div>
    </Link>
  );
}
