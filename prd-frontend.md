# Ramein — Frontend PRD

_Client-side contract for `mini-project-client`. Split from the full PRD
("Ramein — PRD (Improved)" in Google Docs), which remains the complete
reference ("kitab"). This file contains only what the frontend needs.
Move this file into the client repo root `docs/` when it is created._

## 1. Product & team

Ramein is a two-sided event platform: attendees discover events, buy
tickets, upload payment proof, use referral rewards, and review attended
events. Organizers create/promote events, review transactions, and monitor
performance from a shared, role-based dashboard.

| Owner              | Frontend scope                                                          |
| ------------------ | ----------------------------------------------------------------------- |
| Kelvin (Feature 1) | Discovery & search, event CRUD UI, checkout & proof upload, review UI   |
| Andika (Feature 2) | Auth pages, profile, referral UI, role-based dashboard content & charts |
| Shared             | API contract, route guards, shared dashboard shell, design consistency  |

## 2. Client stack

| Layer     | Technology                                                                                                                                    |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| App       | React 19 + Vite (SPA) + Tailwind CSS 4 + shadcn/ui (TypeScript)                                                                               |
| Toolchain | Vite (dev server + build) + Bun (package manager)                                                                                             |
| Routing   | React Router — public routes + one authenticated dashboard layout route (nested routes), role-based menus and route guards                    |
| Data      | TanStack Query + Axios (server-state cache, mutations)                                                                                        |
| Forms     | React Hook Form + Zod                                                                                                                         |
| Hosting   | Static build (`dist/`) on Vercel / Netlify / Render Static (decide with team); the host must rewrite all paths to `index.html` (SPA fallback) |

Env (client): `VITE_API_BASE_URL`, read via `import.meta.env`. Only
`VITE_`-prefixed variables are exposed to the browser. `.env.local` at
repo root; commit `.env.example`.

The client is a pure SPA: no SSR, no server components, all rendering
happens in the browser. The session cookie is sent on API calls via
Axios `withCredentials: true`; the API's CORS must allow the client
origin with credentials.

Structure: `src/main.tsx` (entry) + `src/router.tsx` (route
definitions); feature-based folders under `src/features/<feature>/`
(components, api, hooks, types); shared shadcn/ui components in
`src/components/ui`; shared clients (Axios instance, TanStack Query
client) in `src/lib`.

**Decided 2026-10-15:** no branding/design guidelines for MVP — clean,
responsive UI only.

## 3. Routes & access

Public: landing (`/`), event list + detail (`/events`, `/events/:id`),
signin/signup, forgot/reset password.

Protected (role guards + redirect):

- Shared (any signed-in role): `/dashboard`, `/profile`.
- Customer: `/checkout`, `/transactions`, `/transactions/:id`,
  `/rewards`.
- Organizer: `/organizer/events`, `/organizer/events/:id/edit`,
  `/organizer/transactions`.

Dashboard routing rules:

- `/dashboard` is the organizer's post-login landing page; customers are
  redirected to the home page (`/`) after sign-in. The page itself serves
  both roles: on app load the client restores the session via
  `GET /auth/me` and stores the user + role in the auth context; that
  session role selects the customer or organizer dashboard content, and
  the role must never be taken from a query parameter or editable
  client-only state.
- `/organizer` and `/organizer/dashboard` are not separate pages: both
  are redirect routes (`<Navigate to="/dashboard" replace />`).
- Authenticated customer and organizer pages share one dashboard shell
  (sidebar + topbar) rendered by a single layout route. Sidebar menu
  items are generated from the session role.
- Wrong-role access to a role-specific route is blocked by the route
  guard and redirected to `/dashboard`.

Guards improve UX only — the server re-checks every action.

## 4. Pages & flows

### 4.1 Discovery (Kelvin)

- `DISC-01` Landing lists upcoming published events (exclude past/draft/canceled).
- `DISC-02` Filters: category + location, combinable, reflected in URL query string.
- `DISC-03` Search with **400 ms debounce** — no request per keystroke.
- `DISC-04` Event detail: schedule, location, description, organizer + rating,
  ticket types, IDR prices (free vs paid clearly distinguished), availability.
- `DISC-05` Pagination (page size 12), loading / empty / error states.
  Empty search/filter shows a friendly empty state, not a blank page.

### 4.2 Auth & profile (Andika)

- Register (role choice CUSTOMER/EVENT_ORGANIZER + optional referral code
  field), sign in/out, session restore. Registration is gated: it creates
  an unverified account and emails the 6-digit OTP code via Resend, and
  NO session exists yet. The user then verifies their email on the OTP
  page (expires in 10 minutes, max 5 attempts, resend available); a
  successful verification creates the session and signs the user in.
  Signing in before verification is refused and routes the user to the
  verification page with a fresh code. Registering again with the same
  still-unverified email re-sends the code and continues that account's
  verification instead of failing as a duplicate.
- After successful sign-in (or successful email verification, which
  signs the user in), CUSTOMER redirects to the home page (`/`) and
  EVENT_ORGANIZER redirects to `/dashboard`; the dashboard content is
  selected from the actual role in the server session.
- Forgot/reset password flow (3 steps): (1) enter the email to request a
  6-digit OTP code; (2) on a separate verify page, enter the code only —
  `POST /auth/verify-reset-password` checks it and returns a one-time reset
  token; (3) on the
  set-password page, enter the new password only (no email or code
  fields) — it is submitted with the reset token from step 2. Email
  verification stays one step (code form only) because verifying the
  code is itself the final action. Change password; edit name + avatar
  upload (validate type/size client-side, server re-validates).
- Show the user's immutable referral code on the profile/rewards page.

### 4.3 Event management (Kelvin, organizer)

- Create/edit/publish/cancel event forms: name, dates, location, category,
  description, banner image, ticket types (name, IDR price, quota, sales window).
- Voucher form per event: code, FIXED/PERCENT, max discount, min subtotal,
  quota, validFrom/validUntil, active toggle.
- **Confirmation dialog** on publish, cancel, and any destructive action.

### 4.4 Checkout & payment proof (Kelvin, customer)

- Ticket selection → order summary. Optional: apply voucher code, coupon,
  and/or points (**stacking allowed** — all three combinable).
- Show full price breakdown: subtotal, each discount, points used, total IDR.
  Totals shown are indicative; the server recalculates.
- After paid checkout: **2-hour countdown timer** for proof upload, driven by
  `paymentExpiresAt` from the server (never a client-only timer).
- Proof upload (image, type/size validated) → status becomes
  `WAITING_FOR_ADMIN_CONFIRMATION`.
- Transaction list/detail shows server-truth status chips for all six
  statuses: waiting for payment, waiting for confirmation, done, rejected,
  expired, canceled. Client never decides state.
- Cancel-before-proof button with confirmation dialog.

### 4.5 Rewards (Andika, customer)

- Rewards page: points balance + expiring credits, coupon list (valid/used/
  expired), referral code with copy button.
- Registration referral field; success state explains the earned coupon.

### 4.6 Reviews (Kelvin, customer)

- Review form (rating 1–5 + optional text) only on events with an eligible
  completed transaction; otherwise explain why it's unavailable.
- **Decided 2026-10-15:** submitted reviews show as "pending organizer
  approval" until approved.
- Organizer profile shows average rating + review count.

### 4.7 Dashboard (shared shell, role-based content)

- `/dashboard` uses one shell (sidebar + topbar) for both roles. The
  sidebar menu is generated from the session role:
  - Customer: Dashboard (`/dashboard`), Events (`/events`), My Transactions
    (`/transactions`), Rewards (`/rewards`), Profile (`/profile`).
  - Organizer: Dashboard (`/dashboard`), My Events (`/organizer/events`),
    Transactions (`/organizer/transactions`), Profile (`/profile`).
- Customer overview (simple, no analytics): upcoming tickets, recent
  transactions, points balance, and available coupons, composed from the
  existing transaction and rewards data.
- Organizer overview: summary cards + charts (transaction count, revenue,
  tickets sold, status distribution) with day/month/year grouping, from
  `GET /organizer/dashboard/summary|timeseries`.
- Organizer transaction inbox (`/organizer/transactions`): filter by
  event/status, view payment proof image, **accept/reject with
  confirmation dialog** (reject requires a reason).
- Attendee list per event: name, ticket quantity, total paid.
- No separate `/organizer/dashboard` page is built; that path redirects to
  `/dashboard`.

## 5. Transaction statuses — what the UI shows

| Status                           | UI treatment                                                  |
| -------------------------------- | ------------------------------------------------------------- |
| `WAITING_FOR_PAYMENT`            | Countdown to `paymentExpiresAt`; upload-proof CTA; cancel CTA |
| `WAITING_FOR_ADMIN_CONFIRMATION` | "Waiting for organizer" state; show uploaded proof            |
| `DONE`                           | Success state; unlocks review CTA (after event end)           |
| `REJECTED`                       | Show rejection reason; rewards were returned                  |
| `EXPIRED`                        | Explain the 2-hour window passed                              |
| `CANCELED`                       | Explain cancellation (timeout or manual)                      |

Poll or revalidate (TanStack Query) so timers/statuses stay truthful;
a transaction detail should refresh after upload/accept/reject.

## 6. UX rules (grading-relevant)

- **Responsive:** core flows (discovery, checkout, dashboard) work at mobile,
  tablet, desktop widths.
- **Debounced search:** ~400 ms; verify one network request per pause.
- **Confirmation dialogs:** cancel event, accept/reject proof, cancel
  transaction — always confirm first.
- **States everywhere:** loading, empty, error, success — including a clear
  message for validation (400/422), unauthorized (401/403), capacity
  conflict (409), and expired upload windows.
- **Accessibility basics:** labels, visible focus, keyboard-operable dialogs,
  semantic headings, sufficient contrast.

## 7. Decisions (2026-10-15)

1. Payment: manual bank transfer + proof upload. No gateway for MVP.
2. Email: Resend (backend concern; FE only triggers flows).
3. Reviews need organizer approval (PENDING → APPROVED/REJECTED).
4. Stacking allowed: voucher + coupon + points in one checkout.
5. No design/branding guidelines for MVP — clean, responsive UI only.

**Decided 2026-10-28:** one shared `/dashboard` for both roles — the server
session selects the sidebar menu and the dashboard content. Post-login
redirects stay role-based: customers to the home page, organizers to
`/dashboard`. Role-specific work routes stay namespaced where their
meaning differs.

**Decided 2026-10-28 (OTP):** email verification and password reset use
6-digit OTP codes sent via Resend instead of token links. Codes are
single-use, expire within 10 minutes, and allow at most 5 verification
attempts. Password reset is a 3-step flow: request the code, verify it
on its own page (the server returns a one-time reset token), then set
the new password on a page with password fields only.

**Decided 2026-11-14 (client stack):** the client is plain React +
Vite (SPA with React Router), NOT Next.js. The bootcamp rules require
regular React, so the earlier Next.js App Router choice is superseded.
Nothing else changes: same routes, same session-cookie auth (restored
via `GET /auth/me`), same API contract. shadcn/ui components are plain
React + Tailwind and carry over unchanged.

## 8. MVP demo checklist (frontend)

- Protected URLs redirect when signed out; wrong-role pages blocked.
- After sign-in, organizers land on `/dashboard` and customers on the home
  page; inside the dashboard shell each role sees only its own sidebar menu
  and content; `/organizer/dashboard` redirects to `/dashboard`.
- Discovery, checkout, and dashboard at three viewport sizes.
- Network panel: search fires once per ~400 ms pause.
- Dialogs on: cancel event, accept proof, reject proof, cancel transaction.
- Controlled failure shown per core flow (validation, 403, 409, expired).
