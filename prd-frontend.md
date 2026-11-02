# EventMgmt — Frontend PRD

_Client-side contract for `mini-project-client`. Split from the full PRD
("EventMgmt — PRD (Improved)" in Google Docs), which remains the complete
reference ("kitab"). This file contains only what the frontend needs.
Move this file into the client repo root `docs/` when it is created._

## 1. Product & team

EventMgmt is a two-sided event platform: attendees discover events, buy
tickets, upload payment proof, use referral rewards, and review attended
events. Organizers create/promote events, review transactions, and monitor
performance from a shared, role-based dashboard.

| Owner              | Frontend scope                                                          |
| ------------------ | ----------------------------------------------------------------------- |
| Kelvin (Feature 1) | Discovery & search, event CRUD UI, checkout & proof upload, review UI   |
| Andika (Feature 2) | Auth pages, profile, referral UI, role-based dashboard content & charts |
| Shared             | API contract, route guards, shared dashboard shell, design consistency  |

## 2. Client stack

| Layer     | Technology                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------- |
| App       | Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + shadcn/ui (TypeScript)                                        |
| Toolchain | VitePlus + Bun (package manager)                                                                                    |
| Routing   | Next.js App Router — public routes + one authenticated dashboard shell, role-based menus and role-protected layouts |
| Data      | TanStack Query + Axios (server-state cache, mutations)                                                              |
| Forms     | React Hook Form + Zod                                                                                               |
| Hosting   | Vercel (decide with team)                                                                                           |

Env (client): `BASE_URL` (or `NEXT_PUBLIC_API_BASE_URL`). `.env.local` at repo root; commit `.env.example`.

**Decided 2026-10-15:** no branding/design guidelines for MVP — clean,
responsive UI only.

## 3. Routes & access

Public: landing (`/`), event list + detail (`/events`, `/events/[id]`),
signin/signup, forgot/reset password.

Protected (role guards + redirect):

- Shared (any signed-in role): `/dashboard`, `/profile`.
- Customer: `/checkout`, `/transactions`, `/transactions/[id]`,
  `/rewards`.
- Organizer: `/organizer/events`, `/organizer/events/[id]/edit`,
  `/organizer/transactions`.

Dashboard routing rules:

- `/dashboard` is the organizer's post-login landing page; customers are
  redirected to the home page (`/`) after sign-in. The page itself serves
  both roles: the server session selects the customer or organizer
  dashboard content, and the role must never be taken from a query
  parameter or client-only state.
- `/organizer` and `/organizer/dashboard` are not separate pages: both
  redirect to `/dashboard`.
- Authenticated customer and organizer pages share one dashboard shell
  (sidebar + topbar). Sidebar menu items are generated from the session
  role.
- Wrong-role access to a role-specific route is blocked and redirected to
  `/dashboard`.

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
  field), sign in/out, session restore.
- After successful sign-in, CUSTOMER redirects to the home page (`/`) and
  EVENT_ORGANIZER redirects to `/dashboard`; the dashboard content is
  selected from the actual role in the server session.
- Forgot/reset password flow; change password; edit name + avatar upload
  (validate type/size client-side, server re-validates).
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
2. Email: Nodemailer + Gmail SMTP (backend concern; FE only triggers flows).
3. Reviews need organizer approval (PENDING → APPROVED/REJECTED).
4. Stacking allowed: voucher + coupon + points in one checkout.
5. No design/branding guidelines for MVP — clean, responsive UI only.

**Decided 2026-10-28:** one shared `/dashboard` for both roles — the server
session selects the sidebar menu and the dashboard content. Post-login
redirects stay role-based: customers to the home page, organizers to
`/dashboard`. Role-specific work routes stay namespaced where their
meaning differs.

## 8. MVP demo checklist (frontend)

- Protected URLs redirect when signed out; wrong-role pages blocked.
- After sign-in, organizers land on `/dashboard` and customers on the home
  page; inside the dashboard shell each role sees only its own sidebar menu
  and content; `/organizer/dashboard` redirects to `/dashboard`.
- Discovery, checkout, and dashboard at three viewport sizes.
- Network panel: search fires once per ~400 ms pause.
- Dialogs on: cancel event, accept proof, reject proof, cancel transaction.
- Controlled failure shown per core flow (validation, 403, 409, expired).
