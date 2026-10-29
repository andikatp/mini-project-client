export type UserRole = "CUSTOMER" | "EVENT_ORGANIZER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  referralCode?: string | null;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data?: T;
}

export interface LoginResponseData {
  user: User;
}

export interface CustomerLoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface OrganizerLoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: UserRole;
  referralCode?: string;
  agreeToTerms?: boolean;
}

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export interface ResendVerificationInput {
  email: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyResetPasswordInput {
  email: string;
  otp: string;
}

export interface VerifyResetPasswordResponseData {
  resetToken?: string;
  token?: string;
}

export interface ResetPasswordInput {
  resetToken: string;
  password: string;
  confirmPassword?: string;
  email?: string;
  otp?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}
