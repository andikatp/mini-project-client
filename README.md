# Mini Project Client

Frontend client application untuk platform manajemen & pemesanan tiket acara (**Ramein**) yang dibangun menggunakan **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, dan dijalankan dengan **Bun** serta didukung oleh **Vite+ (`vp`)**.

Template dashboard terintegrasi menggunakan komponen desain dari [**Shadcn Dashboard**](https://shadcndashboard.dev) (Base UI + Tailwind CSS v4 + Recharts).

---

## Template & UI Kit Info

Proyek ini mengadopsi struktur UI dan layout dashboard dari open-source template:

- **Nama Template**: [Shadcn Dashboard (Next.js)](https://shadcndashboard.dev)
- **Repository GitHub**: [https://github.com/shadcndashboard/next-shadcn-dashboard](https://github.com/shadcndashboard/next-shadcn-dashboard)
- **Live Demo Template**: [https://shadcndashboard-demo.vercel.app](https://shadcndashboard-demo.vercel.app)
- **Dokumentasi UI**: [https://shadcndashboard.dev/docs](https://shadcndashboard.dev/docs)
- **Komponen Utama yang Diadaptasi**:
  - **Shared Dashboard Shell**: Sidebar collapsible responsif & Topbar navigasi di `app/(dashboard)/layout.tsx`
  - **Organizer Analytics**: Komponen grafik berbasis **Recharts** (`TotalSales`, `TotalsAssets`) di `features/dashboard/components/`
  - **Form & Profile Elements**: Layout form responsif dan hero header profil di `features/profile/components/`
  - **UI Primitives**: Komponen dasar berbasis `shadcn/ui` + `@base-ui/react` di `components/ui/`

---

## Prasyarat (Prerequisites)

Pastikan kamu sudah menginstall [Bun](https://bun.sh/) di komputermu:

```bash
# Cek apakah bun sudah terinstall
bun -v

# Jika belum ada, install Bun (macOS/Linux):
curl -fsSL https://bun.sh/install | bash
```

> **Catatan (Windows)**: Kamu bisa menginstall Bun lewat PowerShell:
>
> ```powershell
> powershell -c "irm bun.sh/install.ps1 | iex"
> ```

---

## Panduan Setup & Instalasi

Ikuti langkah-langkah berikut setelah melakukan `git clone`:

### 1. Masuk ke Direktori Proyek

```bash
cd mini-project-client
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Jalankan Development Server

```bash
bun dev
```

Aplikasi frontend akan aktif di: **`http://localhost:3000`**

---

## Menambahkan Komponen UI (shadcn/ui)

Proyek ini telah dikonfigurasi dengan **shadcn/ui** (Base UI + Tailwind CSS v4). Untuk menambahkan komponen UI baru, gunakan perintah:

```bash
bun x --bun shadcn@latest add <nama-komponen>
```

_Contoh:_

```bash
bun x --bun shadcn@latest add dialog
bun x --bun shadcn@latest add input
bun x --bun shadcn@latest add select
```

Komponen akan otomatis ditambahkan ke direktori `@/components/ui/`.

---

## Daftar Perintah Berguna (Cheatsheet)

| Perintah         | Deskripsi                                                                         |
| :--------------- | :-------------------------------------------------------------------------------- |
| `bun dev`        | Menjalankan Next.js development server dengan Hot Reload (port `3000`)            |
| `bun run build`  | Melakukan build bundle aplikasi untuk tahap produksi                              |
| `bun run start`  | Menjalankan server aplikasi Next.js hasil build production                        |
| `bun test`       | Menjalankan unit test dengan Bun Test runner                                      |
| `vp check`       | Menjalankan validasi menyeluruh: format check (Oxfmt), lint (Oxlint), & typecheck |
| `vp check --fix` | Memperbaiki formatting kode dan lint error yang dapat diperbaiki otomatis         |

---

## Struktur Direktori

Proyek ini menggunakan **Feature-Driven Architecture (Bulletproof React Pattern)** untuk memudahkan kolaborasi tim dan pemisahan fitur yang rapi:

```text
├── app/                        # Next.js App Router (Routing & Layouts)
│   ├── (auth)/                 # Route otentikasi (/login, /register, /change-password, dll)
│   ├── (public)/               # Route publik (/events, /events/[id], dll)
│   ├── (dashboard)/            # Shared Dashboard Shell (Organizer & Customer)
│   │   ├── dashboard/          # Halaman utama /dashboard (Role-based metrics & analytics)
│   │   ├── profile/            # Halaman user profile & referral settings (/profile)
│   │   └── layout.tsx          # Shared layout shell (Sidebar + Header + Breadcrumb)
│   ├── organizer/dashboard/    # Redirect otomatis ke /dashboard (sesuai spesifikasi PRD)
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # Landing Page
├── features/                   # Modul bisnis independen (Feature Modules)
│   ├── auth/                   # Modul autentikasi, store session, form login & register
│   ├── profile/                # Modul profil, avatar upload, & referral copy
│   ├── dashboard/              # Modul visualisasi data (Recharts timeseries & status distribution)
│   ├── events/                 # Modul discovery, katalog event, & manajemen event
│   ├── checkout/               # Modul pemesanan tiket, voucher, kupon, & poin
│   ├── transactions/           # Modul countdown pembayaran, upload bukti, & verifikasi
│   ├── rewards/                # Modul kode referral, saldo poin, & kupon
│   └── reviews/                # Modul ulasan rating bintang & moderasi
│       # Setiap folder feature memiliki struktur modular:
│       ├── api/                # Endpoint Axios & custom TanStack Query hooks
│       ├── components/         # Komponen UI spesifik untuk fitur tersebut
│       ├── hooks/              # State & logika UI lokal fitur
│       └── types/              # Interface TypeScript & skema validasi Zod
├── components/                 # Komponen UI global & dapat dipakai ulang
│   ├── ui/                     # Primitif shadcn/ui (Button, Dialog, Sheet, Chart, dll)
│   └── common/                 # Komponen umum bersama (DashboardCard, ConfirmDialog, dll)
├── hooks/                      # Custom hooks umum (use-mobile, useDebounce, dll)
├── lib/                        # Konfigurasi library pihak ketiga (axios.ts, utils.ts)
├── types/                      # Global type definitions (ApiResponse<T>, Pagination, dll)
├── constants/                  # Konstanta aplikasi (route paths, query keys, storage keys)
├── public/                     # Aset publik statis (gambar, icon, svg)
├── .env.example                # Template environment variables
├── package.json
└── tsconfig.json
```

---

## Alur Kerja Kolaborasi (Workflow)

1. Sebelum mulai mengerjakan fitur baru, pastikan branch lokalmu up-to-date:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Buat branch baru sesuai fitur:
   ```bash
   git checkout -b feature/nama-fitur
   ```
3. Sebelum melakukan `git push`, pastikan kode bebas error dengan:
   ```bash
   vp check --fix
   bun test
   ```
4. Push branch dan buat Pull Request:
   ```bash
   git push origin feature/nama-fitur
   ```
