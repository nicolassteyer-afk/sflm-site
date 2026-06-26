"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { withLocale } from "@/lib/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em]">
      <Link className="opacity-70 transition hover:opacity-100" href={withLocale(pathname, "fr")}>
        FR
      </Link>
      <span className="h-px w-6 bg-current opacity-30" />
      <Link className="opacity-70 transition hover:opacity-100" href={withLocale(pathname, "en")}>
        EN
      </Link>
    </div>
  );
}
