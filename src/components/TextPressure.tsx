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
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
};

type FontAxis = {
  axis: string;
  fromValue: number;
  toValue: number;
};

const fromFontVariationSettings = "'wght' 180, 'opsz' 8";
const toFontVariationSettings = "'wght' 1000, 'opsz' 80";

function parseFontVariationSettings(fromSettings: string, toSettings: string) {
  const parseSettings = (settings: string) =>
    new Map(
      settings
        .split(",")
        .map((setting) => setting.trim())
        .map((setting) => {
          const [name, value] = setting.split(" ");
          return [name.replace(/['"]/g, ""), Number.parseFloat(value)];
        }),
    );

  const from = parseSettings(fromSettings);
  const to = parseSettings(toSettings);

  return Array.from(from.entries()).map<FontAxis>(([axis, fromValue]) => ({
    axis,
    fromValue,
    toValue: to.get(axis) ?? fromValue,
  }));
}

function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function falloffValue(distanceFromPointer: number, radius: number, falloff: TextPressureProps["falloff"]) {
  const normalized = Math.min(Math.max(1 - distanceFromPointer / radius, 0), 1);

  if (falloff === "exponential") return normalized ** 2;
  if (falloff === "gaussian") {
    return Math.exp(-((distanceFromPointer / (radius / 2)) ** 2) / 2);
  }

  return normalized;
}

export function TextPressure({
  text = "Strasbourg",
  fontFamily = "Roboto Flex",
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
  radius = 220,
  falloff = "linear",
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const mousePositionRef = useRef<Point>({ x: 0, y: 0 });
  const lastPositionRef = useRef<Point>({ x: -1, y: -1 });
  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);
  const characters = useMemo(() => Array.from(text), [text]);
  const parsedSettings = useMemo(
    () => parseFontVariationSettings(fromFontVariationSettings, toFontVariationSettings),
    [],
  );

  useEffect(() => {
    const updatePosition = (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      mousePositionRef.current = rect
        ? { x: clientX - rect.left, y: clientY - rect.top }
        : { x: clientX, y: clientY };
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mousePositionRef.current = { x: rect.width / 2, y: rect.height / 2 };
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    if (!container || !title) return;

    const { width: containerWidth, height: containerHeight } =
      container.getBoundingClientRect();
    setFontSize(Math.max(containerWidth / (characters.length * 0.68), minFontSize));
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
      const container = containerRef.current;
      if (!container) {
        frame = requestAnimationFrame(animate);
        return;
      }

      const mouse = mousePositionRef.current;
      if (lastPositionRef.current.x === mouse.x && lastPositionRef.current.y === mouse.y) {
        frame = requestAnimationFrame(animate);
        return;
      }
      lastPositionRef.current = { ...mouse };

      const containerRect = container.getBoundingClientRect();

      letterRefs.current.forEach((letter) => {
        if (!letter) return;

        const rect = letter.getBoundingClientRect();
        const letterCenter = {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
        const letterDistance = distance(mouse, letterCenter);

        if (letterDistance >= radius) {
          letter.style.fontVariationSettings = fromFontVariationSettings;
          letter.style.opacity = "1";
          letter.style.transform = "scale(1)";
          return;
        }

        const amount = falloffValue(letterDistance, radius, falloff);
        const settings = parsedSettings
          .filter(({ axis }) => {
            if (axis === "wght") return weight;
            if (axis === "wdth") return width;
            if (axis === "ital") return italic;
            return true;
          })
          .map(({ axis, fromValue, toValue }) => {
            const value = fromValue + (toValue - fromValue) * amount;
            return `'${axis}' ${value}`;
          })
          .join(", ");

        letter.style.fontVariationSettings = settings;
        letter.style.opacity = alpha ? String(Math.max(amount, 0.25)) : "1";
        letter.style.transform = `scale(${1 + amount * 0.24})`;
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [alpha, falloff, italic, parsedSettings, radius, weight, width]);

  return (
    <div
      className={className}
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap");
      `}</style>
      <h1
        aria-label={text}
        ref={titleRef}
        style={{
          color: textColor,
          display: flex ? "flex" : "block",
          justifyContent: flex ? "space-between" : undefined,
          fontFamily: `"${fontFamily}", sans-serif`,
          fontSize,
          fontVariationSettings: fromFontVariationSettings,
          fontWeight: 180,
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
              letterRefs.current[index] = element;
            }}
            style={{
              color: stroke ? "transparent" : textColor,
              display: "inline-block",
              fontVariationSettings: fromFontVariationSettings,
              transform: "scale(1)",
              transformOrigin: "center center",
              willChange: "font-variation-settings, transform, opacity",
              WebkitTextStroke: stroke ? `2px ${strokeColor}` : undefined,
            }}
          >
            {character === " " ? "\u00a0" : character}
          </span>
        ))}
      </h1>
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {text}
      </span>
    </div>
  );
}
