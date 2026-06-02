type VisualPlaceholderProps = {
  label: string;
  tone?: string;
  className?: string;
  src?: string;
  alt?: string;
  imageClassName?: string;
};

export function VisualPlaceholder({
  label,
  tone = "from-wine via-cacao to-ember",
  className = "",
  src,
  alt,
  imageClassName = "",
}: VisualPlaceholderProps) {
  return (
    <div
      className={`texture clip-visual relative min-h-[360px] overflow-hidden rounded-sm ${className}`}
      style={{ background: toneBackground(tone) }}
    >
      {src ? (
        <img
          alt={alt ?? label}
          className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`}
          loading="lazy"
          src={src}
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,247,223,.18),transparent_24%),linear-gradient(180deg,rgba(17,16,13,.05),rgba(17,16,13,.36))]" />
      <div className="absolute bottom-5 left-5 rounded-full border border-bone/35 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-bone">
        {label}
      </div>
    </div>
  );
}

function toneBackground(tone: string) {
  const colors: Record<string, string> = {
    wine: "#65131a",
    cacao: "#2a1511",
    ember: "#ef3c19",
    saffron: "#f3b12a",
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
