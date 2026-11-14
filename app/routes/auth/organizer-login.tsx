import { AuthLayout } from "@/features/auth/components/auth-layout";
import { OrganizerLoginArtwork } from "@/features/auth/components/auth-artworks";
import { OrganizerLoginForm } from "@/features/auth/components/organizer-login-form";

export default function OrganizerLoginPage() {
  return (
    <AuthLayout artwork={<OrganizerLoginArtwork />}>
      <OrganizerLoginForm />
    </AuthLayout>
  );
}
