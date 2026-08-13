"use client";

import { Finger, FINGERS } from "@/lib/utils";

interface Props {
  selectedFinger: Finger;
  size?: "sm" | "md" | "lg";
}

export default function HandVisualization({ selectedFinger, size = "lg" }: Props) {
  const sizeClasses = { sm: "w-48 h-40", md: "w-64 h-52", lg: "w-80 h-64" };
  const isLeft = selectedFinger.startsWith("Left");
  const fingerName = selectedFinger.replace("Left ", "").replace("Right ", "");

  const fingerPositions = [
    { name: "Thumb", cx: isLeft ? 65 : 235, cy: 140, rx: 12, ry: 28, rotate: isLeft ? -30 : 30 },
    { name: "Index", cx: isLeft ? 105 : 195, cy: 55, rx: 10, ry: 38, rotate: 0 },
    { name: "Middle", cx: isLeft ? 135 : 165, cy: 45, rx: 10, ry: 42, rotate: 0 },
    { name: "Ring", cx: isLeft ? 165 : 135, cy: 55, rx: 10, ry: 38, rotate: 0 },
    { name: "Little", cx: isLeft ? 195 : 105, cy: 75, rx: 9, ry: 30, rotate: 0 },
  ];

  const selected = fingerPositions.find((f) => f.name === fingerName);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 300 200" className={`${sizeClasses[size]} drop-shadow-2xl`}>
        <ellipse cx="150" cy="150" rx="70" ry="45" fill="#fca5a5" />
        <ellipse cx="150" cy="150" rx="65" ry="40" fill="#fecaca" />
        <rect x="110" y="185" width="80" height="20" rx="8" fill="#fca5a5" />
        {fingerPositions.map((finger) => {
          const isSelected = finger.name === fingerName;
          return (
            <ellipse
              key={finger.name}
              cx={finger.cx} cy={finger.cy} rx={finger.rx} ry={finger.ry}
              fill={isSelected ? "#ef4444" : "#fecaca"}
              stroke={isSelected ? "#dc2626" : "#fca5a5"}
              strokeWidth={isSelected ? 3 : 2}
              transform={`rotate(${finger.rotate} ${finger.cx} ${finger.cy + 20})`}
              style={{ transition: "all 0.3s ease" }}
            />
          );
        })}
        {selected && (
          <ellipse cx={selected.cx} cy={selected.cy} rx={selected.rx + 4} ry={selected.ry + 4}
            fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="6 3"
            transform={`rotate(${selected.rotate} ${selected.cx} ${selected.cy + 20})`}
          >
            <animate attributeName="stroke-dashoffset" from="0" to="18" dur="1s" repeatCount="indefinite" />
          </ellipse>
        )}
        <text x="150" y="175" textAnchor="middle" className="text-xs font-bold fill-gray-700">{isLeft ? "LEFT HAND" : "RIGHT HAND"}</text>
      </svg>
      <div className="mt-4 text-center">
        <div className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-xl px-6 py-2 rounded-2xl shadow-lg shadow-rose-500/30">
          {selectedFinger}
        </div>
        <p className="text-sm text-slate-500 mt-2 font-medium">Use this finger for today&apos;s measurement</p>
      </div>
    </div>
  );
}
