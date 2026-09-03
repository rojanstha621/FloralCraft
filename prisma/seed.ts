import { AdminRole, PrismaClient, ReviewStatus } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Celebrations",
    slug: "celebrations",
    description: "Handmade floral gifts for birthdays, milestones, and joyful moments.",
  },
  {
    name: "Love & Appreciation",
    slug: "love-and-appreciation",
    description: "Thoughtful arrangements for love, gratitude, and meaningful gestures.",
  },
  {
    name: "Home & Keepsakes",
    slug: "home-and-keepsakes",
    description: "Floral pieces created to decorate a space or preserve a memory.",
  },
] as const;

const productTypes = [
  "Bouquet",
  "Pot",
  "Bottle",
  "Frame",
  "Basket",
  "Box",
  "Vase",
  "Wall Art",
  "Gift Arrangement",
  "Custom",
].map((name, sortOrder) => ({
  name,
  slug: name.toLowerCase().replace(/ & /g, "-and-").replace(/\s+/g, "-"),
  sortOrder,
}));

const products = [
  {
    name: "Garden Blush Bouquet",
    slug: "garden-blush-bouquet",
    tagline: "Soft color, gathered by hand",
    description:
      "A warm floral bouquet arranged by hand for celebrations, thank-yous, and thoughtful everyday gifting.",
    price: "2200.00",
    compareAtPrice: null,
    available: true,
    featured: true,
    customizable: true,
    customizationSummary: "Color palette, wrapping, ribbon, and message card can be discussed.",
    preparationDays: 2,
    categorySlug: "celebrations",
    typeSlug: "bouquet",
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Pressed Petal Memory Frame",
    slug: "pressed-petal-memory-frame",
    tagline: "A moment preserved in flowers",
    description:
      "A handmade floral frame designed around a photograph, note, date, or other meaningful detail.",
    price: "3200.00",
    compareAtPrice: "3600.00",
    available: true,
    featured: true,
    customizable: true,
    customizationSummary:
      "Frame finish, flower palette, text, and photograph placement can be tailored.",
    preparationDays: 5,
    categorySlug: "home-and-keepsakes",
    typeSlug: "frame",
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Petal-Kissed Gift Box",
    slug: "petal-kissed-gift-box",
    tagline: "A complete gesture, beautifully arranged",
    description:
      "A coordinated gift box finished with florals and careful handmade details for someone special.",
    price: "2800.00",
    compareAtPrice: null,
    available: true,
    featured: true,
    customizable: false,
    customizationSummary: null,
    preparationDays: 3,
    categorySlug: "love-and-appreciation",
    typeSlug: "box",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85",
  },
] as const;

async function main() {
  console.log("Seeding the isolated Petal Craft development database...");

  for (const [sortOrder, category] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { ...category, active: true, sortOrder },
      create: { ...category, active: true, sortOrder },
    });
  }

  for (const type of productTypes) {
    await prisma.productType.upsert({
      where: { slug: type.slug },
      update: { ...type, active: true },
      create: { ...type, active: true },
    });
  }

  for (const item of products) {
    const [category, productType] = await Promise.all([
      prisma.category.findUniqueOrThrow({ where: { slug: item.categorySlug } }),
      prisma.productType.findUniqueOrThrow({ where: { slug: item.typeSlug } }),
    ]);

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        tagline: item.tagline,
        description: item.description,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        available: item.available,
        featured: item.featured,
        customizable: item.customizable,
        customizationSummary: item.customizationSummary,
        preparationDays: item.preparationDays,
        archivedAt: null,
        categoryId: category.id,
        productTypeId: productType.id,
      },
      create: {
        name: item.name,
        slug: item.slug,
        tagline: item.tagline,
        description: item.description,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        available: item.available,
        featured: item.featured,
        customizable: item.customizable,
        customizationSummary: item.customizationSummary,
        preparationDays: item.preparationDays,
        categoryId: category.id,
        productTypeId: productType.id,
      },
    });

    await prisma.productImage.upsert({
      where: { id: `seed-image-${item.slug}` },
      update: {
        url: item.image,
        alt: item.name,
        sortOrder: 0,
        primary: true,
      },
      create: {
        id: `seed-image-${item.slug}`,
        productId: product.id,
        url: item.image,
        provider: "external-demo",
        alt: item.name,
        sortOrder: 0,
        primary: true,
      },
    });
  }

  await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      businessName: "Petal Craft Florals",
      tagline: "More than just flowers... it's a feeling.",
      currencyCode: "NPR",
      currencySymbol: "Rs. ",
      orderingMethods: {
        website: { enabled: true, label: "Send an order request" },
        whatsapp: { enabled: false, label: "Order on WhatsApp" },
        phone: { enabled: false, label: "Call to order" },
      },
      socialLinks: {},
      openingHours: {},
      homepage: {},
    },
  });

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (adminEmail && adminPassword) {
    if (adminPassword.length < 12) {
      throw new Error("ADMIN_INITIAL_PASSWORD must contain at least 12 characters.");
    }
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: { active: true },
      create: {
        email: adminEmail,
        name: process.env.ADMIN_NAME?.trim() || "Store owner",
        passwordHash: hashPassword(adminPassword),
        role: AdminRole.OWNER,
      },
    });
    console.log(`Admin account ensured for ${adminEmail}.`);
  } else {
    console.log("Admin seed skipped; set ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD when needed.");
  }

  const firstProduct = await prisma.product.findFirst({ orderBy: { createdAt: "asc" } });
  if (firstProduct) {
    await prisma.review.upsert({
      where: { id: "seed-review-welcome" },
      update: {},
      create: {
        id: "seed-review-welcome",
        productId: firstProduct.id,
        reviewerName: "Demo customer",
        rating: 5,
        body: "Beautifully made and thoughtfully presented. The details felt genuinely personal.",
        status: ReviewStatus.APPROVED,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
