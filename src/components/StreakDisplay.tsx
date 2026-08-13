"use client";

import { Flame, Trophy, TrendingUp } from "lucide-react";

interface Props {
  current: number;
  longest: number;
}

export default function StreakDisplay({ current, longest }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 animate-slide-up">
      <div className="card-glass bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Flame className="text-white" size={20} />
          </div>
          <span className="text-sm font-black text-orange-700 uppercase tracking-wider">Current Streak</span>
        </div>
        <p className="text-4xl font-black text-orange-800">{current} <span className="text-lg font-bold text-orange-600">days</span></p>
        {current > 0 && <div className="mt-2 w-full bg-orange-200/50 rounded-full h-2"><div className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-full" style={{ width: `${Math.min((current / 20) * 100, 100)}%` }} /></div>}
      </div>

      <div className="card-glass bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Trophy className="text-white" size={20} />
          </div>
          <span className="text-sm font-black text-yellow-700 uppercase tracking-wider">Longest Streak</span>
        </div>
        <p className="text-4xl font-black text-yellow-800">{longest} <span className="text-lg font-bold text-yellow-600">days</span></p>
        {longest > 0 && <div className="mt-2 w-full bg-yellow-200/50 rounded-full h-2"><div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full" style={{ width: `${Math.min((longest / 20) * 100, 100)}%` }} /></div>}
      </div>
    </div>
  );
}
