import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { VerifyEmailArtwork } from "@/features/auth/components/auth-artworks";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Verifikasi Alamat Email | EventMgmt",
  description:
    "Verifikasi email akun EventMgmt Anda untuk mengaktifkan akun dan mulai membeli tiket atau mengelola event.",
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout artwork={<VerifyEmailArtwork />}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="size-6 animate-spin text-sky-600" />
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </AuthLayout>
  );
}
