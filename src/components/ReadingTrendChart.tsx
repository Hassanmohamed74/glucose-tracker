"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";

interface Props {
  data: { day: number; reading: number | null }[];
  average: number;
}

export default function ReadingTrendChart({ data, average }: Props) {
  const chartData = data.map((d) => ({ day: `Day ${d.day}`, reading: d.reading }));
  return (
    <div className="card-glass">
      <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </span>
        Reading Trend
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorReading" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
          <YAxis unit=" mg/dL" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} domain={["auto", "auto"]} />
          <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)" }} />
          <ReferenceLine y={average} stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={2} label={{ value: `Avg: ${average}`, position: "right", fill: "#3b82f6", fontSize: 12, fontWeight: "bold" }} />
          <Area type="monotone" dataKey="reading" stroke="#ef4444" strokeWidth={3} fill="url(#colorReading)" dot={{ fill: "#ef4444", r: 5, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8, strokeWidth: 3, stroke: "#fff" }} connectNulls />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
