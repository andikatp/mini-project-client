import { ChangePasswordArtwork } from "@/features/auth/components/auth-artworks";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ganti Kata Sandi | Ramein",
  description:
    "Perbarui kata sandi akun Ramein Anda secara berkala untuk menjaga keamanan data dan transaksi.",
};

export default function ChangePasswordPage() {
  return (
    <AuthLayout artwork={<ChangePasswordArtwork />}>
      <ChangePasswordForm />
    </AuthLayout>
  );
}
