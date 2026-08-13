"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
  data: { day: number; reading: number | null; status: string }[];
}

export default function DailyReadingsChart({ data }: Props) {
  const chartData = data.map((d) => ({ day: `D${d.day}`, reading: d.reading || 0, status: d.status }));
  return (
    <div className="card-glass">
      <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </span>
        Daily Readings
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
          <YAxis unit=" mg/dL" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
          <Tooltip formatter={(value: number, _name: string, props: any) => [props.payload.status === "completed" ? `${value} mg/dL` : "No reading", "Glucose"]} contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)", background: "rgba(255,255,255,0.95)" }} />
          <Bar dataKey="reading" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.status === "completed" ? "#3b82f6" : "#e2e8f0"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
