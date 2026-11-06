import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ForgotPasswordArtwork } from "@/features/auth/components/auth-artworks";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi | Ramein",
  description:
    "Pulihkan akses akun Ramein Anda. Masukkan email terdaftar dan kami akan mengirimkan kode OTP 6-digit pembuatan kata sandi baru.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout artwork={<ForgotPasswordArtwork />}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
