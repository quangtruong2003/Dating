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
      return {
        ...state,
        step: Math.min(state.step + 1, 6) as AppState["step"],
      };
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

// ─── Image with fallback hook ──────────────────────────────
function useImageFallback(primarySrc: string, fallback: string) {
  const [src, setSrc] = useState(primarySrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(primarySrc);
    setFailed(false);
  }, [primarySrc]);

  const handleError = useCallback(() => {
    if (!failed) {
      setSrc(fallback);
      setFailed(true);
    }
  }, [failed]);

  return { src, handleError };
}

// ─── Emoji Grid Selector ──────────────────────────────────
function EmojiGrid({
  options,
  selected,
  onSelect,
  onNext,
}: {
  options: { emoji: string; label: string }[];
  selected: string;
  onSelect: (v: string) => void;
  onNext: () => void;
}) {
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");

  // Reset custom mode/value when options change (step transition)
  useEffect(() => {
    setCustomMode(false);
    setCustomValue("");
  }, [options]);

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onSelect(customValue.trim());
      setCustomValue("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 px-8 pb-10 text-center">
      <div className="grid grid-cols-3 gap-3 w-full">
        {options.map((opt) => {
          const isSelected = selected === opt.label;
          return (
            <button
              key={opt.label}
              onClick={() => {
                setCustomMode(false);
                onSelect(opt.label);
              }}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${
                isSelected
                  ? "border-pink-500 bg-pink-50 shadow-lg shadow-pink-200 scale-105"
                  : "border-pink-100 bg-white hover:border-pink-300 hover:bg-pink-50"
              }`}
            >
              <span className="text-4xl">{opt.emoji}</span>
              <span className="text-xs font-medium text-gray-600 leading-tight">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setCustomMode(!customMode)}
        className={`w-full py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
          customMode
            ? "border-pink-400 bg-pink-50 text-pink-600"
            : "border-pink-100 bg-white text-pink-500 hover:border-pink-300 hover:bg-pink-50"
        }`}
      >
        {customMode ? "✕ Đóng" : "✨ Tự chọn"}
      </button>

      {customMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full"
        >
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium text-gray-600">
              Nhập ý kiến riêng của em nhé:
            </p>
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="VD: Cơm tấm, phở..."
              className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-gray-700 text-sm bg-white transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCustomSubmit();
              }}
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customValue.trim()}
              className={`w-full py-2 rounded-xl font-semibold text-sm transition-all ${
                customValue.trim()
                  ? "bg-pink-500 hover:bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              Chọn
            </button>
          </div>
        </motion.div>
      )}

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

// ─── Step 1: Will You Date Me? ────────────────────────────
function Step1({ onYes }: { onYes: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(hover: none)").matches);
  }, []);

  const escapeNoButton = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const maxX = window.innerWidth - el.offsetWidth - 32;
    const maxY = window.innerHeight - el.offsetHeight - 32;
    const x = Math.max(16, Math.random() * maxX);
    const y = Math.max(16, Math.random() * maxY);
    el.style.position = "fixed";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = "none";
    el.style.zIndex = "999";
  }, []);

  const { src: imgSrc, handleError: handleImgError } = useImageFallback(
    "https://i.imgflip.com/1bij.jpg",
    ""
  );

  return (
    <div className="flex flex-col items-center gap-6 px-8 pb-10 text-center">
      {imgSrc ? (
        <div className="w-full max-w-xs mx-auto">
          <img
            src={imgSrc}
            alt="Shrek"
            className="w-full rounded-2xl shadow-lg"
            onError={handleImgError}
          />
        </div>
      ) : (
        <span className="text-[80px]">🧅</span>
      )}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
        Trân yêu dấu sẽ đi chơi với tôi chứ?
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
          onMouseEnter={isMobile ? undefined : escapeNoButton}
          onClick={isMobile ? escapeNoButton : undefined}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full text-lg transition-all active:scale-95"
        >
          Không
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: You Said Yes! ─────────────────────────────────
function Step2({ onNext }: { onNext: () => void }) {
  const { src: imgSrc, handleError: handleImgError } = useImageFallback(
    "https://i.imgflip.com/2kuv08.jpg",
    ""
  );

  return (
    <div className="flex flex-col items-center gap-6 px-8 pb-10 text-center">
      {imgSrc ? (
        <div className="w-full max-w-xs mx-auto">
          <img
            src={imgSrc}
            alt="Happy"
            className="w-full rounded-2xl shadow-lg"
            onError={handleImgError}
          />
        </div>
      ) : (
        <div className="text-6xl">🎉🎊</div>
      )}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          Trân yêu dấu thực sự đã nói có
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Em đã sẵn sàng. Để anh nói không đã không kịp nữa rồi!
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

// ─── Step 3: When Are You Free? ────────────────────────────
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
        Khi nào anh rảnh nhỉ?
      </h2>
      <p className="text-gray-500 text-sm -mt-2">
        Chọn ngày và giờ anh muốn đi hẹn nhé 💘
      </p>
      <div className="flex flex-col gap-4 w-full">
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            📅 Ngày
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none text-gray-700 font-medium transition-colors bg-white"
          />
        </div>
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            🕐 Giờ
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => onTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none text-gray-700 font-medium transition-colors bg-white"
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

// ─── Step 4: What Do You Want to Eat? ──────────────────────
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
    <>
      <div className="px-8 pt-2 pb-0 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Anh muốn ăn gì nào?
        </h2>
      </div>
      <EmojiGrid
        options={FOOD_OPTIONS}
        selected={selected}
        onSelect={onSelect}
        onNext={onNext}
      />
    </>
  );
}

// ─── Step 5: What&apos;s Your Vibe? ─────────────────────────
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
    <>
      <div className="px-8 pt-2 pb-0 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Sự rung cảm của anh là gì?
        </h2>
      </div>
      <EmojiGrid
        options={ACTIVITY_OPTIONS}
        selected={selected}
        onSelect={onSelect}
        onNext={onNext}
      />
    </>
  );
}

// ─── Step 6: Summary & Send ────────────────────────────────
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
  const { src: imgSrc, handleError: handleImgError } = useImageFallback(
    "https://i.imgflip.com/4t0m5.jpg",
    ""
  );

  const formatDate = (d: string) => {
    if (!d) return "—";
    const [year, month, day] = d.split("-");
    return `${day}/${month}/${year}`;
  };

  const foodObj = FOOD_OPTIONS.find((f) => f.label === state.food);
  const activityObj = ACTIVITY_OPTIONS.find((a) => a.label === state.activity);
  const isCustomFood = !FOOD_OPTIONS.some((f) => f.label === state.food);
  const isCustomActivity = !ACTIVITY_OPTIONS.some((a) => a.label === state.activity);

  return (
    <div className="flex flex-col items-center gap-5 px-8 pb-10 text-center">
      {imgSrc ? (
        <div className="w-full max-w-xs mx-auto">
          <img
            src={imgSrc}
            alt="Cute cat"
            className="w-full rounded-2xl shadow-lg"
            onError={handleImgError}
          />
        </div>
      ) : (
        <span className="text-[80px]">🐱</span>
      )}

      <div>
        <p className="text-xl font-bold text-gray-800">I got you babe.</p>
        <p className="text-pink-500 font-semibold mt-1">
          Hãy sẵn sàng, em sẽ đến đón anh!
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
          {isCustomFood && (
            <span className="text-xs text-pink-400 ml-1">(tự chọn)</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-lg">{activityObj?.emoji || "🎯"}</span>
          <span className="font-medium">Hoạt động:</span>
          <span>{state.activity || "—"}</span>
          {isCustomActivity && (
            <span className="text-xs text-pink-400 ml-1">(tự chọn)</span>
          )}
        </div>
      </div>

      {sent ? (
        <div className="w-full py-3 bg-green-100 text-green-700 font-bold rounded-full text-lg text-center">
          Đã gửi! 💌
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onSend}
            disabled={sending}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full text-lg shadow-lg shadow-pink-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? "Đang gửi..." : "Gửi lời mời 💌"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────
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

  const stepComponents: Record<number, React.ReactNode> = {
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
