import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { RegisterArtwork } from "@/features/auth/components/auth-artworks";
import { RegisterForm } from "@/features/auth/components/register-form";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Daftar Akun Baru | EventMgmt",
  description:
    "Daftar akun EventMgmt sekarang. Nikmati diskon referral 10% untuk Customer atau kelola event spektakuler Anda sebagai Organizer.",
};

export default function RegisterPage() {
  return (
    <AuthLayout artwork={<RegisterArtwork />}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="size-6 animate-spin text-blue-600" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
