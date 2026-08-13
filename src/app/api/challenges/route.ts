import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Challenge from "@/models/Challenge";
import { getAuthUser } from "@/lib/auth";
import { generateFingerAssignments } from "@/lib/utils";

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const active = await Challenge.findOne({ userId: auth.userId, status: "active" });
    if (active) {
      return NextResponse.json({ error: "You already have an active challenge" }, { status: 409 });
    }

    const startDate = new Date().toISOString().split("T")[0];
    const fingers = generateFingerAssignments();

    const days = Array.from({ length: 20 }, (_, i) => ({
      dayNumber: i + 1,
      date: addDays(startDate, i),
      assignedFinger: fingers[i],
      status: "pending" as const,
    }));

    const challenge = await Challenge.create({
      userId: auth.userId,
      startDate,
      endDate: addDays(startDate, 19),
      status: "active",
      days,
    });

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Create challenge error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
