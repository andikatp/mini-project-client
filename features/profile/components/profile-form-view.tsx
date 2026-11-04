"use client";

import BreadcrumbComp from "@/app/(dashboard)/layout/shared/breadcrumb/breadcrumb-comp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/features/profile/hooks/use-user-profile";
import {
  ArrowRight,
  Camera,
  Check,
  Clock,
  Copy,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  Save,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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

  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
    }
  }, [profile]);

  const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : "U";
  const referralCode = profile?.referralCode ?? "REF-2026-DISC";

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (server enforces 1MB limit in multer)
    if (file.size > 1 * 1024 * 1024) {
      setProfileMsg({
        type: "error",
        text: "Ukuran gambar maksimal 1MB.",
      });
      return;
    }

    // Validate type (JPEG, PNG, WebP)
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setProfileMsg({
        type: "error",
        text: "Format file tidak didukung. Harap pilih JPEG, PNG, atau WebP.",
      });
      return;
    }

    try {
      setProfileMsg(null);
      await uploadAvatar(file);
      setProfileMsg({
        type: "success",
        text: "Foto profil berhasil diperbarui!",
      });
      setTimeout(() => setProfileMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto profil";
      setProfileMsg({
        type: "error",
        text: msg,
      });
    } finally {
      e.target.value = "";
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileMsg({
        type: "error",
        text: "Nama tidak boleh kosong.",
      });
      return;
    }

    setProfileMsg(null);
    try {
      await updateProfile({ name: name.trim() });
      setProfileMsg({
        type: "success",
        text: "Nama profil berhasil disimpan!",
      });
      setTimeout(() => setProfileMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui profil";
      setProfileMsg({
        type: "error",
        text: msg,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <BreadcrumbComp title="User Profile" />

      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="h-7 text-xs flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={12} /> Coba Lagi
          </Button>
        </div>
      )}

      {/* Hero Banner Section (Image + Main Info) */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Upload button */}
          <div className="relative group shrink-0">
            <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-md">
              {profile?.avatarUrl && (
                <AvatarImage src={profile.avatarUrl} alt={profile.name ?? "User"} />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                {isLoading || isUploadingAvatar ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  initial
                )}
              </AvatarFallback>
            </Avatar>

            <label
              htmlFor="avatar-upload"
              aria-label="Ubah foto profil"
              className={`absolute -bottom-1 -right-1 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 shadow-md transition-all hover:scale-105 ${
                isUploadingAvatar ? "opacity-50 pointer-events-none" : ""
              }`}
              title="Change profile picture"
            >
              {isUploadingAvatar ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Camera size={14} />
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                disabled={isUploadingAvatar}
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {/* User Bio */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 flex-1">
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {isLoading ? "Memuat..." : profile?.name ?? "User"}
              </h2>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary font-medium px-2.5 py-0.5 rounded-full"
              >
                {profile?.role === "EVENT_ORGANIZER"
                  ? "Event Organizer"
                  : "Customer / Attendee"}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Mail size={14} />
              {profile?.email ?? "user@example.com"}
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded-md flex items-center gap-1">
                <Clock size={12} />
                {profile?.createdAt
                  ? `Joined ${new Date(profile.createdAt).getFullYear()}`
                  : "Joined 2026"}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                <ShieldCheck size={12} />
                {profile?.emailVerifiedAt ? "Verified Account" : "Account Active"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Elements */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column: Personal Information Form */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <UserIcon size={18} className="text-primary" />
                <h3 className="font-semibold text-lg text-foreground">Personal Information</h3>
              </div>
              <span className="text-xs text-muted-foreground">Editable</span>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-6 flex flex-col gap-5">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullname">Full Name</Label>
                <div className="relative">
                  <UserIcon
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="fullname"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    disabled={isUpdating}
                    className="pl-10!"
                  />
                </div>
              </div>

              {/* Email (Readonly as per Auth spec) */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email ?? ""}
                    disabled
                    readOnly
                    className="pl-10! bg-muted/50 cursor-not-allowed"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Email address is linked to your account and cannot be modified directly.
                </span>
              </div>

              {/* Immutable Referral Code (PRD 4.2) */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="referral">Your Referral Code</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Sparkles
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                    />
                    <Input
                      id="referral"
                      value={referralCode}
                      readOnly
                      className="pl-10! font-mono font-bold text-primary tracking-wider bg-primary/5 cursor-default"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyReferral}
                    className="flex items-center gap-1.5 px-3 cursor-pointer"
                  >
                    {copied ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                    <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Share this code with friends to earn coupons & reward points.
                </span>
              </div>

              {profileMsg && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium border ${
                    profileMsg.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-destructive/10 border-destructive/20 text-destructive"
                  }`}
                >
                  {profileMsg.text}
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
                      Saving Changes...
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
        </div>

        {/* Right Column: Account Security & Password Navigation */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-primary" />
                <h3 className="font-semibold text-lg text-foreground">Security & Password</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                Active
              </Badge>
            </div>

            <div className="mt-6 flex flex-col gap-6">
              <div className="flex items-start gap-3.5 p-4 rounded-lg bg-muted/40 border border-border">
                <div className="p-2.5 rounded-md bg-primary/10 text-primary shrink-0">
                  <Lock size={20} />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    Password Management
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Perbarui kata sandi akun Anda secara berkala melalui halaman khusus ganti kata
                    sandi demi menjaga keamanan data dan transaksi Anda.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-medium text-foreground">Aksi Keamanan</span>
                <Link href="/change-password">
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-3 px-4 cursor-pointer hover:border-primary/50 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Lock
                        size={16}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      />
                      <span className="text-sm font-medium">
                        Buka Halaman Ganti Kata Sandi
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5"
                    />
                  </Button>
                </Link>
              </div>

              <div className="p-4 rounded-lg border border-border/80 bg-background flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Autentikasi Akun
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Akun Anda dilindungi dengan enkripsi standar industri. Jika Anda mencurigai adanya
                  aktivitas mencurigakan, segera ganti kata sandi Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
