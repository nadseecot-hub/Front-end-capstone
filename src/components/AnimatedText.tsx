"use client";
import type { CSSProperties } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  staggerDelay?: number;
  initialY?: number;
}

export default function AnimatedText({ text, className = "", duration = 0.6, delay = 0, staggerDelay = 0.08, initialY = 10 }: AnimatedTextProps) {
  const parts = text.split(/(\s+)/);
  return <span className={`animated-text${className ? ` ${className}` : ""}`} aria-label={text} style={{ "--animated-duration": `${duration}s`, "--animated-delay": `${delay}s`, "--animated-stagger": `${staggerDelay}s`, "--animated-y": `${initialY}px` } as CSSProperties}>{parts.map((part, index) => part.trim() ? <span key={`${part}-${index}`} aria-hidden="true" style={{ "--animated-index": index } as CSSProperties}>{part}</span> : part)}</span>;
}
