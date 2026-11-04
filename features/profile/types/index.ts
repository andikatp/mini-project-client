export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "EVENT_ORGANIZER";
  avatarUrl?: string | null;
  referralCode?: string | null;
  emailVerifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string | null;
}

export interface UploadImageResponse {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
}
