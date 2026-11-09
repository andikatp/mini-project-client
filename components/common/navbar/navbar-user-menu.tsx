"use client";

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
import { HelpCircle, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function NavbarUserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

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
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1.5">
                <div className="flex flex-col space-y-0.5">
                  <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
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
          <>
            <div className="flex flex-col gap-2 p-1">
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-full items-center justify-center rounded-lg border border-blue-900 text-sm font-semibold text-blue-900 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                Daftar
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-full items-center justify-center rounded-lg bg-blue-900 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
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
  );
}
