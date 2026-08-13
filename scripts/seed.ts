import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/lib/mongodb";
import User from "../src/models/User";
import Challenge from "../src/models/Challenge";
import Settings from "../src/models/Settings";
import { ReadingType } from "../src/lib/classification";

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function randomGlucose(): number {
  return Math.floor(Math.random() * (145 - 85 + 1)) + 85;
}

function randomTime(): string {
  const hour = Math.floor(Math.random() * 4) + 6;
  const minute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

function getRandomFinger(): string {
  const fingers = [
    "Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Little",
    "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Little",
  ];
  return fingers[Math.floor(Math.random() * fingers.length)];
}

function getRandomType(): ReadingType {
  const types: ReadingType[] = ["FASTING", "POST_BREAKFAST", "RANDOM"];
  return types[Math.floor(Math.random() * types.length)];
}

function getClassification(type: ReadingType, value: number): string {
  if (type === "FASTING") {
    if (value < 70) return "LOW";
    if (value <= 99) return "NORMAL";
    if (value <= 125) return "PREDIABETES";
    return "DIABETES_RANGE";
  }
  if (type === "POST_BREAKFAST") {
    if (value < 70) return "LOW";
    if (value <= 79) return "BELOW_TARGET";
    if (value <= 130) return "TARGET";
    if (value <= 180) return "ABOVE_TARGET";
    return "HIGH";
  }
  if (value < 70) return "LOW";
  if (value <= 199) return "NO_DIAGNOSTIC_THRESHOLD";
  return "DIABETES_RANGE";
}

function generateCompletedDays(startDate: string) {
  const fingers = Array.from({ length: 20 }, () => getRandomFinger());
  return Array.from({ length: 20 }, (_, i) => {
    const date = addDays(startDate, i);
    const [hour, minute] = randomTime().split(":");
    const measuredAt = new Date(`${date}T${hour}:${minute}:00`);
    const type = getRandomType();
    const glucose = randomGlucose();
    return {
      dayNumber: i + 1,
      date,
      assignedFinger: fingers[i],
      status: "completed" as const,
      completedAt: measuredAt,
      reading: {
        glucoseValue: glucose,
        unit: "mg/dL",
        finger: fingers[i],
        readingType: type,
        classification: getClassification(type, glucose),
        measuredAt,
        note: "",
      },
    };
  });
}

function generatePartialDays(startDate: string, completedCount: number) {
  const fingers = Array.from({ length: 20 }, () => getRandomFinger());
  return Array.from({ length: 20 }, (_, i) => {
    const date = addDays(startDate, i);
    const isCompleted = i < completedCount;
    if (!isCompleted) {
      return { dayNumber: i + 1, date, assignedFinger: fingers[i], status: "pending" as const };
    }
    const [hour, minute] = randomTime().split(":");
    const measuredAt = new Date(`${date}T${hour}:${minute}:00`);
    const type = getRandomType();
    const glucose = randomGlucose();
    return {
      dayNumber: i + 1,
      date,
      assignedFinger: fingers[i],
      status: "completed" as const,
      completedAt: measuredAt,
      reading: {
        glucoseValue: glucose,
        unit: "mg/dL",
        finger: fingers[i],
        readingType: type,
        classification: getClassification(type, glucose),
        measuredAt,
        note: "",
      },
    };
  });
}

async function seed() {
  await connectDB();
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  await Challenge.deleteMany({});
  await Settings.deleteMany({});
  console.log("Cleared existing data");

  const users = [
    { name: "Hend", email: "Hend@gmail.com", password: "password123", role: "completed" },
    { name: "Ahmed", email: "ahmed@test.com", password: "password123", role: "completed" },
    { name: "Sara", email: "sara@test.com", password: "password123", role: "active-15" },
    { name: "Omar", email: "omar@test.com", password: "password123", role: "active-8" },
    { name: "Laila", email: "laila@test.com", password: "password123", role: "active-3" },
    { name: "Khaled", email: "khaled@test.com", password: "password123", role: "completed" },
    { name: "Nour", email: "nour@test.com", password: "password123", role: "active-12" },
    { name: "Youssef", email: "youssef@test.com", password: "password123", role: "active-5" },
    { name: "Fatima", email: "fatima@test.com", password: "password123", role: "completed" },
    { name: "Hassan", email: "hassan@test.com", password: "password123", role: "active-18" },
  ];

  const today = new Date().toISOString().split("T")[0];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    const user = await User.create({ name: u.name, email: u.email.toLowerCase(), passwordHash });

    await Settings.create({
      userId: user._id,
      preferredUnit: "mg/dL",
      reminderTime: "08:00",
      notificationsEnabled: false,
    });

    let challengeData: any = null;

    if (u.role === "completed") {
      const startDate = addDays(today, -25);
      challengeData = {
        userId: user._id,
        startDate,
        endDate: addDays(startDate, 19),
        status: "completed",
        days: generateCompletedDays(startDate),
      };
    } else if (u.role.startsWith("active-")) {
      const completedCount = parseInt(u.role.split("-")[1]);
      const startDate = addDays(today, -(completedCount));
      challengeData = {
        userId: user._id,
        startDate,
        endDate: addDays(startDate, 19),
        status: "active",
        days: generatePartialDays(startDate, completedCount),
      };
    }

    if (challengeData) await Challenge.create(challengeData);
    console.log(`Created: ${u.name} (${u.email}) — ${u.role}`);
  }

  console.log("\n✅ Seed completed successfully!");
  console.log("\nLogin with:");
  console.log("  Hend@gmail.com / password123  (20/20 completed — full analysis)");
  console.log("  ahmed@test.com / password123  (20/20 completed)");
  console.log("  sara@test.com / password123   (15/20 active)");
  console.log("  ... and 7 more users");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
