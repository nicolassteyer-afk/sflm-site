"use client";

import { useState } from "react";

type BrandLogoProps = {
  tone?: "cream" | "bordeaux";
  className?: string;
};

export function BrandLogo({ tone = "cream", className = "" }: BrandLogoProps) {
  const sources =
    tone === "cream"
      ? [
          "/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-BEIGE.svg",
          "/assets/flams/logo-beige.svg",
        ]
      : [
          "/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-BDX.svg",
          "/assets/flams/2025-09-FLAMS-Valise-Logo_LOGO-BEIGE.svg",
        ];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const textColor = tone === "cream" ? "text-bone" : "text-wine";

  return (
    <span
      aria-label="Flam's"
      className={`relative inline-flex h-12 w-32 items-center justify-center overflow-hidden ${className}`}
    >
      <span className={`font-display text-[2.8rem] uppercase leading-none ${textColor}`}>
        Flam&apos;s
      </span>
      {showImage ? (
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-contain"
          src={sources[sourceIndex]}
          onError={() => {
            if (sourceIndex < sources.length - 1) {
              setSourceIndex(sourceIndex + 1);
              return;
            }
            setShowImage(false);
          }}
        />
      ) : null}
    </span>
  );
}
