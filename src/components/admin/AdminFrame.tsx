import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import { BrandLogo } from "@/components/BrandLogo";
import { requireAdmin } from "@/lib/admin-auth";

const navItems = [
  ["Dashboard", "/admin"],
  ["Store locator", "/admin/restaurants"],
  ["Pages site", "/admin/pages"],
  ["Carte", "/admin/menu"],
  ["Assets", "/admin/media"],
  ["Menu site", "/admin/navigation"],
  ["Footer", "/admin/footer"],
  ["Settings", "/admin/settings"],
];

export async function AdminFrame({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="admin-shell">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <Link className="mb-8 flex h-14 w-36 items-center" href="/admin" aria-label="Admin Flam's">
            <BrandLogo className="h-full w-full max-w-[7rem]" tone="cream" />
            <span className="ml-3 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">
              CMS
            </span>
          </Link>
          <nav className="grid gap-1">
            {navItems.map(([label, href]) => (
              <Link
                className="rounded-md px-3 py-3 text-sm font-black uppercase tracking-[0.08em] text-slate-400 transition hover:bg-cyan-400/10 hover:text-cyan-100"
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-10 border-t border-slate-800 pt-5">
            <p className="text-xs font-bold text-slate-500">{user.email}</p>
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
