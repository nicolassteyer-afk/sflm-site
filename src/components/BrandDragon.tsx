"use client";

import { useEffect, useState } from "react";

type BrandDragonProps = {
  alt?: string;
  className?: string;
  tone?: "beige" | "bordeaux" | "jaune" | "rouge";
};

const cacheVersion = "20260608-real-dragon";
const dragonSources = {
  beige: [
    `/assets/PNG/2025-09-FLAMS-Valise-Logo_ILLU-DRAGON-BEIGE.png?v=${cacheVersion}`,
    `/assets/flams/dragon-beige.png?v=${cacheVersion}`,
  ],
  bordeaux: [
    `/assets/PNG/2025-09-FLAMS-Valise-Logo_ILLU-DRAGON-BDX.png?v=${cacheVersion}`,
    `/assets/flams/dragon-bordeaux.png?v=${cacheVersion}`,
  ],
  jaune: [
    `/assets/PNG/2025-09-FLAMS-Valise-Logo_ILLU-DRAGON-JAUNE.png?v=${cacheVersion}`,
  ],
  rouge: [
    `/assets/PNG/2025-09-FLAMS-Valise-Logo_ILLU-DRAGON-ROUGE.png?v=${cacheVersion}`,
  ],
} satisfies Record<NonNullable<BrandDragonProps["tone"]>, string[]>;

export function BrandDragon({
  alt = "Dragon Flam's",
  className = "",
  tone = "beige",
}: BrandDragonProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const sources = dragonSources[tone];

  useEffect(() => {
    setSourceIndex(0);
    setFailed(false);
  }, [tone]);

  if (failed) {
    return null;
  }

  return (
    <img
      alt={alt}
      className={className}
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
  );
}
