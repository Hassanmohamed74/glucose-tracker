"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: Record<string, number>;
}

export default function FingerDistributionChart({ data }: Props) {
  const chartData = Object.entries(data).map(([finger, count]) => ({ finger: finger.replace("Left ", "L-").replace("Right ", "R-"), count }));
  return (
    <div className="card-glass animate-slide-up">
      <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
        </span>
        Finger Assignment Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
          <YAxis dataKey="finger" type="category" width={60} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
          <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)", background: "rgba(255,255,255,0.95)" }} />
          <Bar dataKey="count" fill="#8b5cf6" radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
