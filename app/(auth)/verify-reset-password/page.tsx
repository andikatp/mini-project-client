import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { VerifyResetPasswordArtwork } from "@/features/auth/components/auth-artworks";
import { VerifyResetPasswordForm } from "@/features/auth/components/verify-reset-password-form";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Verifikasi Kode Pemulihan | EventMgmt",
  description:
    "Masukkan kode OTP 6-digit yang telah dikirimkan ke email untuk melanjutkan proses atur ulang kata sandi.",
};

export default function VerifyResetPasswordPage() {
  return (
    <AuthLayout artwork={<VerifyResetPasswordArtwork />}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="size-6 animate-spin text-blue-600" />
          </div>
        }
      >
        <VerifyResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}

