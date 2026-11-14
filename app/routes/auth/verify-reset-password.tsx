import { Suspense } from "react";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { VerifyResetPasswordArtwork } from "@/features/auth/components/auth-artworks";
import { VerifyResetPasswordForm } from "@/features/auth/components/verify-reset-password-form";
import { Loader2 } from "lucide-react";

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
