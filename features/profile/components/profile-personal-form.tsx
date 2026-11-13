"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/features/profile/types";
import { Camera, Check, Copy, Loader2, Mail, Save, Sparkles, User as UserIcon } from "lucide-react";

interface ProfilePersonalFormProps {
  profile: UserProfile | null;
  name: string;
  onNameChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isUpdating: boolean;
  isUploadingAvatar: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  message: { type: "success" | "error"; text: string } | null;
}

export function ProfilePersonalForm({
  profile,
  name,
  onNameChange,
  onSubmit,
  isUpdating,
  isUploadingAvatar,
  onAvatarChange,
  message,
}: ProfilePersonalFormProps) {
  const [copied, setCopied] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  const handleCopyReferral = async () => {
    if (!profile?.referralCode) return;
    try {
      await navigator.clipboard.writeText(profile.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="md:p-6 p-4 bg-background">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <UserIcon size={18} className="text-primary" />
          <h3 className="font-semibold text-lg text-foreground">Personal Information</h3>
        </div>
        <Badge variant="secondary" className="capitalize text-xs">
          {profile?.role?.replace("_", " ").toLowerCase() ?? "User"}
        </Badge>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-4 py-6 border-b border-border">
        <div className="relative group">
          <Avatar className="h-20 w-20 border border-border">
            {profile?.avatarUrl && (
              <AvatarImage src={profile.avatarUrl} alt={name || "User Avatar"} />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload-input"
            className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera size={20} />
            <span className="text-[10px] font-medium mt-1">Change</span>
            <input
              id="avatar-upload-input"
              type="file"
              accept="image/*"
              onChange={onAvatarChange}
              disabled={isUploadingAvatar}
              className="sr-only"
            />
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-sm text-foreground">{name || "User"}</h4>
          <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB</p>
          {isUploadingAvatar && (
            <span className="text-xs text-primary font-medium flex items-center gap-1.5">
              <Loader2 size={12} className="animate-spin" /> Uploading image...
            </span>
          )}
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-name" className="text-sm">
            Full Name
          </Label>
          <Input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-email" className="text-sm">
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="profile-email"
              type="email"
              value={profile?.email ?? ""}
              disabled
              className="bg-muted/50 text-muted-foreground pr-8 cursor-not-allowed"
            />
            <Mail
              size={16}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          <span className="text-[11px] text-muted-foreground">
            Email address cannot be modified directly.
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm">Your Referral Code</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Sparkles
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
              />
              <Input
                readOnly
                value={profile?.referralCode ?? "-"}
                className="pl-10! bg-muted/50 text-foreground font-mono font-medium"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyReferral}
              className="shrink-0 flex items-center gap-1.5 px-3 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-xs text-emerald-600 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Share this code with friends to earn points and discounts.
          </span>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md text-xs font-medium border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isUpdating}
            className="w-full sm:w-auto flex items-center gap-2 cursor-pointer"
          >
            {isUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

