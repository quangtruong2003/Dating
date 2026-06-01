import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

const FOOD_EMOJI: Record<string, string> = {
  "Bánh mì kẹp thịt": "🍔",
  "Sushi": "🍣",
  "Mì ống": "🍝",
  "Bánh taco": "🌮",
  "Pizza": "🍕",
};

const ACTIVITY_EMOJI: Record<string, string> = {
  "Chơi gôn": "🏌️",
  "Đi bộ": "🚶",
  "Xem phim": "🎬",
  "Công viên giải trí": "🎢",
  "Bãi biển": "🏖️",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function foodEmojiVal(food: string): string {
  return FOOD_EMOJI[food] ?? "🍽️";
}

function activityEmojiVal(activity: string): string {
  return ACTIVITY_EMOJI[activity] ?? "🎯";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, time, food, activity } = body;

    const foodLabel = food || "—";
    const activityLabel = activity || "—";

    // No parse_mode — send plain text so emoji renders correctly
    const message =
      `━━━━━━━━━━━━━━━━━\n` +
      `  💌 LỜI MỜI HẸN HÒ 💌\n` +
      `━━━━━━━━━━━━━━━━━\n\n` +
      `  ✨ Này Trân yêu dấu,\n` +
      `  Có ai đó muốn mời em đi chơi nè~\n\n` +
      `  📅  Ngày: ${formatDate(date)}\n` +
      `  🕐  Giờ:   ${time || "—"}\n\n` +
      `  🍽️  Ăn:    ${foodLabel} ${foodEmojiVal(foodLabel)}\n` +
      `  🎯  Chơi:  ${activityLabel} ${activityEmojiVal(activityLabel)}\n\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `  Hãy sẵn sàng nhé! 💕\n` +
      `━━━━━━━━━━━━━━━━━`;

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
      return NextResponse.json(
        { ok: false, error: data.description },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );
  }
}
