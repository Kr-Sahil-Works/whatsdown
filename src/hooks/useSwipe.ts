"use client";

import { useRef } from "react";

type SwipeOptions = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  distance?: number;
  velocity?: number;
};

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  distance = 60,
  velocity = 0.5,
}: SwipeOptions) {
  const startX = useRef(0);
  const startTime = useRef(0);

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
    startTime.current = Date.now();
  }

  function onTouchEnd(e: React.TouchEvent) {
    const endX = e.changedTouches[0].clientX;
    const endTime = Date.now();

    const dx = startX.current - endX;
    const dt = endTime - startTime.current;

    const speed = Math.abs(dx) / dt; // px per ms

    // Swipe LEFT
    if (dx > distance || speed > velocity) {
      onSwipeLeft?.();
    }

    // Swipe RIGHT
    if (dx < -distance || speed > velocity) {
      onSwipeRight?.();
    }
  }

  return { onTouchStart, onTouchEnd };
}
