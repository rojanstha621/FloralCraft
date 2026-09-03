# Development

## Commands

```bash
npm run dev
npm run build
npm run format:check
npm run db:generate
npm run db:push
npm run db:seed
```

## Conventions

- Keep TypeScript strict and avoid `any`.
- Use existing brand tokens instead of arbitrary colors, except official third-party brand colors where needed.
- Preserve semantic markup, visible focus styles, descriptive image text, and 44px mobile tap targets.
- Validate every public write on the server.
- Never expose unapproved reviews from public routes.
- Keep social content manual or use official platform APIs; do not scrape.
- Keep WebGL optional and confined to genuinely useful visual enhancement.

## Before release

- Confirm the WhatsApp number and social profile URLs.
- Replace sample catalog/social photography with approved brand assets.
- Moderate any pending reviews.
- Run a production build and test 360, 390, 430, 768, 1024, and 1440px widths.
