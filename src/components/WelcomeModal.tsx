"use client";

import { useEffect, useState } from "react";
import { X, Heart, Sparkles } from "lucide-react";

const MOTIVATIONAL_MESSAGES: Record<number, string> = {
  1: "You don't have to navigate your health journey alone—we're right here with you.",
  2: "We are in your corner every step of the way, cheering you on.",
  3: "Be gentle with yourself today; healing takes time, and you're doing wonderfully.",
  4: "You are far stronger and more resilient than any challenge you face.",
  5: "Every small step you take today is a huge victory worth celebrating.",
  6: "Rest when you need to, move when you can, and always listen to your body.",
  7: "Take a deep breath and give yourself credit for how far you've already come.",
  8: "Your well-being matters to us, and we are honored to support your path.",
  9: "Focus on your progress, no matter how small—every effort counts.",
  10: "You are doing an amazing job taking care of yourself, even on tough days.",
  11: "Tomorrow is built on the gentle care you give yourself today.",
  12: "Hope, strength, and steady progress are all within your reach.",
  13: "Your health journey is uniquely yours, but you never have to walk it alone.",
  14: "Prioritize yourself today—you deserve all the time and care you need.",
  15: "Remember to celebrate the little wins along the way; they add up fast.",
  16: "Whatever today brings, know that we believe in your strength and resilience.",
  17: "Taking charge of your health is a brave act of self-love.",
  18: "Lean on us whenever you need a helping hand—that's what we're here for.",
  19: "Progress isn't always linear, so give yourself grace on every step of the road.",
  20: "Take a moment for yourself, breathe easy, and know that you've got this.",
};

interface Props {
  userName: string;
  dayNumber: number;
  onClose: () => void;
}

export default function WelcomeModal({ userName, dayNumber, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const message = MOTIVATIONAL_MESSAGES[dayNumber] || MOTIVATIONAL_MESSAGES[1];

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />
      <div
        className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all duration-300 ${
          visible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-slate-500" />
        </button>

        <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-500/20 animate-bounce-soft">
          <Heart className="text-white" size={28} />
        </div>

        <h2 className="text-2xl font-black text-slate-800 mb-1">
          Welcome back, <span className="text-gradient from-blue-600 to-violet-600">{userName}</span>!
        </h2>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Day {dayNumber} of 20
        </p>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 mb-6">
          <Sparkles size={20} className="text-amber-500 mx-auto mb-2" />
          <p className="text-slate-700 font-medium leading-relaxed italic">
            &ldquo;{message}&rdquo;
          </p>
        </div>

        <button
          onClick={handleClose}
          className="btn-primary w-full py-3.5"
        >
          Let&apos;s Go
        </button>
      </div>
    </div>
  );
}
