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

function foodEmoji(food: string): string {
  return FOOD_EMOJI[food] ?? "🍽️";
}

function activityEmoji(activity: string): string {
  return ACTIVITY_EMOJI[activity] ?? "🎯";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, time, food, activity } = body;

    const foodLabel = food || "—";
    const activityLabel = activity || "—";

    const message = [
      "━━━━━━━━━━━━━━━━━",
      "  💌 LỜI MỜI HẸN HÒ 💌",
      "━━━━━━━━━━━━━━━━━",
      "",
      "  ✨ Này Trân yêu dấu,",
      "  Có ai đó muốn mời em đi chơi nè~",
      "",
      `  📅  Ngày: *${formatDate(date)}*`,
      `  🕐  Giờ:   *${time || "—"}*`,
      "",
      `  🍽️  Ăn:    *${foodLabel}* ${foodEmoji(foodLabel)}`,
      `  🎯  Chơi:  *${activityLabel}* ${activityEmoji(activityLabel)}`,
      "",
      "━━━━━━━━━━━━━━━━━",
      "  Hãy sẵn sàng nhé! 💕",
      "━━━━━━━━━━━━━━━━━",
    ].join("\n");

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
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
