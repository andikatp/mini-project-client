import { Suspense } from "react";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { RegisterArtwork } from "@/features/auth/components/auth-artworks";
import { RegisterForm } from "@/features/auth/components/register-form";
import { Loader2 } from "lucide-react";

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
