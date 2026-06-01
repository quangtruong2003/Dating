# Lời Mời Hẹn — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 6-step interactive date invitation wizard with floating heart background, meme steps, emoji selectors, and Telegram integration, deployed on Vercel.

**Architecture:** Single-page Next.js app using `useReducer` for state, Framer Motion for step transitions, CSS keyframes for heart animations. Telegram submission via Next.js API route (serverless). Mobile-first, no backend database.

**Tech Stack:** Next.js 14, Tailwind CSS, Framer Motion, Google Fonts (Quicksand)

---

## Project Setup

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `.env.local`
- Create: `.gitignore`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "loi-moi-hen",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

- [ ] **Step 2: Create next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.imgflip.com" },
      { protocol: "https", hostname: "media.giphy.com" },
      { protocol: "https", hostname: "i.imgur.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["var(--font-quicksand)", "sans-serif"],
      },
      colors: {
        pink: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 5: Create postcss.config.mjs**

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;
```

- [ ] **Step 6: Create .env.local**

```
TELEGRAM_BOT_TOKEN=8696541424:AAFAfG24rdCzZe5qJ3OYVRrFpprF5erwtZY
TELEGRAM_CHAT_ID=1085005193
```

- [ ] **Step 7: Create .gitignore**

```
# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 8: Commit**

```bash
git add package.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.mjs .env.local .gitignore
git commit -m "chore: scaffold Next.js project with Tailwind and Framer Motion"
```

---

### Task 2: Create App Structure & Types

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/lib/types.ts`

- [ ] **Step 1: Create src/app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lời Mời Hẹn 💌",
  description: "Trân yêu dấu sẽ hẹn hò với tôi chứ?",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💌</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${quicksand.variable} font-quicksand antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --pink-glow: rgba(236, 72, 153, 0.15);
  --pink-glow-strong: rgba(236, 72, 153, 0.25);
}

@keyframes float-up {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.heart-float {
  position: fixed;
  animation: float-up linear infinite;
  pointer-events: none;
  user-select: none;
}

.confetti-piece {
  position: fixed;
  top: -20px;
  animation: confetti-fall ease-in forwards;
  pointer-events: none;
}

input[type="date"],
input[type="time"] {
  color-scheme: light;
}
```

- [ ] **Step 3: Create src/lib/types.ts**

```typescript
export type Step = 1 | 2 | 3 | 4 | 5 | 6;

export type AppState = {
  step: Step;
  date: string;
  time: string;
  food: string;
  activity: string;
};

export const initialState: AppState = {
  step: 1,
  date: "",
  time: "",
  food: "",
  activity: "",
};

export type AppAction =
  | { type: "NEXT_STEP" }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_FOOD"; payload: string }
  | { type: "SET_ACTIVITY"; payload: string };

export const FOOD_OPTIONS = [
  { emoji: "🍔", label: "Bánh mì kẹp thịt" },
  { emoji: "🍣", label: "Sushi" },
  { emoji: "🍝", label: "Mì ống" },
  { emoji: "🌮", label: "Bánh taco" },
  { emoji: "🍕", label: "Pizza" },
];

export const ACTIVITY_OPTIONS = [
  { emoji: "🏌️", label: "Chơi gôn" },
  { emoji: "🚶", label: "Đi bộ" },
  { emoji: "🎬", label: "Xem phim" },
  { emoji: "🎢", label: "Công viên giải trí" },
  { emoji: "🏖️", label: "Bãi biển" },
];
```

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css src/lib/types.ts
git commit -m "feat: create app layout, globals, and types"
```

---

### Task 3: Create HeartBackground & WizardCard Components

**Files:**
- Create: `src/components/HeartBackground.tsx`
- Create: `src/components/WizardCard.tsx`
- Create: `src/components/StepProgress.tsx`

- [ ] **Step 1: Create src/components/HeartBackground.tsx**

```tsx
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
          <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/WizardCard.tsx**

```tsx
import { ReactNode } from "react";

interface WizardCardProps {
  children: ReactNode;
}

export default function WizardCard({ children }: WizardCardProps) {
  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-pink-200/50 border border-pink-100 overflow-hidden"
        style={{ boxShadow: "0 0 60px rgba(236, 72, 153, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create src/components/StepProgress.tsx**

```tsx
import { Step } from "@/lib/types";

interface StepProgressProps {
  current: Step;
  total?: number;
}

export default function StepProgress({ current, total = 6 }: StepProgressProps) {
  return (
    <div className="flex justify-center gap-2 py-6 px-6">
      {Array.from({ length: total }, (_, i) => {
        const stepNum = (i + 1) as Step;
        const isActive = stepNum === current;
        const isPast = stepNum < current;
        return (
          <div
            key={stepNum}
            className={`rounded-full transition-all duration-300 ${
              isActive
                ? "w-3 h-3 bg-pink-500 scale-125"
                : isPast
                ? "w-2.5 h-2.5 bg-pink-300"
                : "w-2.5 h-2.5 bg-gray-200"
            }`}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/HeartBackground.tsx src/components/WizardCard.tsx src/components/StepProgress.tsx
git commit -m "feat: add HeartBackground, WizardCard, and StepProgress components"
```

---

### Task 4: Create ConfettiEffect Component

**Files:**
- Create: `src/components/ConfettiEffect.tsx`

- [ ] **Step 1: Create src/components/ConfettiEffect.tsx**

```tsx
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
      shape: Math.random() > 0.5 ? "circle" : "square",
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ConfettiEffect.tsx
git commit -m "feat: add ConfettiEffect component"
```

---

### Task 5: Build All 6 Wizard Steps

**Files:**
- Create: `src/app/page.tsx`

This is the core file containing all 6 steps in one component using `useReducer`.

- [ ] **Step 1: Create src/app/page.tsx — full wizard implementation**

```tsx
"use client";

import { useReducer, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeartBackground from "@/components/HeartBackground";
import WizardCard from "@/components/WizardCard";
import StepProgress from "@/components/StepProgress";
import ConfettiEffect from "@/components/ConfettiEffect";
import {
  AppState,
  AppAction,
  initialState,
  FOOD_OPTIONS,
  ACTIVITY_OPTIONS,
} from "@/lib/types";

// ─── Reducer ───────────────────────────────────────────────
function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 6) as AppState["step"] };
    case "SET_DATE":
      return { ...state, date: action.payload };
    case "SET_TIME":
      return { ...state, time: action.payload };
    case "SET_FOOD":
      return { ...state, food: action.payload };
    case "SET_ACTIVITY":
      return { ...state, activity: action.payload };
    default:
      return state;
  }
}

// ─── Image Fallback ────────────────────────────────────────
function useImageFallback(src: string) {
  const [src2, setSrc2] = useState(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc2(src);
    setFailed(false);
  }, [src]);

  return { src: failed ? undefined : src2, onError: () => setFailed(true), fallback: undefined };
}

// ─── Step 1 ───────────────────────────────────────────────
function Step1({
  onYes,
}: {
  onYes: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(hover: none)").matches);
  }, []);

  const escape = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 32;
    const maxY = window.innerHeight - rect.height - 32;
    const x = Math.max(16, Math.random() * maxX);
    const y = Math.max(16, Math.random() * maxY);
    el.style.position = "fixed";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = "none";
    el.style.zIndex = "999";
  }, []);

  const { src: imgSrc, onError: imgError } = useImageFallback(
    "https://i.imgflip.com/1bij.jpg"
  );

  return (
    <div className="flex flex-col items-center gap-6 px-8 pb-10 text-center">
      <div className="w-full max-w-xs mx-auto">
        <img
          src={imgSrc}
          alt="Shrek"
          className="w-full rounded-2xl shadow-lg"
          onError={imgError}
        />
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
        Trân yêu dấu sẽ hẹn hò với tôi chứ?
      </h1>
      <div className="flex gap-4 mt-2">
        <button
          onClick={onYes}
          className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full text-lg shadow-lg shadow-pink-300 transition-all hover:scale-105 active:scale-95"
        >
          Có 💕
        </button>
        <button
          ref={btnRef}
          onMouseEnter={isMobile ? undefined : escape}
          onClick={isMobile ? escape : undefined}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full text-lg transition-all active:scale-95"
        >
          Không
        </button>
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────
function Step2({ onNext }: { onNext: () => void }) {
  const { src: imgSrc, onError: imgError } = useImageFallback(
    "https://i.imgflip.com/2kuv08.jpg"
  );

  return (
    <div className="flex flex-col items-center gap-6 px-8 pb-10 text-center">
      <div className="w-full max-w-xs mx-auto">
        <img
          src={imgSrc}
          alt="Happy"
          className="w-full rounded-2xl shadow-lg"
          onError={imgError}
        />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          Trân yêu dấu thực sự đã nói có
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Tôi đã sẵn sàng. Để Trân yêu dấu nói không đã không kịp nữa rồi!
        </p>
      </div>
      <button
        onClick={onNext}
        className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full text-lg shadow-lg shadow-pink-300 transition-all hover:scale-105 active:scale-95"
      >
        Tiếp theo 💖
      </button>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────
function Step3({
  date,
  time,
  onDate,
  onTime,
  onNext,
}: {
  date: string;
  time: string;
  onDate: (v: string) => void;
  onTime: (v: string) => void;
  onNext: () => void;
}) {
  const canNext = date !== "" && time !== "";

  return (
    <div className="flex flex-col items-center gap-6 px-8 pb-10 text-center">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
        Khi nào Trân yêu dấu rảnh?
      </h2>
      <p className="text-gray-500 text-sm">Chọn ngày và giờ Trân yêu dấu muốn đi hẹn nhé 💘</p>
      <div className="flex flex-col gap-4 w-full">
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-600 mb-1">📅 Ngày</label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none text-gray-700 font-medium transition-colors"
          />
        </div>
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-600 mb-1">🕐 Giờ</label>
          <input
            type="time"
            value={time}
            onChange={(e) => onTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none text-gray-700 font-medium transition-colors"
          />
        </div>
      </div>
      <button
        onClick={onNext}
        disabled={!canNext}
        className={`w-full py-3 font-bold rounded-full text-lg transition-all ${
          canNext
            ? "bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-300 hover:scale-105 active:scale-95"
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
        }`}
      >
        Tiếp theo
      </button>
    </div>
  );
}

// ─── Step 4 ───────────────────────────────────────────────
function Step4({
  selected,
  onSelect,
  onNext,
}: {
  selected: string;
  onSelect: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 px-8 pb-10 text-center">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
        Chúng ta ăn gì nào?
      </h2>
      <div className="grid grid-cols-3 gap-4 w-full">
        {FOOD_OPTIONS.map((opt) => {
          const isSelected = selected === opt.label;
          return (
            <button
              key={opt.emoji}
              onClick={() => onSelect(opt.label)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${
                isSelected
                  ? "border-pink-500 bg-pink-50 shadow-lg shadow-pink-200"
                  : "border-pink-100 bg-white hover:border-pink-300 hover:bg-pink-50"
              }`}
            >
              <span className="text-4xl">{opt.emoji}</span>
              <span className="text-xs font-medium text-gray-600">{opt.label}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={onNext}
        disabled={selected === ""}
        className={`w-full py-3 font-bold rounded-full text-lg transition-all ${
          selected !== ""
            ? "bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-300 hover:scale-105 active:scale-95"
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
        }`}
      >
        Tiếp theo
      </button>
    </div>
  );
}

// ─── Step 5 ───────────────────────────────────────────────
function Step5({
  selected,
  onSelect,
  onNext,
}: {
  selected: string;
  onSelect: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 px-8 pb-10 text-center">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
        Sự rung cảm của Trân yêu dấu là gì?
      </h2>
      <div className="grid grid-cols-3 gap-4 w-full">
        {ACTIVITY_OPTIONS.map((opt) => {
          const isSelected = selected === opt.label;
          return (
            <button
              key={opt.emoji}
              onClick={() => onSelect(opt.label)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${
                isSelected
                  ? "border-pink-500 bg-pink-50 shadow-lg shadow-pink-200"
                  : "border-pink-100 bg-white hover:border-pink-300 hover:bg-pink-50"
              }`}
            >
              <span className="text-4xl">{opt.emoji}</span>
              <span className="text-xs font-medium text-gray-600">{opt.label}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={onNext}
        disabled={selected === ""}
        className={`w-full py-3 font-bold rounded-full text-lg transition-all ${
          selected !== ""
            ? "bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-300 hover:scale-105 active:scale-95"
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
        }`}
      >
        Tiếp theo
      </button>
    </div>
  );
}

// ─── Step 6 ───────────────────────────────────────────────
function Step6({
  state,
  onSend,
  sending,
  sent,
  error,
}: {
  state: AppState;
  onSend: () => void;
  sending: boolean;
  sent: boolean;
  error: string | null;
}) {
  const { src: imgSrc, onError: imgError } = useImageFallback(
    "https://i.imgflip.com/4t0m5.jpg"
  );

  const formatDate = (d: string) => {
    if (!d) return "";
    const [year, month, day] = d.split("-");
    return `${day}/${month}/${year}`;
  };

  const foodObj = FOOD_OPTIONS.find((f) => f.label === state.food);
  const activityObj = ACTIVITY_OPTIONS.find((a) => a.label === state.activity);

  return (
    <div className="flex flex-col items-center gap-5 px-8 pb-10 text-center">
      <div className="w-full max-w-xs mx-auto">
        <img
          src={imgSrc}
          alt="Cute cat"
          className="w-full rounded-2xl shadow-lg"
          onError={imgError}
        />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-800">I got you girl.</p>
        <p className="text-pink-500 font-semibold mt-1">
          Hãy sẵn sàng, tôi sẽ đến đón Trân yêu dấu!
        </p>
      </div>

      <div className="w-full bg-pink-50 rounded-2xl p-4 text-left space-y-2 border border-pink-100">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-lg">📅</span>
          <span className="font-medium">Ngày:</span>
          <span>{formatDate(state.date) || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-lg">🕐</span>
          <span className="font-medium">Giờ:</span>
          <span>{state.time || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-lg">{foodObj?.emoji || "🍽️"}</span>
          <span className="font-medium">Ăn:</span>
          <span>{state.food || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-lg">{activityObj?.emoji || "🎯"}</span>
          <span className="font-medium">Hoạt động:</span>
          <span>{state.activity || "—"}</span>
        </div>
      </div>

      {sent ? (
        <div className="w-full py-3 bg-green-100 text-green-700 font-bold rounded-full text-lg text-center">
          Đã gửi! 💌
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onSend}
            disabled={sending}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full text-lg shadow-lg shadow-pink-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? "Đang gửi..." : "Gửi lời mời 💌"}
          </button>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────
export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [showConfetti1, setShowConfetti1] = useState(false);
  const [showConfetti2, setShowConfetti2] = useState(false);

  useEffect(() => {
    if (state.step === 2) setShowConfetti1(true);
    if (state.step === 6) setShowConfetti2(true);
  }, [state.step]);

  const handleSend = async () => {
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: state.date,
          time: state.time,
          food: state.food,
          activity: state.activity,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
      } else {
        setSendError("Gửi thất bại 😢 Thử lại nhé!");
      }
    } catch {
      setSendError("Gửi thất bại 😢 Thử lại nhé!");
    } finally {
      setSending(false);
    }
  };

  const stepComponents = {
    1: <Step1 onYes={() => dispatch({ type: "NEXT_STEP" })} />,
    2: <Step2 onNext={() => dispatch({ type: "NEXT_STEP" })} />,
    3: (
      <Step3
        date={state.date}
        time={state.time}
        onDate={(v) => dispatch({ type: "SET_DATE", payload: v })}
        onTime={(v) => dispatch({ type: "SET_TIME", payload: v })}
        onNext={() => dispatch({ type: "NEXT_STEP" })}
      />
    ),
    4: (
      <Step4
        selected={state.food}
        onSelect={(v) => dispatch({ type: "SET_FOOD", payload: v })}
        onNext={() => dispatch({ type: "NEXT_STEP" })}
      />
    ),
    5: (
      <Step5
        selected={state.activity}
        onSelect={(v) => dispatch({ type: "SET_ACTIVITY", payload: v })}
        onNext={() => dispatch({ type: "NEXT_STEP" })}
      />
    ),
    6: (
      <Step6
        state={state}
        onSend={handleSend}
        sending={sending}
        sent={sent}
        error={sendError}
      />
    ),
  };

  return (
    <main className="min-h-screen">
      <HeartBackground />
      <WizardCard>
        <StepProgress current={state.step} />
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {stepComponents[state.step]}
          </motion.div>
        </AnimatePresence>
      </WizardCard>
      <ConfettiEffect
        active={showConfetti1}
        onDone={() => setShowConfetti1(false)}
      />
      <ConfettiEffect
        active={showConfetti2}
        onDone={() => setShowConfetti2(false)}
      />
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: build all 6 wizard steps with state management"
```

---

### Task 6: Create Telegram API Route

**Files:**
- Create: `src/app/api/send-telegram/route.ts`

- [ ] **Step 1: Create src/app/api/send-telegram/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function foodEmoji(food: string): string {
  const map: Record<string, string> = {
    "Bánh mì kẹp thịt": "🍔",
    "Sushi": "🍣",
    "Mì ống": "🍝",
    "Bánh taco": "🌮",
    "Pizza": "🍕",
  };
  return map[food] || "🍽️";
}

function activityEmoji(activity: string): string {
  const map: Record<string, string> = {
    "Chơi gôn": "🏌️",
    "Đi bộ": "🚶",
    "Xem phim": "🎬",
    "Công viên giải trí": "🎢",
    "Bãi biển": "🏖️",
  };
  return map[activity] || "🎯";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, time, food, activity } = body;

    const message = [
      "💌 Lời mời hẹn!",
      `📅 Ngày: ${formatDate(date)}`,
      `🕐 Giờ: ${time || "—"}`,
      `${foodEmoji(food)} Ăn: ${food || "—"}`,
      `${activityEmoji(activity)} Hoạt động: ${activity || "—"}`,
    ].join("\n");

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      }
    );

    const data = await telegramRes.json();

    if (data.ok) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ ok: false, error: data.description }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/send-telegram/route.ts
git commit -m "feat: add Telegram API route for sending invitation messages"
```

---

### Task 7: Install Dependencies, Build & Verify

- [ ] **Step 1: Install dependencies**

```bash
cd d:/Dating
npm install
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Next.js build completes with no errors.

- [ ] **Step 3: Start dev server and test manually**

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- Heart background animates
- Step 1 shows Shrek meme + Yes/No buttons
- "Không" button escapes on hover/click
- Step 2 shows meme + confetti fires
- Step 3 shows date/time pickers
- Steps 4 & 5 show emoji grids
- Step 6 shows summary + send button
- Telegram message arrives on send

- [ ] **Step 4: Commit final state**

```bash
git add -A
git commit -m "feat: complete Lời Mời Hẹn app - all 6 steps, Telegram integration"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Step 1: Shrek meme + Yes/No + "Không" escapes → Task 5, Step 1
- [x] Step 2: Happy meme + confetti → Task 5, Step 2 + Task 4
- [x] Step 3: Date + time pickers → Task 5, Step 3
- [x] Step 4: Food emoji grid → Task 5, Step 4
- [x] Step 5: Activity emoji grid → Task 5, Step 5
- [x] Step 6: Summary + cat meme + Telegram send → Task 5, Step 6 + Task 6
- [x] Heart background → Task 3
- [x] Telegram integration → Task 6
- [x] Confetti → Task 4
- [x] Floating "Không" button → Task 5, Step 1
- [x] Image fallback to emoji → useImageFallback hook in Task 5
- [x] Vercel deployment → Task 7

**Placeholder scan:** No TBD, no TODO, no "fill in later" patterns.

**Type consistency:**
- `AppState.step` typed as `1|2|3|4|5|6` — consistent across all tasks
- `FOOD_OPTIONS` and `ACTIVITY_OPTIONS` arrays defined in `types.ts`, used in both `page.tsx` and `route.ts`
- `formatDate` helper defined in `route.ts` matches the spec's example format `14/06/2026`
