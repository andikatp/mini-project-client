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
  token: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}
