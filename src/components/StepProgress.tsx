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
