import Footer from "@/components/dashboard-layout/footer/page";
import Header from "@/components/dashboard-layout/vertical/header";
import { AppSidebar } from "@/components/dashboard-layout/vertical/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/features/auth/context/auth-store";
import { useRouter } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser);
  const [isVerifying, setIsVerifying] = useState(!user);

  useEffect(() => {
    let isMounted = true;

    if (user) {
      if (isMounted) setIsVerifying(false);
      return;
    }

    if (isInitialized && !user) {
      if (isMounted) {
        setIsVerifying(false);
        router.replace("/login");
      }
      return;
    }

    async function checkAuth() {
      try {
        const currentUser = await fetchCurrentUser();
        if (!currentUser && isMounted) {
          router.replace("/login");
        }
      } catch {
        if (isMounted) {
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    void checkAuth();

    return () => {
      isMounted = false;
    };
  }, [fetchCurrentUser, isInitialized, router, user]);

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
      <SidebarInset className="outline outline-border m-2 rounded-none! overflow-y-auto">
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className={cn("w-full mx-auto", "container")}>
            <div className="min-h-[calc(100vh-140px)]">
              <Outlet />
            </div>
            <div className="pt-6">
              <Footer />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
