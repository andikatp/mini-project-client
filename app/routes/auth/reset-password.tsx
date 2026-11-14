import { Suspense } from "react";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ResetPasswordArtwork } from "@/features/auth/components/auth-artworks";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <AuthLayout artwork={<ResetPasswordArtwork />}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="size-6 animate-spin text-emerald-600" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
