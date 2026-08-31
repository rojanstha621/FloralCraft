import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌸 Seeding Petal Craft Florals database...");

  // 1. Create Default Admin User
  await prisma.adminUser.upsert({
    where: { email: "admin@petalcraftflorals.com" },
    update: {},
    create: {
      email: "admin@petalcraftflorals.com",
      name: "Petal Craft Studio Admin",
      passwordHash: "$2b$10$epayDevDummyHashChangeInProductionSecret123",
      role: "ADMIN",
    },
  });

  // 2. Create Initial Categories
  const categories = [
    { name: "Forever Bloom", slug: "forever-bloom", description: "Everlasting pressed floral compositions in museum glass." },
    { name: "Our Story", slug: "our-story", description: "Photo-infused botanical keepsakes celebrating milestones and love." },
    { name: "Dear Mom", slug: "dear-mom", description: "Heartfelt gratitude gifts with preserved roses and delicate greenery." },
    { name: "With Gratitude", slug: "with-gratitude", description: "Enchanted floral domes and shadowboxes designed to say thank you." },
    { name: "Memory Lane", slug: "memory-lane", description: "Archival shadowboxes preserving dates, vows, and treasured moments." },
    { name: "Made For You", slug: "made-for-you", description: "Completely bespoke handcrafted creations tailored to your vision." },
  ];

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
  }

  // 3. Create Delivery Zones
  const deliveryZones = [
    { areaName: "Kathmandu Central", city: "Kathmandu", fee: 150, estimatedDays: 2 },
    { areaName: "Lalitpur", city: "Lalitpur", fee: 150, estimatedDays: 2 },
    { areaName: "Bhaktapur", city: "Bhaktapur", fee: 150, estimatedDays: 3 },
    { areaName: "Outside Valley Courier", city: "Outside Valley", fee: 300, estimatedDays: 5 },
  ];

  for (const zone of deliveryZones) {
    await prisma.delivery.upsert({
      where: { areaName: zone.areaName },
      update: {},
      create: zone,
    });
  }

  // 4. Create Sample Products with External Image URLs
  // NOTE: Replace these placeholder URLs with your actual ImgLink/im.ge/8upload URLs
  // Upload your product images to ImgLink (imglink.cc) and paste the direct URLs here
  const sampleProducts = [
    {
      name: "Eternal Rose Frame",
      slug: "eternal-rose-frame",
      tagline: "Forever preserved in time",
      description: "A stunning pressed rose composition encased in museum-quality glass, perfect for preserving your most precious memories.",
      story: "Crafted with roses sourced from Kathmandu Valley gardens, each frame tells a unique story of eternal love and beauty.",
      basePrice: 2499,
      compareAtPrice: 2999,
      isCustomizable: true,
      isFeatured: true,
      isAvailable: true,
      dimensions: "30cm x 40cm",
      materials: "Pressed roses, museum glass, wooden frame",
      prepTimeDays: 3,
      categorySlug: "forever-bloom",
      images: [
        // Replace with your ImgLink URLs like: "https://imglink.cc/your-image.jpg"
        { url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800", altText: "Eternal Rose Frame front view", sortOrder: 0, isPrimary: true },
        { url: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800", altText: "Eternal Rose Frame detail", sortOrder: 1, isPrimary: false },
      ],
    },
    {
      name: "Memory Lane Shadowbox",
      slug: "memory-lane-shadowbox",
      tagline: "Your story, preserved",
      description: "A customizable shadowbox where you can display your favorite photo alongside pressed flowers and meaningful mementos.",
      story: "Each shadowbox is handcrafted to tell your personal story, combining modern printing with traditional floral preservation techniques.",
      basePrice: 3299,
      compareAtPrice: 3799,
      isCustomizable: true,
      isFeatured: true,
      isAvailable: true,
      dimensions: "25cm x 30cm",
      materials: "Wooden shadowbox, pressed flowers, photo print",
      prepTimeDays: 5,
      categorySlug: "memory-lane",
      images: [
        { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800", altText: "Memory Lane Shadowbox", sortOrder: 0, isPrimary: true },
      ],
    },
    {
      name: "Dear Mom Bouquet",
      slug: "dear-mom-bouquet",
      tagline: "For the one who gave you everything",
      description: "A heartfelt arrangement of preserved roses and baby's breath, designed to express gratitude to the most important woman in your life.",
      story: "Inspired by traditional Nepalese floral tributes, this bouquet combines modern preservation techniques with timeless sentiment.",
      basePrice: 1899,
      compareAtPrice: 2199,
      isCustomizable: false,
      isFeatured: false,
      isAvailable: true,
      dimensions: "35cm height",
      materials: "Preserved roses, baby's breath, decorative ribbon",
      prepTimeDays: 2,
      categorySlug: "dear-mom",
      images: [
        { url: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800", altText: "Dear Mom Bouquet", sortOrder: 0, isPrimary: true },
      ],
    },
  ];

  for (const product of sampleProducts) {
    const category = await prisma.productCategory.findUnique({
      where: { slug: product.categorySlug },
    });

    if (category) {
      const createdProduct = await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          name: product.name,
          slug: product.slug,
          tagline: product.tagline,
          description: product.description,
          story: product.story,
          basePrice: product.basePrice,
          compareAtPrice: product.compareAtPrice,
          isCustomizable: product.isCustomizable,
          isFeatured: product.isFeatured,
          isAvailable: product.isAvailable,
          dimensions: product.dimensions,
          materials: product.materials,
          prepTimeDays: product.prepTimeDays,
          categoryId: category.id,
        },
      });

      // Add product images (using external URLs)
      for (const imageData of product.images) {
        try {
          await prisma.productImage.create({
            data: {
              productId: createdProduct.id,
              url: imageData.url,
              altText: imageData.altText,
              sortOrder: imageData.sortOrder,
              isPrimary: imageData.isPrimary,
            },
          });
        } catch (error) {
          // Image might already exist, skip it
          console.log(`Image ${imageData.url} already exists for product ${product.name}`);
        }
      }
    }
  }

  // 5. Create Coupons
  const coupons = [
    { code: "FIRSTBLOOM", description: "10% off your first keepsake", discountValue: 10, discountType: "PERCENTAGE" },
    { code: "KATHMANDU", description: "Valley festive 10% discount", discountValue: 10, discountType: "PERCENTAGE" },
    { code: "PETAL20", description: "20% off special occasions", discountValue: 20, discountType: "PERCENTAGE" },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  console.log("✔ Database seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
