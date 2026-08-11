# Dynamic QR Code Generator

A production-ready Dynamic QR Code Generator built with **Next.js 16 (App Router)** and **Prisma ORM (v7) with PostgreSQL**.

This system allows you to generate dynamic QR codes that don't hardcode their final destination. Instead, they point to a local proxy URL (`/q/[slug]`), which logs the scan data (device, timestamp, etc.) and instantly redirects the user to the destination. 

This architectural approach allows you to:
- Change the destination URL at any time without reprinting the physical QR code.
- Track analytics on how many times a code was scanned and what device types are scanning it.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase PostgreSQL
- **ORM:** Prisma v7 (with `@prisma/adapter-pg` driver adapters)
- **Styling:** Vanilla CSS & CSS Modules (No Tailwind)
- **QR Generation:** `qrcode` & `nanoid`

## Setup & Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` (or set these in Vercel):
```env
# Connection pooler URL (e.g. port 6543 on Supavisor)
DATABASE_URL="postgresql://user:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct URL for migrations (e.g. port 5432)
DIRECT_URL="postgresql://user:password@db.supabase.co:5432/postgres"

# Admin Dashboard Password
ADMIN_PASSWORD="supersecretpassword"
```

### 3. Run Migrations
Generate the Prisma Client and push the schema to your database:
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to access the dashboard!

## Features
- **Admin Dashboard:** Secure dashboard guarded by Next.js Server Actions and HttpOnly cookies.
- **Dynamic Links:** 6-character slug generation.
- **Analytics:** Time-series charts and device breakdowns for scans.
- **Downloadable:** Export high-error-correction PNG QR codes directly from the dashboard.
