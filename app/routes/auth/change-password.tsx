import { ChangePasswordArtwork } from "@/features/auth/components/auth-artworks";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <AuthLayout artwork={<ChangePasswordArtwork />}>
      <ChangePasswordForm />
    </AuthLayout>
  );
}
