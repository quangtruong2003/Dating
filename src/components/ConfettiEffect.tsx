"use client";

import { useEffect, useMemo } from "react";

const COLORS = ["#ec4899", "#f472b6", "#f9a8d4", "#fb7185", "#fbbf24", "#f97316"];

interface ConfettiEffectProps {
  active: boolean;
  onDone?: () => void;
}

export default function ConfettiEffect({ active, onDone }: ConfettiEffectProps) {
  const pieces = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 1.5 + Math.random() * 2,
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? ("circle" as const) : ("square" as const),
    }));
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => onDone?.(), 4000);
    return () => clearTimeout(timer);
  }, [active, onDone]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
