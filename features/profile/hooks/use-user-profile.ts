import { useAuthStore } from "@/features/auth/context/auth-store";
import { compressClientImage } from "@/lib/image-compress";
import { useCallback, useEffect, useState } from "react";
import { profileApi } from "../api/profile-api";
import type { UpdateProfileInput, UserProfile } from "../types";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user: authUser, setSession } = useAuthStore();

  const syncUserSession = useCallback(
    (userData: UserProfile) => {
      setProfile(userData);
      setSession({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatarUrl: userData.avatarUrl,
        referralCode: userData.referralCode,
        isEmailVerified: Boolean(userData.emailVerifiedAt),
        createdAt: userData.createdAt,
      });
    },
    [setSession],
  );

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await profileApi.getUserProfile();
      if (res.data?.user) {
        syncUserSession(res.data.user);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat profil pengguna";
      setError(msg);
      if (authUser) {
        setProfile({
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          role: authUser.role,
          avatarUrl: authUser.avatarUrl,
          referralCode: authUser.referralCode,
          emailVerifiedAt: authUser.isEmailVerified ? new Date().toISOString() : null,
          createdAt: authUser.createdAt,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [authUser, syncUserSession]);

  const updateProfile = async (input: UpdateProfileInput): Promise<UserProfile> => {
    setIsUpdating(true);
    setError(null);
    try {
      const res = await profileApi.updateProfile(input);
      if (!res.data?.user) {
        throw new Error("Gagal memperbarui profil: Data tidak ditemukan");
      }
      syncUserSession(res.data.user);
      return res.data.user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui profil";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    setIsUploadingAvatar(true);
    setError(null);
    try {
      const compressedFile = await compressClientImage(file, {
        maxWidth: 1080,
        maxHeight: 1080,
        quality: 0.8,
        mimeType: "image/webp",
      });

      const uploadRes = await profileApi.uploadImage(compressedFile, "mini-project/avatars");
      const secureUrl = uploadRes.data?.url;
      if (!secureUrl) {
        throw new Error("Gagal mengunggah gambar ke server");
      }

      await updateProfile({ avatarUrl: secureUrl });
      return secureUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto profil";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile:
      profile ||
      (authUser
        ? {
            id: authUser.id,
            name: authUser.name,
            email: authUser.email,
            role: authUser.role,
            avatarUrl: authUser.avatarUrl,
            referralCode: authUser.referralCode,
            emailVerifiedAt: authUser.isEmailVerified ? new Date().toISOString() : null,
            createdAt: authUser.createdAt,
          }
        : null),
    isLoading,
    isUpdating,
    isUploadingAvatar,
    error,
    refetch: fetchProfile,
    updateProfile,
    uploadAvatar,
  };
}
