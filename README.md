# Petal Craft Florals

Turning feelings into handmade keepsakes.

A mobile-first storefront and administration system for Petal Craft Florals in Kathmandu, Nepal. Visitors browse collections, view product photos and approved reviews, then order through a structured request or WhatsApp.

## Stack

- Next.js 15 App Router and React 19
- TypeScript and Tailwind CSS
- PostgreSQL with Prisma
- Protected owner/admin workspace
- Supabase Storage-compatible cloud media uploads
- Three.js / React Three Fiber for the homepage hero only
- Zod for review validation

## Local setup

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` once in `.env`. Use digits only, including the country code.

## Customer journey

`Home → Collections → Product → Order request / WhatsApp → Admin follow-up`

Order requests store a product/price snapshot, quantity, customer details, desired date, notes, and product customization choices. No payment gateway or customer account is required; the studio confirms each request personally.

## Reviews

Review submissions are validated on the server and saved as `PENDING`. Only approved reviews are returned by public APIs. Administrators moderate them in `/admin/reviews`.

## Main paths

- `/` homepage
- `/collections` catalog
- `/products/[slug]` product details
- `/order` product and customization request
- `/reviews`, `/about`, `/faq`, `/contact`
- `/admin` protected operations workspace
- `/api/products`, `/api/categories`, `/api/reviews`, `/api/orders`

## Admin modules

- Overview and operational counts
- Products and cloud media
- Categories
- Product customization fields
- Review moderation
- Order request statuses and notes
- Business settings

Set `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_INITIAL_PASSWORD`, then run `npm run db:seed` to ensure the first owner account exists. Configure the Supabase variables in `.env` to upload product images; external image URLs remain available for development.
