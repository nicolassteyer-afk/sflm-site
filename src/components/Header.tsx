"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { FullscreenMenu } from "./FullscreenMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 120],
    ["rgba(245,234,210,0)", "rgba(245,234,210,0.92)"],
  );
  const color = useTransform(scrollY, [0, 120], ["#fff7df", "#3a1912"]);
  const creamLogoOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const bordeauxLogoOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-40 grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5 md:px-10 lg:px-16"
        style={{ background, backdropFilter: "blur(18px)", color }}
      >
        <button
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Ouvrir le menu de navigation"
          className="rounded-full border border-current px-6 py-3 text-xs font-black uppercase tracking-[0.18em] transition hover:border-ember hover:bg-ember hover:text-bone"
          onClick={() => setOpen(true)}
          type="button"
        >
          Menu
        </button>
        <Link
          className="relative h-12 w-32 justify-self-center md:h-14 md:w-40"
          href="/"
          aria-label="Accueil Flam's"
        >
          <motion.span className="absolute inset-0" style={{ opacity: creamLogoOpacity }}>
            <BrandLogo className="h-full w-full" tone="cream" />
          </motion.span>
          <motion.span className="absolute inset-0" style={{ opacity: bordeauxLogoOpacity }}>
            <BrandLogo className="h-full w-full" tone="bordeaux" />
          </motion.span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <LanguageSwitcher />
          <Link
            className="warm-button rounded-full border border-current px-6 py-3 text-xs font-black uppercase tracking-[0.18em] transition hover:border-ember hover:text-bone"
            href="/reservation"
          >
            Reserver
          </Link>
        </div>
        <Link
          className="warm-button rounded-full border border-current px-5 py-3 text-xs font-black uppercase tracking-[0.18em] transition hover:border-ember hover:text-bone md:hidden"
          href="/reservation"
        >
          Reserver
        </Link>
      </motion.header>
      <FullscreenMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
