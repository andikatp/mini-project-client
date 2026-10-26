import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { CustomerLoginArtwork } from "@/features/auth/components/auth-artworks";
import { CustomerLoginForm } from "@/features/auth/components/customer-login-form";

export const metadata: Metadata = {
  title: "Masuk ke Akun Customer | EventMgmt",
  description:
    "Masuk ke akun EventMgmt Anda untuk membeli tiket konser, festival, dan acara favorit Anda dengan mudah dan aman.",
};

export default function CustomerLoginPage() {
  return (
    <AuthLayout artwork={<CustomerLoginArtwork />}>
      <CustomerLoginForm />
    </AuthLayout>
  );
}
