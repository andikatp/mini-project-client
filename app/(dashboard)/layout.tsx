"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/features/auth/context/auth-store";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Footer from "./layout/footer/page";
import Header from "./layout/vertical/header";
import { AppSidebar } from "./layout/vertical/sidebar/app-sidebar";

export default function DashboardProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, fetchCurrentUser } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(!user);

  useEffect(() => {
    let isMounted = true;

    async function checkAndSyncAuth() {
      try {
        const currentUser = await fetchCurrentUser();
        if (!currentUser && !user) {
          router.replace("/login");
        }
      } catch {
        if (!user) {
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    void checkAndSyncAuth();

    return () => {
      isMounted = false;
    };
  }, [fetchCurrentUser, router, user]);

  if (isVerifying && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          Memeriksa sesi login...
        </p>
      </div>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={true}
      style={{ "--sidebar-width-icon": "52px" } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="outline outline-border m-2 rounded-none! overflow-hidden">
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className={cn("w-full mx-auto", "container")}>
            <div className="min-h-[calc(100vh-140px)]">{children}</div>
            <div className="pt-6">
              <Footer />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
