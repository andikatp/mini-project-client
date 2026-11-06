import ProfileFormView from "@/features/profile/components/profile-form-view";
import { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Profile - Ramein",
  description: "User profile and account settings",
};

export default function ProfilePage() {
  return <ProfileFormView />;
}
