"use client";

import { useMemo } from "react";

const HEART_SIZES = [16, 20, 24, 28, 32, 36, 40];

export default function HeartBackground() {
  const hearts = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: HEART_SIZES[Math.floor(Math.random() * HEART_SIZES.length)],
      opacity: 0.08 + Math.random() * 0.2,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * -20,
      color: ["#ec4899", "#f472b6", "#f9a8d4", "#fb7185"][
        Math.floor(Math.random() * 4)
      ],
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-pink-100 to-white" />
      {hearts.map((h) => (
        <div
          key={h.id}
          className="heart-float"
          style={{
            left: `${h.left}%`,
            bottom: `-${h.size}px`,
            width: h.size,
            height: h.size,
            opacity: h.opacity,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            color: h.color,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="100%"
            height="100%"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
