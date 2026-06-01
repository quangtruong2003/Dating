import { ReactNode } from "react";

interface WizardCardProps {
  children: ReactNode;
}

export default function WizardCard({ children }: WizardCardProps) {
  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
      <div
        className="w-full max-w-md bg-white rounded-3xl border border-pink-100 overflow-hidden"
        style={{
          boxShadow:
            "0 0 60px rgba(236, 72, 153, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
