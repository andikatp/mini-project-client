import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Public landing
  index("routes/landing.tsx"),

  // Auth routes
  route("login", "routes/auth/login.tsx"),
  route("login/organizer", "routes/auth/organizer-login.tsx"),
  route("register", "routes/auth/register.tsx"),
  route("verify-email", "routes/auth/verify-email.tsx"),
  route("forgot-password", "routes/auth/forgot-password.tsx"),
  route("reset-password", "routes/auth/reset-password.tsx"),
  route("verify-reset-password", "routes/auth/verify-reset-password.tsx"),
  route("change-password", "routes/auth/change-password.tsx"),

  // Protected / Dashboard layout
  layout("routes/dashboard/layout.tsx", [
    route("dashboard", "routes/dashboard/dashboard.tsx"),
    route("profile", "routes/dashboard/profile.tsx"),
    route("rewards", "routes/dashboard/rewards.tsx"),
    route("transactions", "routes/dashboard/transactions.tsx"),
    route("reviews", "routes/dashboard/reviews.tsx"),
    route("organizer/events", "routes/dashboard/organizer-events.tsx"),
  ]),
] satisfies RouteConfig;
