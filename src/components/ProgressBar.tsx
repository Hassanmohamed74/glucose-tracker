"use client";

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const percentage = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-black text-slate-700">Day {current} / {total}</span>
        <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 h-full rounded-full transition-all duration-700 ease-out shadow-lg" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
