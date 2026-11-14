import { AuthLayout } from "@/features/auth/components/auth-layout";
import { CustomerLoginArtwork } from "@/features/auth/components/auth-artworks";
import { CustomerLoginForm } from "@/features/auth/components/customer-login-form";

export default function CustomerLoginPage() {
  return (
    <AuthLayout artwork={<CustomerLoginArtwork />}>
      <CustomerLoginForm />
    </AuthLayout>
  );
}
