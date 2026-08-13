import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FINGERS = [
  "Left Thumb",
  "Left Index",
  "Left Middle",
  "Left Ring",
  "Left Little",
  "Right Thumb",
  "Right Index",
  "Right Middle",
  "Right Ring",
  "Right Little",
] as const;

export type Finger = (typeof FINGERS)[number];

export function getRandomFinger(): Finger {
  return FINGERS[Math.floor(Math.random() * FINGERS.length)];
}

export function generateFingerAssignments(): Finger[] {
  return Array.from({ length: 20 }, () => getRandomFinger());
}

export function calculateStreak(days: { status: string; date: string }[]): {
  current: number;
  longest: number;
} {
  let current = 0;
  let longest = 0;
  let temp = 0;

  const today = new Date().toISOString().split("T")[0];

  for (let i = 0; i < days.length; i++) {
    if (days[i].status === "completed") {
      temp++;
      if (temp > longest) longest = temp;
    } else {
      temp = 0;
    }
  }

  // Current streak counts only if last completed day is today or consecutive backwards
  temp = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const dayDate = days[i].date;
    const dayStatus = days[i].status;
    const dayDiff = Math.floor(
      (new Date(today).getTime() - new Date(dayDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayStatus === "completed" && (dayDiff === temp || (i === days.length - 1 && dayDiff <= temp))) {
      temp++;
    } else if (dayDiff > temp) {
      break;
    }
  }
  current = temp;

  return { current, longest };
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
