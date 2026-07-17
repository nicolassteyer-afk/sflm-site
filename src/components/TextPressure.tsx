"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Point = { x: number; y: number };

type TextPressureProps = {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  className?: string;
  minFontSize?: number;
};

const distance = (a: Point, b: Point) =>
  Math.hypot(b.x - a.x, b.y - a.y);

const getAttribute = (
  currentDistance: number,
  maxDistance: number,
  minValue: number,
  maxValue: number,
) => {
  const value =
    maxValue - Math.abs((maxValue * currentDistance) / maxDistance);
  return Math.max(minValue, value + minValue);
};

export function TextPressure({
  text = "Strasbourg",
  fontFamily = "Compressa VF",
  fontUrl = "https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2",
  width = true,
  weight = true,
  italic = false,
  alpha = false,
  flex = false,
  stroke = false,
  scale = false,
  textColor = "#2a1511",
  strokeColor = "#ef240d",
  className = "",
  minFontSize = 36,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<Array<HTMLSpanElement | null>>([]);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const cursorRef = useRef<Point>({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);
  const characters = useMemo(() => Array.from(text), [text]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      cursorRef.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("pointermove", move);

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      mouseRef.current = center;
      cursorRef.current = center;
    }

    return () => window.removeEventListener("pointermove", move);
  }, []);

  const setSize = useCallback(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    if (!container || !title) return;

    const { width: containerWidth, height: containerHeight } =
      container.getBoundingClientRect();
    setFontSize(
      Math.max(containerWidth / (characters.length / 2), minFontSize),
    );
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      const titleHeight = titleRef.current?.getBoundingClientRect().height ?? 0;
      if (scale && titleHeight > 0) {
        const ratio = containerHeight / titleHeight;
        setScaleY(ratio);
        setLineHeight(ratio);
      }
    });
  }, [characters.length, minFontSize, scale]);

  useEffect(() => {
    let timeout = 0;
    const resize = () => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(setSize, 100);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("resize", resize);
    };
  }, [setSize]);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      mouseRef.current.x +=
        (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y +=
        (cursorRef.current.y - mouseRef.current.y) / 15;

      const title = titleRef.current;
      if (title) {
        const maxDistance = Math.max(title.getBoundingClientRect().width / 2, 1);

        spansRef.current.forEach((span) => {
          if (!span) return;
          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };
          const charDistance = distance(mouseRef.current, charCenter);
          const wdth = width
            ? Math.floor(getAttribute(charDistance, maxDistance, 5, 200))
            : 100;
          const wght = weight
            ? Math.floor(getAttribute(charDistance, maxDistance, 100, 900))
            : 400;
          const ital = italic
            ? getAttribute(charDistance, maxDistance, 0, 1).toFixed(2)
            : "0";
          const opacity = alpha
            ? getAttribute(charDistance, maxDistance, 0, 1).toFixed(2)
            : "1";
          const influence = Math.max(0, 1 - charDistance / maxDistance);
          const scaleX = width ? 1 + influence * 0.42 : 1;
          const scaleY = weight ? 1 + influence * 0.18 : 1;
          const lift = influence * -0.06;

          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`;
          span.style.fontWeight = String(wght);
          span.style.opacity = opacity;
          span.style.transform = `translateY(${lift}em) scale(${scaleX}, ${scaleY})`;
        });
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [alpha, italic, weight, width]);

  return (
    <div
      className={className}
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <style>{`
        @font-face {
          font-family: "${fontFamily}";
          src: url("${fontUrl}") format("woff2");
          font-style: normal;
          font-display: swap;
        }
      `}</style>
      <h1
        aria-label={text}
        ref={titleRef}
        style={{
          color: textColor,
          display: flex ? "flex" : "block",
          justifyContent: flex ? "space-between" : undefined,
          fontFamily,
          fontSize,
          fontWeight: 100,
          lineHeight,
          margin: 0,
          padding: "0.14em 0",
          textAlign: "center",
          textTransform: "uppercase",
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "center top",
          userSelect: "none",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        {characters.map((character, index) => (
          <span
            aria-hidden="true"
            data-char={character}
            key={`${character}-${index}`}
            ref={(element) => {
              spansRef.current[index] = element;
            }}
            style={{
              color: stroke ? "transparent" : textColor,
              display: "inline-block",
              transformOrigin: "center center",
              transition: "color 180ms ease",
              willChange: "font-variation-settings, font-weight, opacity, transform",
              WebkitTextStroke: stroke ? `2px ${strokeColor}` : undefined,
            }}
          >
            {character === " " ? "\u00a0" : character}
          </span>
        ))}
      </h1>
    </div>
  );
}
