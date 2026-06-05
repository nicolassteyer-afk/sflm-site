"use client";

import { useEffect, useMemo, useState } from "react";

type BrandDragonProps = {
  alt?: string;
  className?: string;
  tone?: "beige" | "bordeaux" | "jaune" | "rouge";
};

const cacheVersion = "20260605-official-dragon-assets";

export function BrandDragon({
  alt = "Dragon Flam's",
  className = "",
  tone = "beige",
}: BrandDragonProps) {
  const sources = useMemo(() => {
    const officialTone = tone.toUpperCase();
    const legacyByTone = {
      beige: ["dragon-beige.png", "Dragon%20blanc.png"],
      bordeaux: ["dragon-bordeaux.png", "Dragon%20bordeaux.png"],
      jaune: ["dragon-beige.png"],
      rouge: ["dragon-bordeaux.png"],
    };

    return [
      `/2025-09-FLAMS-Valise-Logo_ILLU-DRAGON-${officialTone}.png?v=${cacheVersion}`,
      `/assets/flams/2025-09-FLAMS-Valise-Logo_ILLU-DRAGON-${officialTone}.png?v=${cacheVersion}`,
      ...legacyByTone[tone].flatMap((name) => [
        `/assets/flams/${name}?v=${cacheVersion}`,
        `/${name}?v=${cacheVersion}`,
      ]),
    ];
  }, [tone]);

  const [sourceIndex, setSourceIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");

  useEffect(() => {
    setSourceIndex(0);
    setStatus("loading");
  }, [tone]);

  if (status === "failed") {
    return (
      <span
        aria-label={alt}
        className={`inline-block font-display uppercase leading-none text-bone ${className}`}
      >
        Flam&apos;s
      </span>
    );
  }

  return (
    <img
      alt={alt}
      className={`${className} transition-opacity duration-300 ${
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
  );
}
