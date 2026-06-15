"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const CITY_NAMES: Record<string, string> = {
  paris: "Paris",
  bordeaux: "Bordeaux",
  lyon: "Lyon",
  lille: "Lille",
  strasbourg: "Strasbourg",
  "thonon-les-bains": "Thonon-les-Bains",
  arras: "Arras",
  selestat: "Sélestat",
  nantes: "Nantes",
};

function getRestaurantCity(pathname: string) {
  const match = pathname.match(
    /^\/(?:en\/)?restaurants\/([^/]+)\/([^/]+)\/?$/,
  );

  if (!match) return null;

  const slug = decodeURIComponent(match[1]).toLowerCase();
  return CITY_NAMES[slug] ?? slug.replaceAll("-", " ");
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <RouteTransition key={pathname} pathname={pathname}>
        {children}
      </RouteTransition>
    </AnimatePresence>
  );
}

function RouteTransition({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  const cityName = getRestaurantCity(pathname);
  const reduceMotion = useReducedMotion();
  const [showLoader, setShowLoader] = useState(Boolean(cityName));

  useEffect(() => {
    if (!cityName) return;

    const timer = window.setTimeout(
      () => setShowLoader(false),
      reduceMotion ? 450 : 1650,
    );

    return () => window.clearTimeout(timer);
  }, [cityName, reduceMotion]);

  useEffect(() => {
    if (!showLoader) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showLoader]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.32 }}
    >
      <AnimatePresence>
        {showLoader && cityName ? (
          <RestaurantLoader cityName={cityName} reduceMotion={reduceMotion} />
        ) : null}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: cityName ? 0 : 1, y: cityName ? 0 : 18 }}
        animate={{
          opacity: showLoader ? 0 : 1,
          y: 0,
        }}
        transition={{
          duration: reduceMotion ? 0.1 : 0.55,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.main>
    </motion.div>
  );
}

function RestaurantLoader({
  cityName,
  reduceMotion,
}: {
  cityName: string;
  reduceMotion: boolean | null;
}) {
  const letters = Array.from(cityName.toUpperCase());

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex min-h-dvh items-center justify-center overflow-hidden bg-wine px-5 text-bone"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { y: "-100%" }}
      transition={{
        duration: reduceMotion ? 0.15 : 0.75,
        ease: [0.76, 0, 0.24, 1],
      }}
      aria-label={`Chargement de ${cityName}`}
      role="status"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-1 bg-saffron"
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: reduceMotion ? 0.2 : 1.25,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <div className="text-center">
        <motion.p
          className="mb-5 text-xs font-black uppercase text-saffron"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          Flam&apos;s vous ouvre la table
        </motion.p>

        <h1 className="sr-only">{cityName}</h1>
        <motion.div
          aria-hidden="true"
          className="flex max-w-[96vw] flex-wrap items-center justify-center font-display text-[clamp(3.5rem,13vw,11rem)] uppercase leading-[0.82]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.055,
                delayChildren: reduceMotion ? 0 : 0.12,
              },
            },
          }}
        >
          {letters.map((letter, index) => (
            <motion.span
              className="inline-block"
              key={`${letter}-${index}`}
              variants={{
                hidden: {
                  opacity: 0,
                  y: reduceMotion ? 0 : "110%",
                  rotate: reduceMotion ? 0 : index % 2 === 0 ? -3 : 3,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  rotate: 0,
                  transition: {
                    duration: reduceMotion ? 0.1 : 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
