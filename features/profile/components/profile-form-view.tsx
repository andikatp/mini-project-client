"use client";

import BreadcrumbComp from "@/app/(dashboard)/layout/shared/breadcrumb/breadcrumb-comp";
import StyleAwareWrapper from "@/features/dashboard/components/StyleAwareWrapper";
import StyleDivider from "@/features/dashboard/components/StyleDivider";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/features/profile/hooks/use-user-profile";
import { Loader2, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { ProfilePersonalForm } from "./profile-personal-form";
import { ProfileSecurityCard } from "./profile-security-card";

export default function ProfileFormView() {
  const {
    profile,
    isLoading,
    isUpdating,
    isUploadingAvatar,
    error,
    refetch,
    updateProfile,
    uploadAvatar,
  } = useUserProfile();

  const [customName, setCustomName] = useState<string | null>(null);
  const name = customName ?? profile?.name ?? "";
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileMsg({ type: "error", text: "Please upload an image file (PNG, JPG, JPEG)" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileMsg({ type: "error", text: "File size exceeds 2MB limit" });
      return;
    }

    setProfileMsg(null);
    try {
      await uploadAvatar(file);
      setProfileMsg({ type: "success", text: "Avatar updated successfully" });
    } catch (err: unknown) {
      setProfileMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to upload avatar",
      });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileMsg({ type: "error", text: "Name cannot be empty" });
      return;
    }

    setProfileMsg(null);
    try {
      await updateProfile({ name: name.trim() });
      setProfileMsg({ type: "success", text: "Profile updated successfully" });
    } catch (err: unknown) {
      setProfileMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update profile",
      });
    }
  };

  if (isLoading) {
    return (
      <StyleAwareWrapper lyraClassName="flex flex-col p-px gap-px bg-border">
        <BreadcrumbComp title="Profile Settings" />
        <StyleDivider />
        <div className="flex h-64 items-center justify-center bg-background">
          <Loader2 className="animate-spin text-muted-foreground" size={32} />
        </div>
      </StyleAwareWrapper>
    );
  }

  return (
    <StyleAwareWrapper lyraClassName="flex flex-col p-px gap-px bg-border">
      <div className="flex items-center justify-between flex-wrap gap-4 bg-background pr-6">
        <div className="flex-1">
          <BreadcrumbComp title="Profile Settings" />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="flex items-center gap-2 cursor-pointer h-9 px-3"
        >
          <RefreshCw size={14} />
          Refresh
        </Button>
      </div>
      <StyleDivider />

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm font-medium">{error}</div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-border">
        <ProfilePersonalForm
          profile={profile}
          name={name}
          onNameChange={setCustomName}
          onSubmit={handleProfileSubmit}
          isUpdating={isUpdating}
          isUploadingAvatar={isUploadingAvatar}
          onAvatarChange={handleAvatarChange}
          message={profileMsg}
        />

        <ProfileSecurityCard />
      </div>
    </StyleAwareWrapper>
  );
}
