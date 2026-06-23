import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import { BrandLogo } from "@/components/BrandLogo";
import { requireAdmin } from "@/lib/admin-auth";

const navItems = [
  ["Dashboard", "/admin"],
  ["Pages", "/admin/pages"],
  ["Restaurants", "/admin/restaurants"],
  ["Carte", "/admin/menu"],
  ["Medias", "/admin/media"],
  ["Navigation", "/admin/navigation"],
  ["Footer", "/admin/footer"],
  ["Parametres", "/admin/settings"],
];

export async function AdminFrame({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="admin-shell">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <Link className="mb-8 block h-14 w-36" href="/admin" aria-label="Admin Flam's">
            <BrandLogo className="h-full w-full" tone="cream" />
          </Link>
          <nav className="grid gap-1">
            {navItems.map(([label, href]) => (
              <Link
                className="rounded-lg px-3 py-3 text-sm font-black uppercase tracking-[0.12em] text-bone/62 transition hover:bg-bone/10 hover:text-bone"
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-10 border-t border-bone/10 pt-5">
            <p className="text-xs font-bold text-bone/45">{user.email}</p>
            <form action={logoutAction} className="mt-3">
              <button className="admin-button w-full" type="submit">Logout</button>
            </form>
          </div>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
