"use client";

import { useEffect, useState } from "react";

type BrandLogoProps = {
  tone?: "cream" | "bordeaux";
  className?: string;
};

export function BrandLogo({ tone = "cream", className = "" }: BrandLogoProps) {
  const cacheVersion = "20260604-logo-exact";
  const sources =
    tone === "cream"
      ? [
          `/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-BEIGE.png?v=${cacheVersion}`,
          `/2025-09-FLAMS-Valise-Logo_LOGO-BEIGE.png?v=${cacheVersion}`,
          `/assets/flams/logo-beige.png?v=${cacheVersion}`,
          `/assets/flams/logo-beige.svg?v=${cacheVersion}`,
          `/assets/flams/Logo%20beige.png?v=${cacheVersion}`,
          `/assets/flams/Logo%20beige.svg?v=${cacheVersion}`,
          `/Logo%20beige.png?v=${cacheVersion}`,
          `/Logo%20beige.svg?v=${cacheVersion}`,
        ]
      : [
          `/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-BDX.png?v=${cacheVersion}`,
          `/2025-09-FLAMS-Valise-Logo_LOGO-BDX.png?v=${cacheVersion}`,
          `/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-ROUGE.png?v=${cacheVersion}`,
          `/assets/flams/logo-bdx.png?v=${cacheVersion}`,
          `/assets/flams/Logo%20BDX.png?v=${cacheVersion}`,
          `/Logo%20BDX.png?v=${cacheVersion}`,
          `/assets/flams/LOGO-FLAM%27S-ROUGE.png?v=${cacheVersion}`,
          `/LOGO-FLAM%27S-ROUGE.png?v=${cacheVersion}`,
          `/assets/flams/logo-beige.png?v=${cacheVersion}`,
          `/assets/flams/Logo%20beige.png?v=${cacheVersion}`,
        ];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const textColor = tone === "cream" ? "text-bone" : "text-wine";

  useEffect(() => {
    setSourceIndex(0);
    setShowImage(true);
  }, [tone]);

  return (
    <span
      aria-label="Flam's"
      className={`relative inline-flex h-12 w-36 items-center justify-center overflow-hidden ${className}`}
    >
      {showImage ? (
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
            setShowImage(false);
          }}
        />
      ) : (
        <span className={`font-display text-[2.8rem] uppercase leading-none ${textColor}`}>
          Flam&apos;s
        </span>
      )}
    </span>
  );
}
