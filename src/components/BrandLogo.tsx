"use client";

import { useEffect, useState } from "react";

type BrandLogoProps = {
  tone?: "cream" | "bordeaux";
  className?: string;
};

const logoSources = {
  cream: [
    "/assets/flams/logo-beige.svg",
    "/assets/flams/Logo%20beige.svg",
    "/assets/flams/logo-beige.png",
    "/assets/flams/Logo%20beige.png",
  ],
  bordeaux: [
    "/assets/flams/logo-bdx.svg",
    "/assets/flams/Logo%20BDX.svg",
    "/assets/flams/flams-logo-bordeaux.svg",
    "/assets/flams/logo-bdx.png",
    "/assets/flams/Logo%20BDX.png",
    "/assets/flams/logo-beige.svg",
  ],
} as const;

export function BrandLogo({ tone = "cream", className = "" }: BrandLogoProps) {
  const sources = logoSources[tone];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const textColor = tone === "cream" ? "text-bone" : "text-wine";
  const source = sources[Math.min(sourceIndex, sources.length - 1)];

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
          key={`${tone}-${sourceIndex}`}
          alt="Flam's"
          className="block h-full w-full object-contain"
          draggable={false}
          src={source}
          onError={() => {
            if (sourceIndex < sources.length - 1) {
              setSourceIndex((current) => current + 1);
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
