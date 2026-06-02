"use client";

import { useState } from "react";

type BrandLogoProps = {
  tone?: "cream" | "bordeaux";
  className?: string;
};

export function BrandLogo({ tone = "cream", className = "" }: BrandLogoProps) {
  const [showImage, setShowImage] = useState(true);
  const src = tone === "cream" ? "/assets/flams/logo-beige.png" : "/assets/flams/logo-bdx.png";
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
          src={src}
          onError={() => setShowImage(false)}
        />
      ) : null}
    </span>
  );
}
