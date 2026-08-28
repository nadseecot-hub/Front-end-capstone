"use client";

import { useEffect, useState } from "react";

export default function CountUp({ value, suffix = "", duration = 900 }: { value: number; suffix?: string; duration?: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => { let frame = 0; const start = performance.now(); const tick = (now: number) => { const progress = Math.min((now - start) / duration, 1); const eased = 1 - Math.pow(1 - progress, 3); setCurrent(Math.round(value * eased)); if (progress < 1) frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame); }, [value, duration]);
  return <span aria-label={`${value.toLocaleString()}${suffix}`}>{current.toLocaleString()}{suffix}</span>;
}
