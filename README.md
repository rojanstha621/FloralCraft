# Petal Craft Florals 🌸

> *"More than just flowers... it's a feeling."*  
> Handcrafted personalized floral gifts and keepsakes made in **Kathmandu, Nepal**.

---

## 🌸 About The Project

**Petal Craft Florals** is a boutique handmade gifting platform specializing in custom floral frames, preserved memory keepsakes, and personalized botanical art. Designed with a mobile-first philosophy for users arriving from Instagram and TikTok, the application incorporates editorial luxury aesthetics, warm tones, and strategic 3D interactive product experiences powered by Three.js and React Three Fiber.

---

## 🎨 Brand Identity & Design System

- **Dusty Pink**: `#E8B8B8` (Primary feminine floral accent)
- **Sage Green**: `#A7B89F` (Botanical tranquility & nature)
- **Cream**: `#F9F6EF` (Warm paper & tactile canvas background)
- **Warm Brown**: `#7A5B4F` (Sophisticated editorial typography & borders)
- **Beige**: `#D7C9B8` (Neutral balance & card frames)

### Typography
- **Headings**: Editorial serif (`Cormorant Garamond` / `Playfair Display`)
- **Body**: Clean, high-legibility sans-serif (`Plus Jakarta Sans` / `Inter`)

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens
- **3D Engine**: [Three.js](https://threejs.org/) & [React Three Fiber](https://r3f.docs.pmnd.rs/) with [Drei](https://github.com/pmndrs/drei)
- **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Payments**: Nepal Payment Abstraction (eSewa, Khalti, Fonepay, Cash on Delivery)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js >= 18.18.0 (Recommended: Node.js 20+)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd PetalCraftFloralGemini

# Install dependencies
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to local database
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📂 Project Architecture

```
├── app/                  # Next.js App Router pages & layouts
│   ├── (store)/          # Customer-facing storefront
│   ├── admin/            # Admin management dashboard
│   ├── api/              # Secure API route handlers
│   ├── globals.css       # Design tokens & base theme rules
│   ├── layout.tsx        # Root layout with fonts & SEO
│   ├── page.tsx          # Homepage
│   ├── not-found.tsx     # 404 handler
│   └── error.tsx         # Global error boundary
├── components/           # Reusable UI component library
│   ├── ui/               # Design primitives (Button, Card, Input, Logo, etc.)
│   ├── layout/           # Navbar, Footer, Drawers
│   ├── three/            # 3D Canvases, Floating Petals, Fallback scenes
│   ├── products/         # Catalog cards, filters, gallery
│   └── customizer/       # Interactive floral customizer
├── lib/                  # Core abstractions & business logic
│   ├── db/               # Prisma singleton instance
│   ├── payments/         # Nepal payment gateway registry
│   ├── storage/          # Storage abstraction (Local, Cloudinary, S3)
│   ├── analytics/        # Event tracking abstraction
│   ├── validation/       # Zod schemas & env validator
│   └── utils/            # Formatters (NPR currency, dates, slugs)
├── prisma/               # Database schema & seed scripts
├── types/                # Shared TypeScript declarations
└── public/               # Static assets & textures
```

---

## 🇳🇵 Nepal Localization & Payments

- **Currency Display**: `Rs. 1,999` format throughout all pricing cards.
- **Payment Providers**: Unified gateway abstraction supporting:
  - **eSewa** (ePay v2)
  - **Khalti** (ePayment v2)
  - **Fonepay**
  - **Cash on Delivery (COD)** in Kathmandu Valley
- **Sandbox Mode**: Pre-configured mock payment flows for seamless local development without live credentials.

---

## 📜 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Comprehensive technical architecture & design decisions.
- [DEVELOPMENT.md](./DEVELOPMENT.md) — Developer workflow, coding standards, and testing procedures.

---

## 📄 License
Private & Proprietary — Petal Craft Florals, Kathmandu, Nepal.
