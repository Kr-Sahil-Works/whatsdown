"use client";

import { useRef } from "react";

type SwipeOptions = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  distance?: number;
  edgeOnly?: boolean; // 👈 new
};

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  distance = 90,        // harder to trigger
  edgeOnly = true,      // WhatsApp-like behavior
}: SwipeOptions) {
  const startX = useRef(0);
  const startY = useRef(0);
  const locked = useRef<"x" | "y" | null>(null);
  const validEdge = useRef(true);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    locked.current = null;

    // ✅ allow swipe only near screen edge (prevents chat scroll conflict)
    validEdge.current = !edgeOnly || startX.current < 24;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!validEdge.current) return;

    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startX.current);
    const dy = Math.abs(t.clientY - startY.current);

    // 🔒 lock direction early
    if (!locked.current) {
      if (dx > dy && dx > 8) locked.current = "x";
      else if (dy > dx && dy > 8) locked.current = "y";
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!validEdge.current) return;
    if (locked.current !== "x") return; // 🚫 ignore vertical scrolls

    const endX = e.changedTouches[0].clientX;
    const dx = startX.current - endX;

    if (dx > distance) onSwipeLeft?.();
    if (dx < -distance) onSwipeRight?.();
  }

  return { onTouchStart, onTouchMove, onTouchEnd };
}
