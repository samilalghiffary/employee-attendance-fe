# Employee Attendance Web Client (Frontend)

Modern, enterprise-grade web application for the **Employee Attendance Management System**, built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TanStack Query / Table**.

The client features intuitive interfaces for employee geolocation check-in/out, personal attendance logs & summaries, interactive maps, and complete administrative reporting & system configuration.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library:** [React 19](https://react.dev/)
- **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **State & Server Cache:** [TanStack React Query v5](https://tanstack.com/query/latest) & [Zustand v5](https://zustand-demo.pmnd.rs/)
- **Data Table:** [TanStack React Table v8](https://tanstack.com/table/latest) (Server-side Pagination, Multi-column Sorting)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Date Utilities:** [date-fns](https://date-fns.org/) & [react-day-picker](https://daypicker.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **HTTP Client:** [Axios](https://axios-http.com/) (with JWT interceptors)

---

## 📌 Key Features

### 👤 Employee Experience
- **📍 Geolocation-Verified Check-In & Check-Out:**
  - One-tap browser GPS coordinate capture (`latitude`, `longitude`).
  - Real-time work status indicators (Present, Late, Checked Out).
- **🗺️ Interactive Map Modal:**
  - OpenStreetMap & Leaflet integration to inspect check-in and check-out pin locations directly from history tables.
- **📊 Personal Attendance Analytics:**
  - Key performance cards: Present Days, Late Arrivals (with cumulative late minutes), and Early Departures (with cumulative early departure minutes).
  - Quick date range filters (Today, This Week, This Month, Custom Date Range).
- **📑 Personal Attendance History:**
  - Paginated attendance records with server-side multi-field sorting (`date`, `checkIn`, `checkOut`, `lateMinutes`, `earlyLeaveMinutes`).
  - Attendance notes modal for viewing and adding remarks.

### 🛡️ Admin Experience
- **📈 Company-Wide Attendance Dashboard:**
  - Real-time metrics overview with responsive summary cards.
  - Granular filtering by **Employee (User Dropdown)**, **Date Range**, and **Status**.
  - Server-side sorting across all columns.
- **👥 Employee Lifecycle Management:**
  - Employee list with role badges (`ADMIN` / `EMPLOYEE`) and active/inactive account toggles.
- **⚙️ Dynamic Schedule Configuration:**
  - Form controls to modify work schedule policies in real time: Work Start Time, Work End Time, and Late Tolerance Window.

---

## 📁 Directory Structure

```text
frontend/
├── src/
│   ├── app/                # Next.js App Router (pages & layouts)
│   │   ├── (admin)/        # Admin protected routes (dashboard, employees, settings)
│   │   ├── (auth)/         # Public auth routes (login, register)
│   │   ├── (employee)/     # Employee dashboard & attendance history
│   │   ├── layout.tsx      # Root layout with QueryClient & Theme providers
│   │   └── page.tsx        # Landing / auth redirect
│   ├── components/         # Reusable UI & domain components
│   │   ├── attendance/     # Check-in card, map dialog, notes modal, summary cards
│   │   ├── common/         # Data table, date range picker, filters, pagination
│   │   ├── layout/         # App header, sidebar navigation, user dropdown
│   │   └── ui/             # Primitive UI components (button, card, dialog, input, etc.)
│   ├── hooks/              # Custom React hooks (geolocation, debounce, filters)
│   ├── lib/                # API client (Axios), date formatters, and utility functions
│   ├── services/           # TanStack Query hooks & API mutation services
│   └── types/              # TypeScript models, DTOs, and API response definitions
├── public/                 # Static assets & icons
├── .env.example            # Environment variables template
├── package.json
└── tsconfig.json
```

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- **Backend API Server** running on `http://localhost:3001` (or your custom URL)

### 2. Clone Repository
```bash
git clone https://github.com/samilalghiffary/employee-attendance-fe.git
cd employee-attendance-fe
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables (`.env.local`)
Create `.env.local` using the template:
```bash
cp .env.example .env.local
```

Set the backend API base URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 5. Run the Application

```bash
# Development mode (Turbopack)
npm run dev

# Production build & run
npm run build
npm run start
```

The application will be accessible at: **`http://localhost:3000`**

---

## 🧪 Scripts & Quality Checks

```bash
# Run ESLint validation
npm run lint

# Auto-fix ESLint errors
npm run lint:fix

# Check formatting with Prettier
npm run format:check

# Format files with Prettier
npm run format
```

---

## 📄 License

UNLICENSED - Internal Project.
