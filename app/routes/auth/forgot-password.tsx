import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ForgotPasswordArtwork } from "@/features/auth/components/auth-artworks";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout artwork={<ForgotPasswordArtwork />}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
