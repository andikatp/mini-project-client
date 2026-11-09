"use client";

import { BrandLogo } from "@/components/common/brand-logo";
import { useAuthStore } from "@/features/auth/context/auth-store";
import { CircleFadingPlusIcon, Compass } from "lucide-react";
import Link from "next/link";
import { NavbarSearch } from "./navbar-search";
import { NavbarUserMenu } from "./navbar-user-menu";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <BrandLogo size="default" />

          <Link
            href="/events"
            className="hidden items-center gap-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-blue-600 sm:flex"
          >
            <Compass className="size-4 text-muted-foreground" />
            <span>Kategori</span>
          </Link>
        </div>

        <NavbarSearch onSearch={onSearch} />

        <div className="flex items-center gap-8">
          <Link
            href={
              isAuthenticated && user?.role === "EVENT_ORGANIZER"
                ? "/organizer/dashboard"
                : "/login/organizer"
            }
            className="hidden items-center gap-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-blue-600 md:flex"
          >
            <CircleFadingPlusIcon className="size-4" />
            <span>Bikin Event</span>
          </Link>

          <NavbarUserMenu />
        </div>
      </div>
    </header>
  );
}
