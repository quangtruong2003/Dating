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
