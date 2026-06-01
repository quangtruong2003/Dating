# Lời Mời Hẹn — Design Specification

**Date:** 2026-06-01
**Status:** Approved

---

## 1. Concept & Vision

Một interactive date invitation app với phong cách Playful & Cute, tạo cảm giác như nhận được một lời mời từ crush. Ứng dụng dẫn người dùng qua 6 bước wizard — từ meme vui nhộn đến tổng hợp kế hoạch hẹn hò — rồi gửi kết quả qua Telegram. Tất cả diễn ra trong một trang Next.js đơn giản, không có backend database, deploy trên Vercel.

---

## 2. Tech Stack

- **Next.js 14+** (App Router, TypeScript)
- **Tailwind CSS** (styling)
- **Framer Motion** (step transitions)
- **Telegram Bot API** via Next.js API Route (serverless)
- **Google Fonts:** Quicksand

**No database, no auth, no external state management.** All state lives in React.

---

## 3. File Structure

```
src/
├── app/
│   ├── page.tsx                  # Main wizard: all 6 steps
│   ├── layout.tsx                # Root layout, fonts, metadata
│   ├── globals.css               # Tailwind + custom CSS
│   └── api/
│       └── send-telegram/
│           └── route.ts          # POST: send message to Telegram
├── components/
│   ├── HeartBackground.tsx       # 15-20 floating hearts, CSS keyframes
│   ├── WizardCard.tsx            # Centered card wrapper
│   └── StepProgress.tsx          # Step indicator (6 dots)
└── lib/
    ├── types.ts                  # TypeScript types
    └── telegram.ts               # Telegram API helper
```

---

## 4. Design Language

### Colors
- Background: `pink-50` → `pink-100` → white gradient
- Card: white, `rounded-2xl`, `shadow-xl` with pink glow
- Primary accent: `pink-500`
- Text: `gray-800` (dark), `gray-500` (muted)

### Typography
- Font family: **Quicksand** (Google Fonts)
- Headings: bold, gradient pink-to-rose text
- Body: medium weight, readable

### Visual Style
- Playful & Cute: large rounded corners, soft shadows, bubbly feel
- Kawaii-inspired: glowing effects, bouncy transitions
- Mobile-first: full-height card, touch-friendly targets (min 44px)

---

## 5. Component Details

### HeartBackground
- 15-20 hearts floating on a pink gradient background
- Each heart: random size (16-40px), random opacity (0.1-0.3), random position
- CSS `@keyframes` animation: float upward, gentle rotation, infinite loop
- Pure CSS — no JS animation library

### WizardCard
- Centered on screen, `max-w-md`, full-height on mobile
- White background, `rounded-2xl`, `shadow-xl`
- Pink glow border: `box-shadow: 0 0 40px rgba(236, 72, 153, 0.15)`
- Contains progress dots + step content

### StepProgress
- 6 dots at top of card
- Active dot: `pink-500`, scaled up
- Inactive: `gray-300`
- Current step label below dots

### Step Transitions
- `AnimatePresence` from Framer Motion
- Enter: fade in + slide from right
- Exit: fade out + slide to left
- Duration: 300ms, `easeInOut`

---

## 6. The 6 Steps

### Step 1: "Will You Date Me?"
- **Content:** Meme image (Shrek) + text "Trân yêu dấu sẽ hẹn hò với tôi chứ?"
- **Image:** URL from internet (Imgflip/Giphy), fallback to large Shrek emoji if load fails
- **Buttons:**
  - "Có" → Step 2 (pink, large, bouncy hover)
  - "Không" → runs away (see behavior below)
- **"Không" button behavior:**
  - Desktop (hover): translates to random position within viewport bounds, clamped to stay visible
  - Mobile (touch/click): same random translate on each tap
  - Uses `useCallback` + viewport dimensions to compute valid bounds
  - Smooth CSS transition on transform

### Step 2: "You Said Yes!"
- **Content:** Happy meme image, text "Trân yêu dấu thực sự đã nói có, tôi đã sẵn sàng. Để Trân yêu dấu nói không đã không kịp nữa rồi!"
- **Image:** URL from internet, fallback to emoji celebration
- **Button:** "Tiếp theo" → Step 3
- **Confetti effect** triggers on entering this step

### Step 3: "When Are You Free?"
- **Content:** "Khi nào Trân yêu dấu rảnh?"
- **Inputs:**
  - Date picker (native `<input type="date">`, styled with Tailwind)
  - Time picker (native `<input type="time">`, styled)
- **Button:** "Tiếp theo" (disabled until both date and time selected) → Step 4
- **State saved:** `date`, `time`

### Step 4: "What Do You Want to Eat?"
- **Content:** "Chúng ta ăn gì nào?"
- **Emoji grid (3 columns):** 🍔 🍣 🍝 🌮 🍕
- **Selection:** Single-select, selected item gets pink border + pink background
- **Button:** "Tiếp theo" → Step 5
- **State saved:** `food`

### Step 5: "What's Your Vibe?"
- **Content:** "Sự rung cảm của Trân yêu dấu là gì?"
- **Emoji grid (3 columns):** 🏌️ 🚶 🎬 🎢 🏖️
- **Selection:** Single-select, selected item gets pink border + pink background
- **Button:** "Tiếp theo" → Step 6
- **State saved:** `activity`

### Step 6: Summary & Send
- **Content:**
  - Cute cat image (URL from internet, fallback to 🐱 emoji)
  - Text: "I got you girl. Hãy sẵn sàng, tôi sẽ đến đón Trân yêu dấu!"
  - Summary card showing: date, time, food, activity
- **Button:** "Gửi lời mời 💌" → calls Telegram API
- **On success:** Confetti effect + "Đã gửi! 💌" message
- **On error:** Toast "Gửi thất bại 😢" + retry button

---

## 7. State Management

```typescript
type AppState = {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  date: string;     // "YYYY-MM-DD"
  time: string;     // "HH:MM"
  food: string;     // emoji label
  activity: string; // emoji label
};

// Initial state
const initialState: AppState = {
  step: 1,
  date: '',
  time: '',
  food: '',
  activity: '',
};
```

Use `useReducer` for clean state transitions. Step 1 and 2 don't modify state.

---

## 8. Telegram Integration

### API Route: `POST /api/send-telegram`

**Request body:**
```json
{
  "date": "2026-06-14",
  "time": "19:00",
  "food": "Pizza 🍕",
  "activity": "Xem phim 🎬"
}
```

**Response (success):**
```json
{ "ok": true }
```

**Response (error):**
```json
{ "ok": false, "error": "message" }
```

**Telegram message format:**
```
💌 Lời mời hẹn!
📅 Ngày: 14/06/2026
🕐 Giờ: 19:00
🍕 Ăn: Pizza
🎬 Hoạt động: Xem phim
```

### Environment Variables
```
TELEGRAM_BOT_TOKEN=8696541424:AAFAfG24rdCzZe5qJ3OYVRrFpprF5erwtZY
TELEGRAM_CHAT_ID=1085005193
```

---

## 9. Image Strategy

| Step | Primary | Fallback |
|------|---------|----------|
| Step 1 | Shrek meme from Imgflip/Giphy | Large 🧅 Shrek emoji |
| Step 2 | Happy celebration meme | 🎉🎊 celebration emojis |
| Step 6 | Cute cat image | Large 🐱 cat emoji |

Each `<img>` tag includes `onError` handler that swaps to emoji.

---

## 10. Error Handling

- **Telegram API fails:** Show error toast + retry button
- **Image load fails:** Swap to emoji fallback automatically
- **Step 3 incomplete:** "Tiếp theo" button is visually disabled and non-clickable
- **Mobile hover detection:** `@media (hover: none)` for touch devices — only click handler active for "Không" button

---

## 11. Deployment

- **Platform:** Vercel
- **GitHub:** Push code, connect repo in Vercel dashboard
- **Env vars:** Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in Vercel project settings
- **Build:** `next build` handles everything, API route deploys as serverless function

---

## 12. Acceptance Criteria

- [ ] Desktop: hover "Không" → button escapes to random position
- [ ] Mobile: tap "Không" → button escapes to random position
- [ ] All 6 steps navigate correctly with smooth transitions
- [ ] Step 3: date and time must both be selected before proceeding
- [ ] Step 4: food selection is required before proceeding
- [ ] Step 5: activity selection is required before proceeding
- [ ] Step 6: displays all collected data correctly
- [ ] Telegram message sent on submit
- [ ] Telegram error handled gracefully with retry
- [ ] Heart background animates smoothly
- [ ] Confetti fires on Step 2 and Step 6
- [ ] Fully responsive on mobile (375px and up)
- [ ] Deployed on Vercel successfully
