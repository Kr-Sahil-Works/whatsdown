"use client";
import { useRef } from "react";

type SwipeOptions = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  distance?: number;
};

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  distance = 90, // ⬆️ harder to trigger
}: SwipeOptions) {
  const startX = useRef(0);
  const startY = useRef(0);
  const locked = useRef<"x" | "y" | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    locked.current = null;
  }

  function onTouchMove(e: React.TouchEvent) {
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startX.current);
    const dy = Math.abs(t.clientY - startY.current);

    // lock direction early
    if (!locked.current) {
      locked.current = dx > dy ? "x" : "y";
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (locked.current !== "x") return; // 🚨 ignore vertical scrolls

    const endX = e.changedTouches[0].clientX;
    const dx = startX.current - endX;

    if (dx > distance) onSwipeLeft?.();
    if (dx < -distance) onSwipeRight?.();
  }

  return { onTouchStart, onTouchMove, onTouchEnd };
}
