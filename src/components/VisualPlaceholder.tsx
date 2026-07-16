"use client";

import { useEffect, useState } from "react";

type VisualPlaceholderProps = {
  label: string;
  tone?: string;
  className?: string;
  src?: string;
  alt?: string;
  imageClassName?: string;
  clipped?: boolean;
  showLabel?: boolean;
};

export function VisualPlaceholder({
  label,
  tone = "from-wine via-cacao to-ember",
  className = "",
  src,
  alt,
  imageClassName = "",
  clipped = true,
  showLabel = true,
}: VisualPlaceholderProps) {
  const [imageLoaded, setImageLoaded] = useState(Boolean(src));

  useEffect(() => {
    setImageLoaded(Boolean(src));
  }, [src]);

  return (
    <div
      className={`texture relative min-h-[360px] overflow-hidden rounded-sm ${
        clipped ? "clip-visual" : ""
      } ${className}`}
      style={{ background: toneBackground(tone) }}
    >
      {src && imageLoaded ? (
        <img
          alt={alt ?? label}
          className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`}
          loading="lazy"
          onError={() => setImageLoaded(false)}
          src={src}
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,247,223,.18),transparent_24%),linear-gradient(180deg,rgba(17,16,13,.05),rgba(17,16,13,.36))]" />
      {showLabel ? (
        <div className="absolute bottom-5 left-5 rounded-full border border-bone/35 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-bone">
          {label}
        </div>
      ) : null}
    </div>
  );
}

function toneBackground(tone: string) {
  const colors: Record<string, string> = {
    wine: "#65131a",
    cacao: "#2a1511",
    ember: "#f8af07",
    saffron: "#f8af07",
    bone: "#fff7df",
    ink: "#11100d",
  };
  const stops = tone
    .split(" ")
    .map((part) => part.replace(/^from-|^via-|^to-/, ""))
    .map((token) => colors[token])
    .filter(Boolean);

  const palette = stops.length >= 2 ? stops : [colors.wine, colors.cacao, colors.ember];
  return `linear-gradient(135deg, ${palette.join(", ")})`;
}
