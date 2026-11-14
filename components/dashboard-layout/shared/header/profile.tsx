"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/features/auth/context/auth-store";
import { LogOut, Mailbox, UserCircle, X } from "lucide-react";
import Link from "@/lib/router-compat";
import { useRouter } from "@/lib/router-compat";

export default function ProfileSheet() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.replace("/");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <SheetTrigger className="cursor-pointer hover:bg-primary/5 flex items-center justify-center rounded-full h-10 w-10">
        <Avatar className="h-8 w-8">
          {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name ?? "User"} />}
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {initial}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>

      {/* Drawer Panel */}
      <SheetContent
        showCloseButton={false}
        side="right"
        className="border-s-0 w-full sm:max-w-80 max-w-60"
      >
        <SheetClose className="absolute top-5 inset-e-5 p-2 hover:bg-primary/5 hover:text-primary rounded-full cursor-pointer">
          <X width={20} height={20} />
        </SheetClose>

        {/* Top Profile Section */}
        <div className="p-6 py-6">
          <div className="flex flex-col gap-4 justify-center items-center pt-10">
            <Avatar className="h-16 w-16">
              {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name ?? "User"} />}
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {initial}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h6 className="text-lg font-semibold">{user?.name ?? "User"}</h6>
              <div className="flex items-center gap-2 justify-center">
                <Mailbox size={16} className="text-muted-foreground" />
                <span className="text-sm font-normal text-muted-foreground truncate max-w-52">
                  {user?.email ?? "user@example.com"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="border-t border-dashed border-border">
          <ul className="flex flex-col gap-2 p-6">
            <li>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <UserCircle width={20} height={20} />
                <span className="text-sm font-medium">My Profile</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <SheetFooter className="px-6 pb-6 mt-auto">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut size={16} />
            Log Out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
