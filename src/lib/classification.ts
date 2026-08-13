export type ReadingType = "FASTING" | "POST_BREAKFAST" | "RANDOM";

export const READING_TYPE_LABELS: Record<ReadingType, string> = {
  FASTING: "Fasting",
  POST_BREAKFAST: "Post Breakfast",
  RANDOM: "Random Blood Glucose",
};

export const READING_TYPES: ReadingType[] = ["FASTING", "POST_BREAKFAST", "RANDOM"];

export interface ClassificationResult {
  category: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

export function classifyGlucose(readingType: ReadingType, glucoseValue: number): ClassificationResult {
  const value = Number(glucoseValue);

  switch (readingType) {
    case "FASTING": {
      if (value < 70) {
        return {
          category: "LOW",
          label: "LOW",
          description: "This reading is below the typical range. Consider consulting your healthcare professional.",
          color: "text-blue-600",
          bgColor: "bg-blue-50 border-blue-200",
        };
      }
      if (value <= 99) {
        return {
          category: "NORMAL",
          label: "Normal",
          description: "This reading falls within the typical range.",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50 border-emerald-200",
        };
      }
      if (value <= 125) {
        return {
          category: "PREDIABETES",
          label: "Prediabetes",
          description: "This reading falls within a range that may require lifestyle attention. Please consult your healthcare professional for proper interpretation.",
          color: "text-amber-600",
          bgColor: "bg-amber-50 border-amber-200",
        };
      }
      return {
        category: "DIABETES_RANGE",
        label: "Diabetes range",
        description: "This reading falls within a range that may require medical follow-up. Please consult your healthcare professional for proper interpretation.",
        color: "text-rose-600",
        bgColor: "bg-rose-50 border-rose-200",
      };
    }

    case "POST_BREAKFAST": {
      if (value < 70) {
        return {
          category: "LOW",
          label: "LOW",
          description: "This reading is below the typical range. Consider consulting your healthcare professional.",
          color: "text-blue-600",
          bgColor: "bg-blue-50 border-blue-200",
        };
      }
      if (value <= 79) {
        return {
          category: "BELOW_TARGET",
          label: "Below target",
          description: "This reading is slightly below the typical post-meal target range.",
          color: "text-sky-600",
          bgColor: "bg-sky-50 border-sky-200",
        };
      }
      if (value <= 130) {
        return {
          category: "TARGET",
          label: "Target",
          description: "This reading falls within the typical post-meal target range.",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50 border-emerald-200",
        };
      }
      if (value <= 180) {
        return {
          category: "ABOVE_TARGET",
          label: "Above target",
          description: "This reading is above the typical post-meal target range.",
          color: "text-amber-600",
          bgColor: "bg-amber-50 border-amber-200",
        };
      }
      return {
        category: "HIGH",
        label: "High",
        description: "This reading is elevated. Please consult your healthcare professional for proper interpretation.",
        color: "text-rose-600",
        bgColor: "bg-rose-50 border-rose-200",
      };
    }

    case "RANDOM": {
      if (value < 70) {
        return {
          category: "LOW",
          label: "LOW",
          description: "This reading is below the typical range. Consider consulting your healthcare professional.",
          color: "text-blue-600",
          bgColor: "bg-blue-50 border-blue-200",
        };
      }
      if (value <= 199) {
        return {
          category: "NO_DIAGNOSTIC_THRESHOLD",
          label: "No diagnostic threshold",
          description: "This reading does not reach the threshold typically associated with diagnostic concerns.",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50 border-emerald-200",
        };
      }
      return {
        category: "DIABETES_RANGE",
        label: "Diabetes range",
        description: "This reading may warrant medical follow-up. Please consult your healthcare professional for proper interpretation.",
        color: "text-rose-600",
        bgColor: "bg-rose-50 border-rose-200",
      };
    }

    default:
      return {
        category: "UNKNOWN",
        label: "Unknown",
        description: "Unable to classify this reading.",
        color: "text-slate-600",
        bgColor: "bg-slate-50 border-slate-200",
      };
  }
}
