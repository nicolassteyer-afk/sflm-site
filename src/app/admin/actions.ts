"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, loginAdmin, requireAdmin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function intValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function listValue(formData: FormData, key: string) {
  const raw = text(formData, key);
  return raw ? raw.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

export async function loginAction(formData: FormData) {
  const result = await loginAdmin(String(formData.get("email") ?? ""), String(formData.get("password") ?? ""));
  if (result.ok) redirect("/admin");
  redirect(`/admin/login?error=${encodeURIComponent(result.message)}`);
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function savePageAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const internalTitle = text(formData, "internalTitle") ?? "Page sans titre";
  const slug = slugify(text(formData, "slug") ?? internalTitle);
  const data = {
    internalTitle,
    displayTitle: text(formData, "displayTitle") ?? internalTitle,
    slug,
    metaTitle: text(formData, "metaTitle"),
    metaDescription: text(formData, "metaDescription"),
    ogImage: text(formData, "ogImage"),
    status: formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    displayOrder: intValue(formData, "displayOrder"),
  } as const;

  const prisma = getPrisma();
  const page = id
    ? await prisma.page.update({ where: { id }, data })
    : await prisma.page.create({ data });

  revalidatePath("/");
  revalidatePath(`/admin/pages/${page.id}`);
  redirect(`/admin/pages/${page.id}`);
}

export async function saveBlockAction(formData: FormData) {
  await requireAdmin();
  const pageId = String(formData.get("pageId") ?? "");
  const id = text(formData, "id");
  const data = {
    pageId,
    type: String(formData.get("type") ?? "EDITORIAL_TEXT") as never,
    title: text(formData, "title"),
    subtitle: text(formData, "subtitle"),
    body: text(formData, "body"),
    image: text(formData, "image"),
    gallery: listValue(formData, "gallery"),
    ctaLabel: text(formData, "ctaLabel"),
    ctaUrl: text(formData, "ctaUrl"),
    variant: text(formData, "variant"),
    displayOrder: intValue(formData, "displayOrder"),
    isActive: bool(formData, "isActive"),
  };

  const prisma = getPrisma();
  if (id) await prisma.pageBlock.update({ where: { id }, data });
  else await prisma.pageBlock.create({ data });

  revalidatePath("/");
  redirect(`/admin/pages/${pageId}`);
}

export async function deleteBlockAction(formData: FormData) {
  await requireAdmin();
  const pageId = String(formData.get("pageId") ?? "");
  const id = String(formData.get("id") ?? "");
  await getPrisma().pageBlock.delete({ where: { id } });
  revalidatePath("/");
  redirect(`/admin/pages/${pageId}`);
}

export async function reorderBlocksAction(formData: FormData) {
  await requireAdmin();
  const pageId = String(formData.get("pageId") ?? "");
  const orderedIds = String(formData.get("orderedIds") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  await getPrisma().$transaction(
    orderedIds.map((id, index) =>
      getPrisma().pageBlock.update({
        where: { id },
        data: { displayOrder: index + 1 },
      }),
    ),
  );

  revalidatePath("/");
  redirect(`/admin/pages/${pageId}`);
}

export async function saveRestaurantAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name") ?? "Restaurant sans nom";
  const data = {
    name,
    city: text(formData, "city") ?? "Paris",
    slug: slugify(text(formData, "slug") ?? name),
    address: text(formData, "address") ?? "",
    postalCode: text(formData, "postalCode"),
    country: text(formData, "country") ?? "France",
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    reservationUrl: text(formData, "reservationUrl"),
    googleMapsUrl: text(formData, "googleMapsUrl"),
    latitude: text(formData, "latitude") ? Number(text(formData, "latitude")) : null,
    longitude: text(formData, "longitude") ? Number(text(formData, "longitude")) : null,
    mainImage: text(formData, "mainImage"),
    gallery: listValue(formData, "gallery"),
    shortDescription: text(formData, "shortDescription"),
    longDescription: text(formData, "longDescription"),
    services: listValue(formData, "services"),
    isActive: bool(formData, "isActive"),
    metaTitle: text(formData, "metaTitle"),
    metaDescription: text(formData, "metaDescription"),
    ogImage: text(formData, "ogImage"),
    displayOrder: intValue(formData, "displayOrder"),
  };

  const prisma = getPrisma();
  const restaurant = id
    ? await prisma.restaurant.update({ where: { id }, data })
    : await prisma.restaurant.create({ data });

  const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
  await prisma.restaurantHours.deleteMany({ where: { restaurantId: restaurant.id } });
  await prisma.restaurantHours.createMany({
    data: days.map((day, index) => ({
      restaurantId: restaurant.id,
      day,
      opensAt: text(formData, `${day}Open`),
      closesAt: text(formData, `${day}Close`),
      isClosed: bool(formData, `${day}Closed`),
      note: text(formData, `${day}Note`),
      displayOrder: index,
    })),
  });

  revalidatePath("/restaurants");
  redirect(`/admin/restaurants/${restaurant.id}`);
}

export async function saveMenuCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name") ?? "Categorie";
  const data = {
    name,
    slug: slugify(text(formData, "slug") ?? name),
    description: text(formData, "description"),
    image: text(formData, "image"),
    displayOrder: intValue(formData, "displayOrder"),
    isActive: bool(formData, "isActive"),
  };

  const category = id
    ? await getPrisma().menuCategory.update({ where: { id }, data })
    : await getPrisma().menuCategory.create({ data });
  revalidatePath("/menu");
  redirect(`/admin/menu?category=${category.id}`);
}

export async function saveMenuItemAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const categoryId = String(formData.get("categoryId") ?? "");
  const name = text(formData, "name") ?? "Produit";
  const data = {
    categoryId,
    name,
    description: text(formData, "description"),
    price: text(formData, "price") ? Number(text(formData, "price")) : null,
    image: text(formData, "image"),
    allergens: listValue(formData, "allergens"),
    tags: listValue(formData, "tags"),
    displayOrder: intValue(formData, "displayOrder"),
    isActive: bool(formData, "isActive"),
  };

  if (id) await getPrisma().menuItem.update({ where: { id }, data });
  else await getPrisma().menuItem.create({ data });
  revalidatePath("/menu");
  redirect(`/admin/menu?category=${categoryId}`);
}

export async function saveNavigationAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const data = {
    label: text(formData, "label") ?? "Lien",
    url: text(formData, "url") ?? "/",
    displayOrder: intValue(formData, "displayOrder"),
    isVisible: bool(formData, "isVisible"),
    openInNewTab: bool(formData, "openInNewTab"),
    isPrimaryCta: bool(formData, "isPrimaryCta"),
  };

  if (id) await getPrisma().navigationItem.update({ where: { id }, data });
  else await getPrisma().navigationItem.create({ data });
  revalidatePath("/");
  redirect("/admin/navigation");
}

export async function saveFooterColumnAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const data = {
    title: text(formData, "title") ?? "Colonne",
    displayOrder: intValue(formData, "displayOrder"),
  };
  if (id) await getPrisma().footerColumn.update({ where: { id }, data });
  else await getPrisma().footerColumn.create({ data });
  revalidatePath("/");
  redirect("/admin/footer");
}

export async function saveFooterLinkAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const data = {
    columnId: String(formData.get("columnId") ?? ""),
    label: text(formData, "label") ?? "Lien",
    url: text(formData, "url") ?? "/",
    displayOrder: intValue(formData, "displayOrder"),
    openInNewTab: bool(formData, "openInNewTab"),
  };
  if (id) await getPrisma().footerLink.update({ where: { id }, data });
  else await getPrisma().footerLink.create({ data });
  revalidatePath("/");
  redirect("/admin/footer");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  await getPrisma().siteSettings.upsert({
    where: { id: "site" },
    update: {
      siteName: text(formData, "siteName") ?? "Flam's",
      globalDescription: text(formData, "globalDescription"),
      contactEmail: text(formData, "contactEmail"),
      globalPhone: text(formData, "globalPhone"),
      globalReservationUrl: text(formData, "globalReservationUrl"),
      socialLinks: listValue(formData, "socialLinks"),
      favicon: text(formData, "favicon"),
      lightLogo: text(formData, "lightLogo"),
      darkLogo: text(formData, "darkLogo"),
      defaultOgImage: text(formData, "defaultOgImage"),
      analyticsScripts: text(formData, "analyticsScripts"),
    },
    create: {
      id: "site",
      siteName: text(formData, "siteName") ?? "Flam's",
      globalDescription: text(formData, "globalDescription"),
      contactEmail: text(formData, "contactEmail"),
      globalPhone: text(formData, "globalPhone"),
      globalReservationUrl: text(formData, "globalReservationUrl"),
      socialLinks: listValue(formData, "socialLinks"),
      favicon: text(formData, "favicon"),
      lightLogo: text(formData, "lightLogo"),
      darkLogo: text(formData, "darkLogo"),
      defaultOgImage: text(formData, "defaultOgImage"),
      analyticsScripts: text(formData, "analyticsScripts"),
    },
  });
  revalidatePath("/");
  redirect("/admin/settings?saved=1");
}
