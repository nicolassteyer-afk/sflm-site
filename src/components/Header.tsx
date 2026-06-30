"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { FullscreenMenu } from "./FullscreenMenu";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 120],
    ["rgba(255,247,223,0)", "rgba(255,247,223,0.94)"],
  );
  const borderColor = useTransform(
    scrollY,
    [0, 120],
    ["rgba(42,21,17,0)", "rgba(42,21,17,0.22)"],
  );

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  useEffect(() => {
    setScrolled(window.scrollY > 80);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 top-0 z-40 grid h-[86px] grid-cols-[1fr_auto_1fr] items-center px-5 transition-colors duration-300 md:px-10 lg:px-14 ${
          scrolled ? "text-wine" : "text-bone"
        }`}
        style={{
          background,
          borderBottom: "1px solid",
          borderColor,
          backdropFilter: "blur(18px)",
        }}
      >
        <button
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Ouvrir le menu de navigation"
          className="group flex h-12 w-12 items-center justify-center justify-self-start"
          onClick={() => setOpen(true)}
          type="button"
        >
          <span className="flex h-4 w-5 flex-col justify-between" aria-hidden="true">
            <span className="h-[2px] w-full bg-current transition group-hover:translate-x-1" />
            <span className="h-[2px] w-full bg-current transition group-hover:-translate-x-1" />
            <span className="h-[2px] w-full bg-current transition group-hover:translate-x-1" />
          </span>
        </button>
        <Link
          className="flex h-14 w-44 items-center justify-center justify-self-center md:h-16 md:w-52"
          href="/"
          aria-label="Accueil Flam's"
        >
          <BrandLogo className="h-full w-full" tone={scrolled ? "bordeaux" : "cream"} />
        </Link>
        <div className="flex items-center justify-end gap-4">
          <Link
            className="warm-button hidden px-2 py-2 text-xs font-black uppercase tracking-[0.16em] md:block"
            href="/reservation"
          >
            Reserver
          </Link>
          <Link
            aria-label="Reserver"
            className="grid h-10 w-10 place-items-center"
            href="/reservation"
          >
            <span className="relative h-4 w-4 border-2 border-current" aria-hidden="true">
              <span className="absolute -top-1 left-0.5 h-1.5 w-0.5 bg-current" />
              <span className="absolute -top-1 right-0.5 h-1.5 w-0.5 bg-current" />
              <span className="absolute left-0 top-1 h-0.5 w-full bg-current" />
            </span>
          </Link>
        </div>
      </motion.header>
      <FullscreenMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
