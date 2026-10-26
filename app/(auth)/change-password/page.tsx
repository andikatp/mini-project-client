import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ChangePasswordArtwork } from "@/features/auth/components/auth-artworks";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";

export const metadata: Metadata = {
  title: "Ganti Kata Sandi | EventMgmt",
  description:
    "Perbarui kata sandi akun EventMgmt Anda secara berkala untuk menjaga keamanan data dan transaksi.",
};

export default function ChangePasswordPage() {
  return (
    <AuthLayout artwork={<ChangePasswordArtwork />}>
      <ChangePasswordForm />
    </AuthLayout>
  );
}
