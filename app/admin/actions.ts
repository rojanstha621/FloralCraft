"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { uploadProductMedia } from "@/lib/storage/cloud";

const text = (value: FormDataEntryValue | null) => String(value || "").trim();
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({
      name: z.string().min(2).max(120),
      description: z.string().min(10).max(4000),
      price: z.coerce.number().nonnegative(),
      categoryId: z.string().min(1),
      productTypeId: z.string().min(1),
    })
    .parse({
      name: text(formData.get("name")),
      description: text(formData.get("description")),
      price: formData.get("price"),
      categoryId: text(formData.get("categoryId")),
      productTypeId: text(formData.get("productTypeId")),
    });

  const slugBase = slugify(text(formData.get("slug")) || parsed.name);
  const duplicate = await prisma.product.findUnique({ where: { slug: slugBase }, select: { id: true } });
  const slug = duplicate ? `${slugBase}-${Date.now().toString().slice(-6)}` : slugBase;
  const file = formData.get("image");
  const uploaded = file instanceof File ? await uploadProductMedia(file) : null;
  const imageUrl = uploaded?.url || text(formData.get("imageUrl"));

  await prisma.product.create({
    data: {
      ...parsed,
      slug,
      tagline: text(formData.get("tagline")) || null,
      compareAtPrice: text(formData.get("compareAtPrice")) || null,
      customizable: formData.get("customizable") === "on",
      featured: formData.get("featured") === "on",
      preparationDays: text(formData.get("preparationDays"))
        ? Number(formData.get("preparationDays"))
        : null,
      images: imageUrl
        ? {
            create: {
              url: imageUrl,
              provider: uploaded?.provider || "external",
              storageKey: uploaded?.key,
              alt: parsed.name,
              primary: true,
            },
          }
        : undefined,
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/collections");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProductState(formData: FormData) {
  await requireAdmin();
  const id = text(formData.get("id"));
  const intent = text(formData.get("intent"));
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  if (intent === "archive") await prisma.product.update({ where: { id }, data: { archivedAt: new Date() } });
  if (intent === "availability")
    await prisma.product.update({ where: { id }, data: { available: !product.available } });
  if (intent === "featured")
    await prisma.product.update({ where: { id }, data: { featured: !product.featured } });
  revalidatePath("/admin/products");
  revalidatePath("/collections");
  revalidatePath("/");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = z.string().min(2).max(80).parse(text(formData.get("name")));
  await prisma.category.create({
    data: {
      name,
      slug: slugify(text(formData.get("slug")) || name),
      description: text(formData.get("description")) || null,
      imageUrl: text(formData.get("imageUrl")) || null,
      sortOrder: Number(formData.get("sortOrder") || 0),
    },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/collections");
}

export async function toggleCategory(formData: FormData) {
  await requireAdmin();
  const id = text(formData.get("id"));
  const current = await prisma.category.findUniqueOrThrow({ where: { id } });
  await prisma.category.update({ where: { id }, data: { active: !current.active } });
  revalidatePath("/admin/categories");
  revalidatePath("/collections");
}

export async function createCustomizationOption(formData: FormData) {
  await requireAdmin();
  const productId = text(formData.get("productId"));
  const label = z.string().min(2).max(100).parse(text(formData.get("label")));
  const choices = text(formData.get("choices"))
    .split(",")
    .map((choice) => choice.trim())
    .filter(Boolean);
  await prisma.customizationOption.create({
    data: {
      productId,
      label,
      key: slugify(text(formData.get("key")) || label),
      description: text(formData.get("description")) || null,
      inputKind: text(formData.get("inputKind")) || "text",
      required: formData.get("required") === "on",
      choices: choices.length ? choices : undefined,
      priceAdjustment: Number(formData.get("priceAdjustment") || 0),
    },
  });
  revalidatePath("/admin/customization");
}

export async function toggleCustomizationOption(formData: FormData) {
  await requireAdmin();
  const id = text(formData.get("id"));
  const current = await prisma.customizationOption.findUniqueOrThrow({ where: { id } });
  await prisma.customizationOption.update({ where: { id }, data: { active: !current.active } });
  revalidatePath("/admin/customization");
}

export async function moderateReview(formData: FormData) {
  await requireAdmin();
  const status = z.enum(["APPROVED", "HIDDEN", "PENDING"]).parse(text(formData.get("status")));
  await prisma.review.update({ where: { id: text(formData.get("id")) }, data: { status } });
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
}

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const status = z
    .enum(["NEW", "CONTACTED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .parse(text(formData.get("status")));
  await prisma.orderRequest.update({
    where: { id: text(formData.get("id")) },
    data: {
      status,
      adminNotes: text(formData.get("adminNotes")) || null,
      ...(status === "CONTACTED" ? { contactedAt: new Date() } : {}),
    },
  });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {
      businessName: text(formData.get("businessName")),
      tagline: text(formData.get("tagline")) || null,
      email: text(formData.get("email")) || null,
      phone: text(formData.get("phone")) || null,
      whatsappNumber: text(formData.get("whatsappNumber")) || null,
      address: text(formData.get("address")) || null,
      currencyCode: text(formData.get("currencyCode")) || "NPR",
      currencySymbol: text(formData.get("currencySymbol")) || "Rs. ",
      whatsappMessageTemplate: text(formData.get("whatsappMessageTemplate")) || null,
    },
    create: {
      id: "default",
      businessName: text(formData.get("businessName")),
      orderingMethods: { website: { enabled: true }, whatsapp: { enabled: true } },
    },
  });
  revalidatePath("/admin/settings");
}
