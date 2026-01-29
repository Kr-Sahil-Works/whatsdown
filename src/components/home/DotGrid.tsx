"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";

import "./DotGrid.css";

gsap.registerPlugin(InertiaPlugin);

const throttle = (fn: Function, limit: number) => {
  let last = 0;
  return (...args: any[]) => {
    const now = performance.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
};

const hexToRgb = (hex: string) => {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m
    ? {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16)
      }
    : { r: 0, g: 0, b: 0 };
};

type Props = {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function DotGrid({
  dotSize = 4,
  gap = 18,
  baseColor = "#9CA3AF",
  activeColor = "#22C55E",
  proximity = 120,
  speedTrigger = 100,
  shockRadius = 220,
  shockStrength = 4,
  maxSpeed = 5000,
  resistance = 700,
  returnDuration = 1.2,
  className = "",
  style
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<any[]>([]);
  const pointer = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    speed: 0
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === "undefined") return null;
    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cell = dotSize + gap;
    const cols = Math.floor((width + gap) / cell);
    const rows = Math.floor((height + gap) / cell);

    const gridW = cols * cell - gap;
    const gridH = rows * cell - gap;

    const startX = (width - gridW) / 2 + dotSize / 2;
    const startY = (height - gridH) / 2 + dotSize / 2;

    dotsRef.current = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dotsRef.current.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          xOffset: 0,
          yOffset: 0,
          active: false
        });
      }
    }
  }, [dotSize, gap]);

  useEffect(() => {
    buildGrid();
    const ro = new ResizeObserver(buildGrid);
    wrapperRef.current && ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [buildGrid]);

  useEffect(() => {
    if (!circlePath) return;

    let raf: number;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x, y } = pointer.current;
      const proxSq = proximity * proximity;

      for (const d of dotsRef.current) {
        const dx = d.cx - x;
        const dy = d.cy - y;
        const distSq = dx * dx + dy * dy;

        let color = baseColor;

        if (distSq < proxSq) {
          const t = 1 - Math.sqrt(distSq) / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          color = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(d.cx + d.xOffset, d.cy + d.yOffset);
        ctx.fillStyle = color;
        ctx.fill(circlePath);
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [circlePath, proximity, baseColor, baseRgb, activeRgb]);

 useEffect(() => {
  const onMove = (e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const now = performance.now();
    const p = pointer.current;

    const dx = e.clientX - p.lastX;
    const dy = e.clientY - p.lastY;
    const dt = p.lastTime ? now - p.lastTime : 16;

    let vx = (dx / dt) * 1000;
    let vy = (dy / dt) * 1000;

    p.lastX = e.clientX;
    p.lastY = e.clientY;
    p.lastTime = now;

    p.x = e.clientX - rect.left;
    p.y = e.clientY - rect.top;

    for (const dot of dotsRef.current) {
      const dist = Math.hypot(dot.cx - p.x, dot.cy - p.y);

      if (dist < proximity && !dot._moving) {
        dot._moving = true;

        gsap.killTweensOf(dot);

        const force = 1 - dist / proximity;
        const pushX = (dot.cx - p.x) + vx * 0.01;
        const pushY = (dot.cy - p.y) + vy * 0.01;

        gsap.to(dot, {
          inertia: {
            xOffset: pushX * force,
            yOffset: pushY * force,
            resistance
          },
          onComplete: () => {
            gsap.to(dot, {
              xOffset: 0,
              yOffset: 0,
              duration: returnDuration,
              ease: "elastic.out(1,0.6)"
            });
            dot._moving = false;
          }
        });
      }
    }
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  return () => window.removeEventListener("mousemove", onMove);
}, [proximity, resistance, returnDuration]);


  return (
    <section className={`dot-grid ${className}`} style={style}>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </section>
  );
}
