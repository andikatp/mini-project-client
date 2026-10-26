import React from "react";

interface AuthLayoutProps {
  artwork: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  subtitle?: React.ReactNode;
}

export function AuthLayout({ artwork, children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Artwork & Catchy Copy (Hidden on mobile to eliminate scrolling) */}
          <section
            aria-label="Informasi Fitur"
            className="hidden lg:flex lg:col-span-6 flex-col items-center justify-center py-4"
          >
            {artwork}
          </section>

          {/* Right Column: Form Container Card */}
          <section
            aria-label="Formulir Otentikasi"
            className="w-full lg:col-span-6 flex flex-col items-center lg:items-start justify-center"
          >
            <div className="w-full max-w-md mx-auto lg:mx-0">
              {title && (
                <div className="mb-6 text-center lg:text-left">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                  {subtitle && (
                    <div className="mt-1.5 text-sm text-muted-foreground">{subtitle}</div>
                  )}
                </div>
              )}
              <div className="rounded-2xl sm:rounded-3xl shadow-xl lg:shadow-none overflow-hidden">
                {children}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Simple Accessible Footer */}
      <footer className="w-full py-6 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-4">
          <span>&copy; 2026 EventMgmt Platform</span>
          <span>&bull;</span>
          <span className="hover:text-foreground transition-colors">Aman &amp; Terverifikasi</span>
        </div>
      </footer>
    </div>
  );
}
