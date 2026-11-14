import { Suspense } from "react";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { VerifyEmailArtwork } from "@/features/auth/components/auth-artworks";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";
import { Loader2 } from "lucide-react";

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
