"use client";

import { useEffect, useRef } from "react";

import styles from "./horizontal-dragon.module.css";

const dragonSrc =
  "/assets/PNG/2025-09-FLAMS-Valise-Logo_ILLU-DRAGON-BDX.png";

export function HorizontalDragon() {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragonRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const dragon = dragonRef.current;
    const shadow = shadowRef.current;
    const cursor = cursorRef.current;
    if (!stage || !dragon || !shadow || !cursor) return;

    let frame = 0;
    let holding = false;
    let pointerVisible = false;
    let pointerX = 0;
    let pointerY = 0;
    let x = 0;
    let y = 0;
    let anchorX = 0;
    let anchorY = 0;
    let velocityX = 0;
    let velocityY = 0;
    const startedAt = performance.now();

    const dragonSize = () =>
      Math.max(150, Math.min(260, stage.clientWidth * 0.18));

    const clampPosition = (nextX: number, nextY: number) => {
      const size = dragonSize();
      const side = size * 0.48 + 12;
      const top = Math.max(size * 0.48 + 18, 112);
      const bottom = size * 0.48 + 22;

      return {
        x: Math.min(Math.max(nextX, side), stage.clientWidth - side),
        y: Math.min(Math.max(nextY, top), stage.clientHeight - bottom),
      };
    };

    const resetPosition = () => {
      const initial = clampPosition(
        stage.clientWidth * 0.72,
        stage.clientHeight * 0.52,
      );
      x = initial.x;
      y = initial.y;
      anchorX = initial.x;
      anchorY = initial.y;
    };

    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = stage.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
      pointerVisible = true;
      cursor.classList.add(styles.visible);
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      updatePointer(event);
      holding = true;
      stage.setPointerCapture(event.pointerId);
      cursor.classList.add(styles.pressed);
    };

    const onPointerUp = (event: PointerEvent) => {
      holding = false;
      anchorX = x;
      anchorY = y;
      cursor.classList.remove(styles.pressed);
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
    };

    const onPointerLeave = () => {
      holding = false;
      pointerVisible = false;
      anchorX = x;
      anchorY = y;
      cursor.classList.remove(styles.visible, styles.pressed);
    };

    const animate = (now: number) => {
      const elapsed = (now - startedAt) / 1000;
      const orbitX = Math.min(stage.clientWidth * 0.14, 135);
      const orbitY = Math.min(stage.clientHeight * 0.1, 72);
      let targetX =
        anchorX + Math.cos(elapsed * 0.55) * orbitX + Math.sin(elapsed) * 18;
      let targetY =
        anchorY + Math.sin(elapsed * 0.72) * orbitY + Math.cos(elapsed) * 10;

      if (holding && pointerVisible) {
        targetX = pointerX + 48;
        targetY = pointerY - 36;
      }

      const target = clampPosition(targetX, targetY);
      velocityX += (target.x - x) * (holding ? 0.035 : 0.012);
      velocityY += (target.y - y) * (holding ? 0.035 : 0.012);
      velocityX *= holding ? 0.84 : 0.91;
      velocityY *= holding ? 0.84 : 0.91;
      x += velocityX;
      y += velocityY;

      const tilt = Math.max(-7, Math.min(7, velocityX * 0.24));
      dragon.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
      shadow.style.transform = `translate3d(${x}px, ${Math.min(y + dragonSize() * 0.4, stage.clientHeight - 18)}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(animate);
    };

    resetPosition();
    stage.addEventListener("pointermove", updatePointer);
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resetPosition);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", updatePointer);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resetPosition);
    };
  }, []);

  return (
    <div ref={stageRef} className={styles.stage} aria-hidden="true">
      <div ref={shadowRef} className={styles.shadow} />
      <div ref={dragonRef} className={styles.dragon}>
        <div className={styles.float}>
          <img
            className={styles.mascot}
            src={dragonSrc}
            alt=""
            draggable={false}
          />
        </div>
      </div>
      <div ref={cursorRef} className={styles.cursor} />
    </div>
  );
}
