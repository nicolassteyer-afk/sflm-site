"use client";

import { useEffect, useMemo, useState } from "react";

type BrandLogoProps = {
  tone?: "cream" | "bordeaux";
  className?: string;
};

export function BrandLogo({ tone = "cream", className = "" }: BrandLogoProps) {
  const cacheVersion = "20260605-official-logo-assets";
  const sources = useMemo(
    () =>
      tone === "cream"
        ? [
            `/2025-09-FLAMS-Valise-Logo_LOGO-BEIGE.png?v=${cacheVersion}`,
            `/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-BEIGE.png?v=${cacheVersion}`,
            `/assets/flams/logo-beige.png?v=${cacheVersion}`,
            `/assets/flams/logo-beige.svg?v=${cacheVersion}`,
            `/Logo%20beige.png?v=${cacheVersion}`,
            `/Logo%20beige.svg?v=${cacheVersion}`,
            `/assets/flams/Logo%20beige.png?v=${cacheVersion}`,
            `/assets/flams/Logo%20beige.svg?v=${cacheVersion}`,
          ]
        : [
            `/2025-09-FLAMS-Valise-Logo_LOGO-BDX.png?v=${cacheVersion}`,
            `/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-BDX.png?v=${cacheVersion}`,
            `/2025-09-FLAMS-Valise-Logo_LOGO-ROUGE.png?v=${cacheVersion}`,
            `/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-ROUGE.png?v=${cacheVersion}`,
            `/assets/flams/logo-bdx.png?v=${cacheVersion}`,
            `/Logo%20BDX.png?v=${cacheVersion}`,
            `/assets/flams/Logo%20BDX.png?v=${cacheVersion}`,
            `/assets/flams/logo-beige.png?v=${cacheVersion}`,
          ],
    [tone],
  );
  const [sourceIndex, setSourceIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");
  const textColor = tone === "cream" ? "text-bone" : "text-wine";

  useEffect(() => {
    setSourceIndex(0);
    setStatus("loading");
  }, [tone]);

  return (
    <span
      aria-label="Flam's"
      className={`relative inline-flex h-12 w-36 items-center justify-center overflow-hidden ${className}`}
    >
      {status !== "loaded" ? (
        <span className={`absolute inset-0 grid place-items-center font-display text-[2.8rem] uppercase leading-none ${textColor}`}>
          Flam&apos;s
        </span>
      ) : null}
      {status !== "failed" ? (
        <img
          alt="Flam's"
          className={`relative z-10 block h-full w-full object-contain transition-opacity duration-200 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
          draggable={false}
          key={`${tone}-${sourceIndex}`}
          src={sources[sourceIndex]}
          onLoad={() => setStatus("loaded")}
          onError={() => {
            if (sourceIndex < sources.length - 1) {
              setSourceIndex(sourceIndex + 1);
              setStatus("loading");
              return;
            }
            setStatus("failed");
          }}
        />
      ) : null}
    </span>
  );
}
