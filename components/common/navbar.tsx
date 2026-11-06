"use client";

import { BrandLogo } from "@/components/common/brand-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/features/auth/context/auth-store";
import {
  CircleFadingPlusIcon,
  Compass,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.refresh();
  };

  const handleNavigate = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left Section: Brand Logo & Kategori */}
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

        {/* Center Section: Search Bar */}
        <div className="mx-2 max-w-md flex-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari event di sini..."
              className="w-full rounded-md bg-muted py-4 pr-10 pl-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              aria-label="Cari event"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Search className="size-4" />
            </button>
          </form>
        </div>

        {/* Right Section: Action Links & Account Dropdown */}
        <div className="flex items-center gap-8">
          {/* Bikin Event (Pengganti Kerjasama dengan Kami) */}
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

          {/* Akun Dropdown Menu (key={pathname} ensures clean closed state on any navigation) */}
          <DropdownMenu key={pathname} open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-950">
              <User className="size-4" />
              <span>{isAuthenticated && user?.name ? user.name.split(" ")[0] : "Akun"}</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-56 rounded-xl border border-border p-2 shadow-lg"
            >
              {isAuthenticated && user ? (
                <>
                  <DropdownMenuLabel className="px-2 py-1.5">
                    <div className="flex flex-col space-y-0.5">
                      <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() =>
                        handleNavigate(
                          user.role === "EVENT_ORGANIZER" ? "/organizer/dashboard" : "/dashboard",
                        )
                      }
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2"
                    >
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleNavigate("/profile")}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2"
                    >
                      <User className="size-4 text-muted-foreground" />
                      <span>Profil Saya</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2"
                  >
                    <LogOut className="size-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </>
              ) : (
                // State: Belum Login
                <>
                  <div className="flex flex-col gap-2 p-1">
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex h-9 w-full items-center justify-center rounded-lg border border-blue-600/30 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                    >
                      Daftar
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex h-9 w-full items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
                    >
                      Masuk
                    </Link>
                  </div>
                  <DropdownMenuSeparator className="my-1.5" />
                  <DropdownMenuItem
                    onClick={() => handleNavigate("/help")}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="size-4" />
                      Pusat Bantuan
                    </span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
