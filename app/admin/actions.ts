"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { deleteProductMedia, uploadProductMedia } from "@/lib/storage/cloud";

const text = (value: FormDataEntryValue | null) => String(value || "").trim();
const idSchema = z.string().min(1).max(100);
const optionalUrl = z.union([z.literal(""), z.string().url().max(2000)]);
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const noticeUrl = (path: string, message: string) =>
  `${path}?notice=${encodeURIComponent(message)}`;

function optionalNumber(value: FormDataEntryValue | null, minimum = 0) {
  const raw = text(value);
  if (!raw) return null;
  return z.coerce.number().min(minimum).parse(raw);
}

function refreshStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/order");
  if (slug) revalidatePath(`/products/${slug}`);
}

const productInput = z.object({
  name: z.string().min(2).max(120),
  tagline: z.string().max(180),
  description: z.string().min(10).max(4000),
  price: z.coerce.number().nonnegative(),
  categoryId: idSchema,
  productTypeId: idSchema,
  dimensions: z.string().max(200),
  materials: z.string().max(500),
  customizationSummary: z.string().max(1000),
});

function parseProduct(formData: FormData) {
  return productInput.parse({
    name: text(formData.get("name")),
    tagline: text(formData.get("tagline")),
    description: text(formData.get("description")),
    price: formData.get("price"),
    categoryId: text(formData.get("categoryId")),
    productTypeId: text(formData.get("productTypeId")),
    dimensions: text(formData.get("dimensions")),
    materials: text(formData.get("materials")),
    customizationSummary: text(formData.get("customizationSummary")),
  });
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const parsed = parseProduct(formData);
  const slugBase = slugify(text(formData.get("slug")) || parsed.name);
  if (!slugBase) throw new Error("Enter a product name that can be used in a web address.");
  const duplicate = await prisma.product.findUnique({
    where: { slug: slugBase },
    select: { id: true },
  });
  const slug = duplicate ? `${slugBase}-${Date.now().toString().slice(-6)}` : slugBase;
  const imageUrl = optionalUrl.parse(text(formData.get("imageUrl")));
  const file = formData.get("image");
  const uploaded = file instanceof File && file.size ? await uploadProductMedia(file) : null;
  await prisma.product.create({
    data: {
      name: parsed.name,
      slug,
      tagline: parsed.tagline || null,
      description: parsed.description,
      price: parsed.price,
      compareAtPrice: optionalNumber(formData.get("compareAtPrice")),
      preparationDays: optionalNumber(formData.get("preparationDays")),
      dimensions: parsed.dimensions || null,
      materials: parsed.materials || null,
      categoryId: parsed.categoryId,
      productTypeId: parsed.productTypeId,
      available: formData.get("available") === "on",
      customizable: formData.get("customizable") === "on",
      customizationSummary: parsed.customizationSummary || null,
      featured: formData.get("featured") === "on",
      images:
        uploaded || imageUrl
          ? {
              create: {
                url: uploaded?.url || imageUrl,
                provider: uploaded?.provider || "external",
                storageKey: uploaded?.key,
                alt: parsed.name,
                primary: true,
              },
            }
          : undefined,
    },
  });
  refreshStorefront(slug);
  revalidatePath("/admin/products");
  redirect(noticeUrl("/admin/products", `${parsed.name} was created.`));
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  const current = await prisma.product.findUniqueOrThrow({ where: { id } });
  const parsed = parseProduct(formData);
  const slug = slugify(text(formData.get("slug")) || parsed.name);
  if (!slug) throw new Error("Enter a valid product slug.");
  await prisma.product.update({
    where: { id },
    data: {
      name: parsed.name,
      slug,
      tagline: parsed.tagline || null,
      description: parsed.description,
      price: parsed.price,
      compareAtPrice: optionalNumber(formData.get("compareAtPrice")),
      preparationDays: optionalNumber(formData.get("preparationDays")),
      dimensions: parsed.dimensions || null,
      materials: parsed.materials || null,
      categoryId: parsed.categoryId,
      productTypeId: parsed.productTypeId,
      available: formData.get("available") === "on",
      customizable: formData.get("customizable") === "on",
      customizationSummary: parsed.customizationSummary || null,
      featured: formData.get("featured") === "on",
    },
  });
  refreshStorefront(current.slug);
  refreshStorefront(slug);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  redirect(noticeUrl(`/admin/products/${id}`, "Product details saved."));
}

export async function updateProductState(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  const intent = z
    .enum(["archive", "availability", "featured"])
    .parse(text(formData.get("intent")));
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  if (intent === "archive")
    await prisma.product.update({
      where: { id },
      data: { archivedAt: new Date(), available: false, featured: false },
    });
  if (intent === "availability")
    await prisma.product.update({ where: { id }, data: { available: !product.available } });
  if (intent === "featured")
    await prisma.product.update({ where: { id }, data: { featured: !product.featured } });
  refreshStorefront(product.slug);
  revalidatePath("/admin/products");
  if (intent === "archive") redirect(noticeUrl("/admin/products", `${product.name} was archived.`));
}

export async function addProductImage(formData: FormData) {
  await requireAdmin();
  const productId = idSchema.parse(text(formData.get("productId")));
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
    select: { name: true, slug: true },
  });
  const file = formData.get("image");
  const uploaded = file instanceof File && file.size ? await uploadProductMedia(file) : null;
  const imageUrl = optionalUrl.parse(text(formData.get("imageUrl")));
  if (!uploaded && !imageUrl)
    throw new Error("Choose an image file or enter an external image URL.");
  const aggregate = await prisma.productImage.aggregate({
    where: { productId },
    _max: { sortOrder: true },
    _count: true,
  });
  await prisma.productImage.create({
    data: {
      productId,
      url: uploaded?.url || imageUrl,
      provider: uploaded?.provider || "external",
      storageKey: uploaded?.key,
      alt: text(formData.get("alt")) || product.name,
      sortOrder: (aggregate._max.sortOrder || 0) + (aggregate._count ? 1 : 0),
      primary: aggregate._count === 0,
    },
  });
  refreshStorefront(product.slug);
  revalidatePath(`/admin/products/${productId}`);
  redirect(noticeUrl(`/admin/products/${productId}`, "Product image added."));
}

export async function updateProductImage(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  const intent = z.enum(["primary", "up", "down", "alt"]).parse(text(formData.get("intent")));
  const image = await prisma.productImage.findUniqueOrThrow({
    where: { id },
    include: { product: { select: { slug: true } } },
  });
  if (intent === "primary") {
    await prisma.$transaction([
      prisma.productImage.updateMany({
        where: { productId: image.productId },
        data: { primary: false },
      }),
      prisma.productImage.update({ where: { id }, data: { primary: true } }),
    ]);
  } else if (intent === "alt") {
    await prisma.productImage.update({
      where: { id },
      data: {
        alt:
          z
            .string()
            .max(250)
            .parse(text(formData.get("alt"))) || null,
      },
    });
  } else {
    const images = await prisma.productImage.findMany({
      where: { productId: image.productId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    const index = images.findIndex((item) => item.id === id);
    const target = images[intent === "up" ? index - 1 : index + 1];
    if (target) {
      const temporary = Math.max(...images.map((item) => item.sortOrder), 0) + 1000;
      await prisma.$transaction([
        prisma.productImage.update({ where: { id }, data: { sortOrder: temporary } }),
        prisma.productImage.update({
          where: { id: target.id },
          data: { sortOrder: image.sortOrder },
        }),
        prisma.productImage.update({ where: { id }, data: { sortOrder: target.sortOrder } }),
      ]);
    }
  }
  refreshStorefront(image.product.slug);
  revalidatePath(`/admin/products/${image.productId}`);
}

export async function deleteProductImage(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  const image = await prisma.productImage.findUniqueOrThrow({
    where: { id },
    include: { product: { select: { slug: true } } },
  });
  await prisma.$transaction(async (tx) => {
    await tx.productImage.delete({ where: { id } });
    if (image.primary) {
      const next = await tx.productImage.findFirst({
        where: { productId: image.productId },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      if (next) await tx.productImage.update({ where: { id: next.id }, data: { primary: true } });
    }
  });
  await deleteProductMedia(image.provider, image.storageKey).catch((error) =>
    console.error("Cloud media cleanup failed", error)
  );
  refreshStorefront(image.product.slug);
  revalidatePath(`/admin/products/${image.productId}`);
  redirect(noticeUrl(`/admin/products/${image.productId}`, "Image removed."));
}

const collectionInput = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(1000),
  imageUrl: optionalUrl,
  sortOrder: z.coerce.number().int().min(-9999).max(9999),
});
function parseCollection(formData: FormData) {
  return collectionInput.parse({
    name: text(formData.get("name")),
    description: text(formData.get("description")),
    imageUrl: text(formData.get("imageUrl")),
    sortOrder: formData.get("sortOrder") || 0,
  });
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const parsed = parseCollection(formData);
  const slug = slugify(text(formData.get("slug")) || parsed.name);
  await prisma.category.create({
    data: {
      ...parsed,
      slug,
      description: parsed.description || null,
      imageUrl: parsed.imageUrl || null,
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/collections");
  redirect(noticeUrl("/admin/categories", `${parsed.name} was created.`));
}
export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  const parsed = parseCollection(formData);
  const slug = slugify(text(formData.get("slug")) || parsed.name);
  await prisma.category.update({
    where: { id },
    data: {
      ...parsed,
      slug,
      description: parsed.description || null,
      imageUrl: parsed.imageUrl || null,
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/collections");
  redirect(noticeUrl("/admin/categories", `${parsed.name} was updated.`));
}
export async function toggleCategory(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  const current = await prisma.category.findUniqueOrThrow({ where: { id } });
  await prisma.category.update({ where: { id }, data: { active: !current.active } });
  revalidatePath("/admin/categories");
  revalidatePath("/collections");
}

export async function createProductType(formData: FormData) {
  await requireAdmin();
  const parsed = parseCollection(formData);
  const slug = slugify(text(formData.get("slug")) || parsed.name);
  await prisma.productType.create({
    data: {
      name: parsed.name,
      slug,
      description: parsed.description || null,
      sortOrder: parsed.sortOrder,
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/admin/product-types");
  revalidatePath("/collections");
  redirect(noticeUrl("/admin/product-types", `${parsed.name} was created.`));
}
export async function updateProductType(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  const parsed = parseCollection(formData);
  const slug = slugify(text(formData.get("slug")) || parsed.name);
  await prisma.productType.update({
    where: { id },
    data: {
      name: parsed.name,
      slug,
      description: parsed.description || null,
      sortOrder: parsed.sortOrder,
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/admin/product-types");
  revalidatePath("/collections");
  redirect(noticeUrl("/admin/product-types", `${parsed.name} was updated.`));
}
export async function toggleProductType(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  const current = await prisma.productType.findUniqueOrThrow({ where: { id } });
  await prisma.productType.update({ where: { id }, data: { active: !current.active } });
  revalidatePath("/admin/product-types");
  revalidatePath("/collections");
}

const customizationInput = z.object({
  productId: idSchema,
  label: z.string().min(2).max(100),
  description: z.string().max(500),
  inputKind: z.enum(["text", "select", "textarea"]),
  priceAdjustment: z.coerce.number().min(-999999).max(999999),
  sortOrder: z.coerce.number().int().min(-9999).max(9999),
});
function parseCustomization(formData: FormData) {
  const choices = text(formData.get("choices"))
    .split(",")
    .map((choice) => choice.trim())
    .filter(Boolean)
    .slice(0, 40);
  return {
    parsed: customizationInput.parse({
      productId: text(formData.get("productId")),
      label: text(formData.get("label")),
      description: text(formData.get("description")),
      inputKind: text(formData.get("inputKind")) || "text",
      priceAdjustment: formData.get("priceAdjustment") || 0,
      sortOrder: formData.get("sortOrder") || 0,
    }),
    choices,
  };
}
export async function createCustomizationOption(formData: FormData) {
  await requireAdmin();
  const { parsed, choices } = parseCustomization(formData);
  await prisma.customizationOption.create({
    data: {
      ...parsed,
      description: parsed.description || null,
      key: slugify(text(formData.get("key")) || parsed.label),
      required: formData.get("required") === "on",
      active: formData.get("active") === "on",
      choices: choices.length ? choices : undefined,
    },
  });
  revalidatePath("/admin/customization");
  revalidatePath("/order");
  redirect(noticeUrl("/admin/customization", `${parsed.label} was added.`));
}
export async function updateCustomizationOption(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  const { parsed, choices } = parseCustomization(formData);
  await prisma.customizationOption.update({
    where: { id },
    data: {
      ...parsed,
      description: parsed.description || null,
      key: slugify(text(formData.get("key")) || parsed.label),
      required: formData.get("required") === "on",
      active: formData.get("active") === "on",
      choices: choices.length ? choices : Prisma.JsonNull,
    },
  });
  revalidatePath("/admin/customization");
  revalidatePath("/order");
  redirect(noticeUrl("/admin/customization", `${parsed.label} was updated.`));
}
export async function toggleCustomizationOption(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  const current = await prisma.customizationOption.findUniqueOrThrow({ where: { id } });
  await prisma.customizationOption.update({ where: { id }, data: { active: !current.active } });
  revalidatePath("/admin/customization");
  revalidatePath("/order");
}
export async function deleteCustomizationOption(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  await prisma.customizationOption.delete({ where: { id } });
  revalidatePath("/admin/customization");
  revalidatePath("/order");
  redirect(noticeUrl("/admin/customization", "Customization option deleted."));
}

export async function moderateReview(formData: FormData) {
  await requireAdmin();
  const status = z.enum(["APPROVED", "HIDDEN", "PENDING"]).parse(text(formData.get("status")));
  const review = await prisma.review.update({
    where: { id: idSchema.parse(text(formData.get("id"))) },
    data: { status },
    include: { product: { select: { slug: true } } },
  });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  revalidatePath(`/products/${review.product.slug}`);
}
export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(text(formData.get("id")));
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  redirect(noticeUrl("/admin/reviews", "Review deleted."));
}

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const status = z
    .enum(["NEW", "CONTACTED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .parse(text(formData.get("status")));
  await prisma.orderRequest.update({
    where: { id: idSchema.parse(text(formData.get("id"))) },
    data: {
      status,
      adminNotes:
        z
          .string()
          .max(2000)
          .parse(text(formData.get("adminNotes"))) || null,
      ...(status === "CONTACTED" ? { contactedAt: new Date() } : {}),
    },
  });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({
      businessName: z.string().min(2).max(120),
      tagline: z.string().max(240),
      email: z.union([z.literal(""), z.string().email().max(160)]),
      phone: z.string().max(40),
      whatsappNumber: z.string().max(40),
      address: z.string().max(300),
      currencyCode: z.string().min(3).max(3),
      currencySymbol: z.string().min(1).max(10),
      openingHours: z.string().max(500),
      instagram: optionalUrl,
      facebook: optionalUrl,
      tiktok: optionalUrl,
      otherSocial: optionalUrl,
      whatsappMessageTemplate: z.string().max(1500),
    })
    .parse({
      businessName: text(formData.get("businessName")),
      tagline: text(formData.get("tagline")),
      email: text(formData.get("email")),
      phone: text(formData.get("phone")),
      whatsappNumber: text(formData.get("whatsappNumber")),
      address: text(formData.get("address")),
      currencyCode: text(formData.get("currencyCode")).toUpperCase() || "NPR",
      currencySymbol: text(formData.get("currencySymbol")) || "Rs. ",
      openingHours: text(formData.get("openingHours")),
      instagram: text(formData.get("instagram")),
      facebook: text(formData.get("facebook")),
      tiktok: text(formData.get("tiktok")),
      otherSocial: text(formData.get("otherSocial")),
      whatsappMessageTemplate: text(formData.get("whatsappMessageTemplate")),
    });
  const data = {
    businessName: parsed.businessName,
    tagline: parsed.tagline || null,
    email: parsed.email || null,
    phone: parsed.phone || null,
    whatsappNumber: parsed.whatsappNumber || null,
    address: parsed.address || null,
    currencyCode: parsed.currencyCode,
    currencySymbol: parsed.currencySymbol,
    openingHours: parsed.openingHours ? { display: parsed.openingHours } : Prisma.JsonNull,
    socialLinks: {
      instagram: parsed.instagram,
      facebook: parsed.facebook,
      tiktok: parsed.tiktok,
      other: parsed.otherSocial,
    },
    orderingMethods: {
      website: {
        enabled: formData.get("websiteOrdering") === "on",
        label: "Send an order request",
      },
      whatsapp: { enabled: formData.get("whatsappOrdering") === "on", label: "Order on WhatsApp" },
    },
    whatsappMessageTemplate: parsed.whatsappMessageTemplate || null,
  };
  await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });
  revalidateTag("business-settings");
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/order");
  redirect(noticeUrl("/admin/settings", "Business settings saved."));
}
