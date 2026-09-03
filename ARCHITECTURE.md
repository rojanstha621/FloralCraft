# Architecture

Petal Craft Florals is a content-led storefront with a lightweight request-management back office. It deliberately avoids checkout/payment complexity while retaining the information the studio needs to fulfill custom work.

```text
Next.js App Router
├─ Customer site
│  ├─ Products, categories, reviews
│  ├─ Ordering and customization requests
│  ├─ WhatsApp, contact, and Instagram
│  └─ Lightweight, lazy homepage WebGL enhancement
├─ Protected admin panel
│  ├─ Products, categories, and customization
│  ├─ Review moderation and order workflow
│  └─ Business settings
├─ Prisma → PostgreSQL
└─ Cloud media storage (Supabase Storage-compatible)
```

## Data

The maintained Prisma surface includes:

- `AdminUser`
- `Category`
- `ProductType`
- `Product`
- `ProductImage`
- `CustomizationOption`
- `Review`
- `OrderRequest` and `OrderRequestItem`
- `BusinessSettings`

Catalog APIs are read-only. Review and order-request creation are the only public database writes. New reviews are pending by default and never appear publicly until moderated. Order items retain product-name and price snapshots so historical requests survive future catalog changes.

## Security and media

Admin sessions are signed, HTTP-only cookies and every admin mutation rechecks the active admin account. Cloud storage service credentials are server-only. The database stores public URLs plus provider/storage keys, allowing media to move between providers without changing the product model.

## Configuration

Business contact and social values live in `lib/config/business.ts`. The WhatsApp number can be overridden with `NEXT_PUBLIC_WHATSAPP_NUMBER` and must not be repeated in components.

Manual social content lives in `lib/data/social.ts`. It is explicitly not a scraped or simulated live Instagram feed, and its typed shape can later be populated through an official API.

## Three.js

Three.js is limited to the homepage hero. It is dynamically loaded, detects WebGL, respects reduced motion, uses bounded pixel density, and has a static fallback.
