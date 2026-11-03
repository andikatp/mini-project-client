import ProfileFormView from "@/features/profile/components/profile-form-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - EventMgmt",
  description: "User profile and account settings",
};

export default function ProfilePage() {
  return <ProfileFormView />;
}
