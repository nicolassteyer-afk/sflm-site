"use client";

import { useEffect, useState } from "react";

type BrandLogoProps = {
  tone?: "cream" | "bordeaux";
  className?: string;
};

const cacheVersion = "20260605-uploaded-flams-assets";
const logoSources = {
  cream: [
    `/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-BEIGE.png?v=${cacheVersion}`,
    `/assets/flams/logo-beige.png?v=${cacheVersion}`,
    `/assets/flams/logo-beige.svg?v=${cacheVersion}`,
  ],
  bordeaux: [
    `/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-BDX.png?v=${cacheVersion}`,
    `/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-ROUGE.png?v=${cacheVersion}`,
    `/assets/flams/logo-bdx.png?v=${cacheVersion}`,
  ],
} satisfies Record<NonNullable<BrandLogoProps["tone"]>, string[]>;

export function BrandLogo({ tone = "cream", className = "" }: BrandLogoProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const sources = logoSources[tone];

  useEffect(() => {
    setSourceIndex(0);
    setFailed(false);
  }, [tone]);

  return (
    <span
      aria-label="Flam's"
      className={`relative inline-flex h-12 w-36 items-center justify-center overflow-hidden ${className}`}
    >
      {!failed ? (
        <img
          alt="Flam's"
          className="block h-full w-full object-contain"
          draggable={false}
          key={`${tone}-${sourceIndex}`}
          src={sources[sourceIndex]}
          onError={() => {
            if (sourceIndex < sources.length - 1) {
              setSourceIndex(sourceIndex + 1);
              return;
            }
            setFailed(true);
          }}
        />
      ) : null}
    </span>
  );
}
