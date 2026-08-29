# Architecture & Technical Design Document

## 1. Executive Summary

**Petal Craft Florals** is a bespoke e-commerce platform built for a handmade floral gifting brand headquartered in Kathmandu, Nepal. The platform couples an emotional, high-aesthetic storefront with mobile-first usability and selective 3D interactive experiences.

---

## 2. Core Architectural Pillars

```
+-----------------------------------------------------------------------+
|                             Next.js 15 App Router                     |
+-----------------------------------------------------------------------+
|  Storefront Routes (/)  |  Customizer (/customize)  |  Admin (/admin) |
+-----------------------------------------------------------------------+
|       React Three Fiber / 3D Canvas Layer with Static Fallback        |
+-----------------------------------------------------------------------+
|     Design System (Tailwind Tokens: Cream, Brown, Pink, Sage, Beige)   |
+-----------------------------------------------------------------------+
|   Payment Abstraction   |    Storage Abstraction   | Analytics Tracker|
|  (eSewa/Khalti/COD)     |   (Local/Cloudinary/S3)  | (GA4/Pixel/Logs) |
+-----------------------------------------------------------------------+
|                 Prisma ORM & PostgreSQL Database Layer                |
+-----------------------------------------------------------------------+
```

### Key Highlights:
1. **Separation of Concerns**: Core domain logic (payments, storage, analytics) is encapsulated behind clean interfaces (`lib/payments`, `lib/storage`, `lib/analytics`) rather than hardcoded.
2. **Mobile-First Luxury Experience**: Viewport breakpoints and touch targets are specifically tuned for 360px–430px mobile viewports common on social referral platforms.
3. **Resilient 3D Pipeline**: Three.js canvases are lazy-loaded with explicit WebGL feature detection and static high-fidelity fallbacks. If WebGL fails, the UI falls back seamlessly to static photography.
4. **Localization**: Built-in support for Nepalese Rupee (`Rs.`), Kathmandu Valley delivery logistics, and domestic payment providers.

---

## 3. Database Schema Overview (Prisma)

The database models 17 core entities:
- **`AdminUser`**: Role-based access for dashboard managers.
- **`User` & `Address`**: Customer profiles and multi-address management with Kathmandu defaults.
- **`Product` & `ProductCategory`**: Product catalog with dynamic categorization (Forever Bloom, Our Story, Dear Mom, With Gratitude, Memory Lane, Made For You).
- **`ProductImage`**: Multi-image asset management.
- **`CustomizationOption`**: Modular schema for customizable attributes (frames, flower styles, backgrounds, photo uploads, text messages).
- **`Cart` & `CartItem`**: Persistent customer carts with serialization of customizer choices.
- **`Order`, `OrderItem`, `OrderCustomization`**: Immutable order records preserving customer customizations and photo uploads.
- **`Payment`**: Multi-provider payment logs tracking transaction references and status.
- **`OrderStatusHistory`**: Complete audit trail for order state transitions (Pending -> Paid -> In Production -> Ready -> Out For Delivery -> Delivered).
- **`Review`**: Customer ratings with administrative moderation before publication.
- **`Coupon` & `Delivery`**: Flexible promotions and district/area-based delivery fee calculations.

---

## 4. 3D & Performance Strategy

1. **R3F Code Splitting**: All Three.js and `@react-three/fiber` scenes are loaded via Next.js `dynamic()` imports with `ssr: false`.
2. **Reduced Motion**: All animations and floating camera parallax listen to `prefers-reduced-motion: reduce`.
3. **Image Optimization**: WebP and AVIF formats with responsive srcset generation via Next.js Image optimization pipeline.
4. **Asset Compression**: Textures and 3D geometries are compressed and loaded on-demand.
