import ChangePasswordPage from "@/app/routes/auth/change-password";
import ForgotPasswordPage from "@/app/routes/auth/forgot-password";
import LoginPage from "@/app/routes/auth/login";
import OrganizerLoginPage from "@/app/routes/auth/organizer-login";
import RegisterPage from "@/app/routes/auth/register";
import ResetPasswordPage from "@/app/routes/auth/reset-password";
import VerifyEmailPage from "@/app/routes/auth/verify-email";
import VerifyResetPasswordPage from "@/app/routes/auth/verify-reset-password";
import DashboardPage from "@/app/routes/dashboard/dashboard";
import DashboardLayout from "@/app/routes/dashboard/layout";
import OrganizerEventsPage from "@/app/routes/dashboard/organizer-events";
import ProfilePage from "@/app/routes/dashboard/profile";
import ReviewsPage from "@/app/routes/dashboard/reviews";
import RewardsPage from "@/app/routes/dashboard/rewards";
import TransactionsPage from "@/app/routes/dashboard/transactions";
import LandingPage from "@/app/routes/landing";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/organizer" element={<OrganizerLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-reset-password" element={<VerifyResetPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/organizer/events" element={<OrganizerEventsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
