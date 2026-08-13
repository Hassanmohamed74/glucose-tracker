"use client";

import { ReadingType, READING_TYPE_LABELS, READING_TYPES } from "@/lib/classification";
import { Utensils, Coffee, Shuffle } from "lucide-react";

interface Props {
  value: ReadingType | null;
  onChange: (type: ReadingType) => void;
  error?: string;
}

const ICONS: Record<ReadingType, React.ReactNode> = {
  FASTING: <Utensils size={18} />,
  POST_BREAKFAST: <Coffee size={18} />,
  RANDOM: <Shuffle size={18} />,
};

const DESCRIPTIONS: Record<ReadingType, string> = {
  FASTING: "Before eating, typically morning",
  POST_BREAKFAST: "2 hours after a meal",
  RANDOM: "Taken at any time of day",
};

export default function ReadingTypeSelector({ value, onChange, error }: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-slate-700">
        When was this reading taken? <span className="text-rose-500">*</span>
      </label>
      <div className="grid gap-3" role="radiogroup" aria-label="Reading type">
        {READING_TYPES.map((type) => {
          const isSelected = value === type;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(type)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left w-full ${
                isSelected
                  ? "border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10"
                  : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300"
                }`}
              >
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`${isSelected ? "text-blue-600" : "text-slate-500"}`}>{ICONS[type]}</span>
                  <span className={`font-bold ${isSelected ? "text-blue-700" : "text-slate-700"}`}>
                    {READING_TYPE_LABELS[type]}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{DESCRIPTIONS[type]}</p>
              </div>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-sm font-bold text-rose-600 flex items-center gap-1.5 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
    </div>
  );
}
