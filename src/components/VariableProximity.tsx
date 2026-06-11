"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./VariableProximity.module.css";

type Falloff = "linear" | "exponential" | "gaussian";

type VariableProximityProps = {
  label: string;
  className?: string;
  radius?: number;
  falloff?: Falloff;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
};

function parseSettings(settings: string) {
  return new Map(
    settings.split(",").map((setting) => {
      const [name, value] = setting.trim().split(" ");
      return [name.replace(/['"]/g, ""), Number.parseFloat(value)];
    }),
  );
}

export function VariableProximity({
  label,
  className = "",
  radius = 150,
  falloff = "gaussian",
  fromFontVariationSettings = "'wght' 220, 'wdth' 86, 'GRAD' -150, 'opsz' 14",
  toFontVariationSettings = "'wght' 1000, 'wdth' 112, 'GRAD' 150, 'opsz' 100",
}: VariableProximityProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef<number | null>(null);

  const settings = useMemo(() => {
    const from = parseSettings(fromFontVariationSettings);
    const to = parseSettings(toFontVariationSettings);

    return Array.from(from.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: to.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const updateLetters = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const { x, y } = pointerRef.current;

    letterRefs.current.forEach((letter) => {
      if (!letter) return;

      const rect = letter.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - containerRect.left;
      const centerY = rect.top + rect.height / 2 - containerRect.top;
      const distance = Math.hypot(x - centerX, y - centerY);
      const normalized = Math.min(Math.max(1 - distance / radius, 0), 1);
      const strength =
        falloff === "gaussian"
          ? Math.exp(-((distance / (radius / 2)) ** 2) / 2)
          : falloff === "exponential"
            ? normalized ** 2
            : normalized;
      const weightAxis = settings.find(({ axis }) => axis === "wght");
      const weight = weightAxis
        ? weightAxis.fromValue +
          (weightAxis.toValue - weightAxis.fromValue) * strength
        : 400 + strength * 600;

      letter.style.fontVariationSettings = settings
        .map(
          ({ axis, fromValue, toValue }) =>
            `'${axis}' ${fromValue + (toValue - fromValue) * strength}`,
        )
        .join(", ");
      letter.style.fontWeight = `${Math.round(weight)}`;
      letter.style.webkitTextStroke = `${strength * 0.65}px currentColor`;
      letter.style.transform = `scale(${1 + strength * 0.06}, ${1 + strength * 0.025})`;
      letter.style.color = `color-mix(in srgb, currentColor ${100 - strength * 45}%, #e79a19 ${strength * 45}%)`;
    });

    frameRef.current = requestAnimationFrame(updateLetters);
  }, [falloff, radius, settings]);

  useEffect(() => {
    const updatePointer = (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      pointerRef.current = { x: clientX - rect.left, y: clientY - rect.top };
    };
    const handleMouseMove = (event: MouseEvent) =>
      updatePointer(event.clientX, event.clientY);
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    frameRef.current = requestAnimationFrame(updateLetters);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [updateLetters]);

  let letterIndex = 0;

  return (
    <div
      className={styles.container}
      ref={containerRef}
    >
      <span aria-hidden="true" className={`${styles.text} ${className}`}>
        {label.split(" ").map((word, wordIndex, words) => (
          <span className={styles.word} key={`${word}-${wordIndex}`}>
            {word.split("").map((letter) => {
              const currentIndex = letterIndex++;
              return (
                <motion.span
                  className={styles.letter}
                  key={currentIndex}
                  ref={(element) => {
                    letterRefs.current[currentIndex] = element;
                  }}
                  style={{
                    fontVariationSettings: fromFontVariationSettings,
                    fontWeight: 220,
                  }}
                >
                  {letter}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 ? "\u00a0" : null}
          </span>
        ))}
      </span>
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
}
