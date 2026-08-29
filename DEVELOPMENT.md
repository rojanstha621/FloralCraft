# Development & Contribution Guide

## 1. Local Environment Setup

### Environment Variables
Duplicate `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key environment configurations:
- `DATABASE_URL`: Connection string to PostgreSQL instance.
- `PAYMENT_MOCK_MODE`: Set to `true` for local development. This enables instant sandbox testing without external API credentials.
- `STORAGE_PROVIDER`: Set to `local` to save user uploads into `public/uploads`.

---

## 2. Common Scripts

```bash
# Start local development server on port 3000
npm run dev

# Run TypeScript type-checker and production build
npm run build

# Run ESLint validation
npm run lint

# Format codebase with Prettier
npm run format

# Verify formatting without modifying
npm run format:check

# Generate Prisma client bindings
npm run db:generate

# Push schema changes directly to development database
npm run db:push
```

---

## 3. Coding Guidelines & Quality Standards

1. **TypeScript Strict Mode**: Avoid using `any`. Define strong interfaces in `@/types` or adjacent module files.
2. **Design Tokens**: Do not use arbitrary hardcoded hex codes. Utilize Tailwind brand tokens (`bg-brand-pink`, `text-brand-brown`, `bg-brand-cream`, etc.).
3. **Accessibility**:
   - Ensure all interactive elements have visible focus outlines.
   - All images must include descriptive `alt` text.
   - Use semantic HTML tags (`<nav>`, `<header>`, `<main>`, `<footer>`, `<section>`).
4. **Validation**: All user inputs (forms, API request bodies) must be validated with Zod schemas both on the client and server.
