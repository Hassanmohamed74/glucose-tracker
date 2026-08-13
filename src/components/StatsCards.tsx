"use client";

import { TrendingUp, TrendingDown, Activity, CheckCircle } from "lucide-react";

interface Props {
  average: number;
  minimum: number;
  maximum: number;
  completed: number;
  total: number;
}

export default function StatsCards({ average, minimum, maximum, completed, total }: Props) {
  const cards = [
    { label: "Average", value: average > 0 ? `${average}` : "—", unit: "mg/dL", icon: Activity, gradient: "from-blue-400 to-blue-600", bg: "bg-blue-50" },
    { label: "Lowest", value: minimum > 0 ? `${minimum}` : "—", unit: "mg/dL", icon: TrendingDown, gradient: "from-emerald-400 to-teal-600", bg: "bg-emerald-50" },
    { label: "Highest", value: maximum > 0 ? `${maximum}` : "—", unit: "mg/dL", icon: TrendingUp, gradient: "from-rose-400 to-pink-600", bg: "bg-rose-50" },
    { label: "Completed", value: `${completed}`, unit: `/ ${total}`, icon: CheckCircle, gradient: "from-violet-400 to-purple-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="card-glass hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3 shadow-lg`}>
              <Icon className="text-white" size={22} />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{card.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{card.value} <span className="text-sm font-bold text-slate-400">{card.unit}</span></p>
          </div>
        );
      })}
    </div>
  );
}
