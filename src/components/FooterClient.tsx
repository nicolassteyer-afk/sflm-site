"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { countries } from "@/data/restaurants";
import { BrandLogo } from "./BrandLogo";

type FooterData = {
  settings: { globalDescription: string | null } | null;
  columns: {
    id: string;
    title: string;
    links: { id: string; label: string; url: string; openInNewTab: boolean }[];
  }[];
} | null;

export function FooterClient({ cmsFooter }: { cmsFooter: FooterData }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-ink px-5 py-14 text-bone md:px-10 lg:px-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr_.6fr]">
        <div>
          <Link className="inline-block" href="/" aria-label="Accueil Flam's">
            <BrandLogo className="h-20 w-48" tone="cream" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-bone/60">
            {cmsFooter?.settings?.globalDescription ??
              "Tables chaudes, recettes partagees, adresses vivantes. Nouveau site vitrine en construction premium."}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {cmsFooter?.columns?.length ? cmsFooter.columns.map((column) => (
            <div key={column.id}>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-saffron">
                {column.title}
              </p>
              <div className="grid gap-2">
                {column.links.map((link) => (
                  <Link
                    className="text-sm font-bold text-bone/65 transition hover:text-bone"
                    href={link.url}
                    key={link.id}
                    target={link.openInNewTab ? "_blank" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )) : countries.map((country) => (
            <div key={country.slug}>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-saffron">
                {country.name}
              </p>
              <div className="grid gap-2">
                {country.cities.map((city) => (
                  <Link
                    className="text-sm font-bold text-bone/65 transition hover:text-bone"
                    href={`/restaurants/${city.slug}`}
                    key={city.slug}
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="grid content-start gap-3 text-sm font-black uppercase tracking-[0.16em] text-bone/70">
          <Link href="/notre-univers">Notre Univers</Link>
          <Link href="/la-carte">La carte</Link>
          <Link href="/suggestions-du-moment">Suggestions du moment</Link>
          <Link href="/restaurants">Nos restaurants</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/recrutement">Recrutement</Link>
          <Link href="/credits">Credits</Link>
        </div>
      </div>
    </footer>
  );
}
