# Atenier — Multi-Tenant Real Estate SaaS Platform

A production-ready, highly secure multi-tenant real estate property listing platform engineered with **Next.js 16+ App Router**, **TypeScript**, **MongoDB / Mongoose**, **Cloudinary**, and **Tailwind CSS**.

Every real estate agency or individual agent gets their own isolated public property listing website (`/[tenant]`) and private administrative dashboard (`/dashboard`), with platform-level administration at `/system-admin`.

---

## 🌟 Key Highlights

- **Zero-Leak Multi-Tenancy**: Strict server-side tenant isolation enforced at the database service and Server Action layers. No client-supplied tenant identifiers are trusted.
- **Dedicated Public Storefronts (`/[tenant]`)**: Real estate marketplace aesthetic with dynamic hero banners, faceted search, Schema.org `RealEstateListing` structured data, Open Graph cards, and direct WhatsApp CTAs.
- **Property Details (`/[tenant]/properties/[slug]`)**: High-res photo gallery with lightbox viewer, property specifications, amenities, agent card, and instant inquiry modal.
- **Private Agency Dashboard (`/dashboard`)**: Analytics overview, property CRUD, Cloudinary multi-image manager (upload, reorder, primary cover, delete), status controls (Draft, Publish, Sold, Rented), team & agent management, and agency branding.
- **Global Platform Console (`/system-admin`)**: Platform-wide metrics, agency suspension/activation, global user moderation, and listing moderation.
- **Enterprise Authentication**: Stateless JWT session in `httpOnly`, `Secure`, `SameSite=Lax` cookies with Bcrypt password hashing and role guards (`SYSTEM_ADMIN`, `OWNER`, `AGENT`).

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15/16+ (App Router, Server Components, Server Actions) |
| **Language** | TypeScript (Strict Mode) |
| **Database** | MongoDB with Mongoose ODM (Cached Connection Singleton) |
| **Media Storage** | Cloudinary (Signed Direct & Server-Side Uploads, Transformations) |
| **Styling** | Tailwind CSS + Accessible Custom UI Components |
| **Validation** | Zod Schemas |
| **Forms** | React Hook Form with `@hookform/resolvers/zod` |
| **Authentication** | `jose` JWT with HTTP-only Cookies & `bcryptjs` |
| **Icons** | Lucide React |

---

## 📂 Project Structure

```
real-estate-saas/
├── .env.example                 # Environment variables template
├── .env.local                   # Local development environment
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind theme & design tokens
├── next.config.ts               # Next.js image domain configurations
├── scripts/
│   └── seed.ts                  # Database seeder script
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with fonts & notifications
│   │   ├── page.tsx             # Platform home page & agency directory
│   │   ├── robots.ts            # Dynamic SEO robots.txt
│   │   ├── sitemap.ts           # Dynamic XML sitemap generator
│   │   ├── (auth)/              # Authentication route group
│   │   │   ├── login/page.tsx   # Login with 1-click test credentials
│   │   │   └── register-organization/page.tsx # Create new agency + owner
│   │   ├── (public)/
│   │   │   └── explore/page.tsx # Global cross-agency property marketplace
│   │   ├── dashboard/           # Tenant Admin Dashboard
│   │   │   ├── layout.tsx       # Tenant-isolated layout with sidebar
│   │   │   ├── page.tsx         # Overview analytics & recent listings
│   │   │   ├── properties/      # Property list, create, edit, view
│   │   │   ├── leads/page.tsx   # Buyer/renter inquiries
│   │   │   ├── team/page.tsx    # Team & staff agent management
│   │   │   ├── profile/page.tsx # Agency branding, logo, cover image
│   │   │   └── settings/page.tsx# Default currency, units, permissions
│   │   ├── system-admin/        # Platform Administrator Console
│   │   │   ├── layout.tsx       # System admin layout with safety banner
│   │   │   ├── page.tsx         # Global platform metrics
│   │   │   ├── organizations/   # Suspend, activate, delete agencies
│   │   │   ├── users/           # Global user role & status management
│   │   │   └── properties/      # Platform listing moderation
│   │   ├── [tenant]/            # Public Agency Storefront
│   │   │   ├── layout.tsx       # Branded tenant layout & Schema.org JSON-LD
│   │   │   ├── page.tsx         # Agency homepage (Hero, filters, featured)
│   │   │   ├── properties/      # Tenant catalog with faceted filters
│   │   │   │   └── [slug]/      # SEO-optimized Property Details Page
│   │   │   └── contact/         # Direct agency inquiry & contact page
│   │   └── api/
│   │       ├── auth/            # Login, register, logout, session routes
│   │       └── upload/          # Cloudinary signed & direct upload endpoints
│   ├── components/
│   │   ├── ui/                  # Accessible Button, Input, Table, Dialog, Badge, Toast
│   │   ├── shared/              # Navbar, Footer, Logo, Pagination, ImageWithFallback
│   │   ├── tenant/              # PropertyCard, Grid, Gallery, WhatsAppCTA, FilterBar
│   │   ├── dashboard/           # PropertyTable, ImageUploadManager, ConfirmDialog
│   │   └── admin/               # AdminSidebar, Moderation cards
│   ├── lib/
│   │   ├── db/
│   │   │   ├── connection.ts    # Cached Mongoose connection singleton
│   │   │   └── models/          # User, Organization, Property, Lead
│   │   ├── auth/
│   │   │   ├── session.ts       # JWT cookie signing & verification
│   │   │   ├── guards.ts        # requireAuth, requireOrganizationAccess, etc.
│   │   │   └── password.ts      # Bcrypt hash/compare
│   │   ├── cloudinary/          # Upload, delete, and URL transformation helpers
│   │   ├── validations/         # Zod schemas (auth, property, org, team)
│   │   ├── services/            # Isolated business logic services
│   │   ├── actions/             # Next.js Server Actions
│   │   └── types/               # TypeScript interfaces
```

---

## 🔒 Multi-Tenancy & Security Model

### 1. Tenant Isolation Architecture
- Every tenant database entity (`Property`, `Lead`, `User`) stores an `organizationId`.
- Compound unique index `{ organizationId: 1, slug: 1 }` guarantees property slugs are unique within an agency while allowing different agencies to use intuitive slugs (e.g. both Agency A and Agency B can have `/luxury-apartment`).
- Server actions and service functions strictly resolve identity from the verified session cookie using `requireOrganizationAccess()`:
  ```ts
  // Example tenant-guarded mutation
  const session = await requireOrganizationAccess();
  // Queries automatically inject { organizationId: session.organizationId, ... }
  ```
- Clients cannot spoof an `organizationId`, preventing Insecure Direct Object References (IDOR).

### 2. User Roles & Hierarchy
1. **`SYSTEM_ADMIN`**: Platform-wide administrator. Can suspend/activate agencies, disable bad actors, and moderate all platform listings via `/system-admin`.
2. **`OWNER`**: Agency principal / administrator. Full access to manage agency properties, billing/settings, upload logos, and invite staff agents.
3. **`AGENT`**: Licensed real estate staff. Can create, edit, and manage property listings under their assigned agency.

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node.js v20/v24)
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster connection string
- **Cloudinary**: Free Cloudinary account (optional for local dev; built-in placeholder fallback enabled)

### 2. Environment Variables Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/real_estate_saas

# Auth JWT Secret (Minimum 32 characters)
AUTH_SECRET=super_secure_antigravity_jwt_secret_key_minimum_32_characters_long_12345

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Base App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed Database
Run the seed script to populate demo agencies, owners, staff agents, and properties:
```bash
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Test Accounts

The seed script creates the following pre-configured test accounts (with 1-click fill buttons available on `/login`):

| Role | Email | Password | Access Area |
|---|---|---|---|
| **System Admin** | `admin@estatesphere.io` | `admin123` | `/system-admin` |
| **Rahman Properties Owner** | `rahman@rahmanproperties.com` | `password123` | `/dashboard` & `/rahman-properties` |
| **Rahman Properties Agent** | `agent@rahmanproperties.com` | `password123` | `/dashboard` |
| **Apex Realty Owner** | `apex@apexrealty.com` | `password123` | `/dashboard` & `/apex-realty` |

---

## 🌐 Public URL Routing Model

- **Platform Portal / Agency Directory**: `/`
- **Global Marketplace Explore**: `/explore`
- **Agency Public Storefront**: `/[tenant]` (e.g. `/rahman-properties`, `/apex-realty`)
- **Agency Property Details**: `/[tenant]/properties/[slug]` (e.g. `/rahman-properties/properties/modern-luxury-apartment-in-gulshan`)
- **Agency Direct Contact**: `/[tenant]/contact`
- **Agency Private Dashboard**: `/dashboard`
- **System Admin Console**: `/system-admin`

---

## 🚀 Deployment Instructions

### Vercel / Cloudflare / Node Server
1. Connect your Git repository to Vercel or your hosting platform.
2. Set Environment Variables (`MONGODB_URI`, `AUTH_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_APP_URL`).
3. Build command: `npm run build`
4. Output directory: `.next`

---

## 📄 License
MIT License. Built for commercial multi-tenant SaaS deployment.
