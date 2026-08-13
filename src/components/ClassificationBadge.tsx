"use client";

import { ClassificationResult } from "@/lib/classification";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface Props {
  classification: ClassificationResult | null;
}

export default function ClassificationBadge({ classification }: Props) {
  if (!classification) return null;

  const isConcerning = ["DIABETES_RANGE", "HIGH", "LOW"].includes(classification.category);

  return (
    <div className={`rounded-2xl border-2 p-4 animate-slide-up ${classification.bgColor}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${classification.color}`}>
          {isConcerning ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Result</span>
          </div>
          <p className={`text-2xl font-black ${classification.color}`}>{classification.label}</p>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">{classification.description}</p>
        </div>
      </div>
    </div>
  );
}
