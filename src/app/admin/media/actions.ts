"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "");

  if (!(file instanceof File) || file.size === 0) redirect("/admin/media?error=missing-file");
  if (!file.type.startsWith("image/")) redirect("/admin/media?error=invalid-type");

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name) || ".jpg";
  const safeName = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, safeName), bytes);

  await getPrisma().media.create({
    data: {
      url: `/uploads/${safeName}`,
      filename: safeName.endsWith(extension) ? safeName : `${safeName}${extension}`,
      altText,
      mimeType: file.type,
      size: file.size,
    },
  });

  revalidatePath("/admin/media");
  redirect("/admin/media");
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await getPrisma().media.delete({ where: { id } });
  revalidatePath("/admin/media");
  redirect("/admin/media");
}
