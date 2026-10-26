import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { OrganizerLoginArtwork } from "@/features/auth/components/auth-artworks";
import { OrganizerLoginForm } from "@/features/auth/components/organizer-login-form";

export const metadata: Metadata = {
  title: "Masuk sebagai Organizer | EventMgmt",
  description:
    "Masuk ke portal Event Organizer untuk mengelola penjualan tiket, rilis voucher promosi, dan monitor transaksi event Anda.",
};

export default function OrganizerAliasLoginPage() {
  return (
    <AuthLayout artwork={<OrganizerLoginArtwork />}>
      <OrganizerLoginForm />
    </AuthLayout>
  );
}
