import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

const cookieName = "sflm_admin_session";
const maxAge = 60 * 60 * 8;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "local-development-change-me";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeCompare(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createAdminSession(userId: string) {
  const expires = Date.now() + maxAge * 1000;
  const payload = `${userId}.${expires}`;
  const token = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();

  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token || !hasDatabaseUrl()) return null;

  const [userId, expires, signature] = token.split(".");
  if (!userId || !expires || !signature || Number(expires) < Date.now()) return null;

  const payload = `${userId}.${expires}`;
  if (!safeCompare(signature, sign(payload))) return null;

  return getPrisma().user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true },
  });
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function loginAdmin(email: string, password: string) {
  if (!hasDatabaseUrl()) return { ok: false, message: "DATABASE_URL manquant." };

  const user = await getPrisma().user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, message: "Identifiants invalides." };
  }

  await createAdminSession(user.id);
  return { ok: true, message: "Connecte." };
}
