import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Challenge from "@/models/Challenge";
import { getAuthUser } from "@/lib/auth";
import { classifyGlucose, READING_TYPES, ReadingType } from "@/lib/classification";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { glucoseValue, readingType, unit, note } = await req.json();

    // Validate reading type
    if (!readingType || !READING_TYPES.includes(readingType as ReadingType)) {
      return NextResponse.json({ error: "Please select when this blood glucose reading was taken." }, { status: 400 });
    }

    if (!glucoseValue || isNaN(Number(glucoseValue))) {
      return NextResponse.json({ error: "Please enter a valid blood glucose reading" }, { status: 400 });
    }

    const value = Number(glucoseValue);
    if (value <= 0 || value > 999) {
      return NextResponse.json({ error: "Reading must be between 1 and 999" }, { status: 400 });
    }

    await connectDB();
    const challenge = await Challenge.findOne({ _id: params.id, userId: auth.userId });
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const today = new Date().toISOString().split("T")[0];
    const dayIndex = challenge.days.findIndex((d: any) => d.date === today);

    if (dayIndex === -1) {
      return NextResponse.json({ error: "No measurement scheduled for today" }, { status: 400 });
    }

    const day = challenge.days[dayIndex];
    if (day.status === "completed") {
      return NextResponse.json({ error: "Today's measurement has already been recorded" }, { status: 409 });
    }

    // Backend classification (authoritative)
    const classification = classifyGlucose(readingType as ReadingType, value);

    day.status = "completed";
    day.completedAt = new Date();
    day.reading = {
      glucoseValue: value,
      unit: unit || "mg/dL",
      finger: day.assignedFinger,
      readingType: readingType as ReadingType,
      classification: classification.category,
      measuredAt: new Date(),
      note: note || "",
    };

    const allCompleted = challenge.days.every((d: any) => d.status === "completed");
    if (allCompleted) {
      challenge.status = "completed";
    }

    await challenge.save();

    return NextResponse.json({ day, challenge, classification });
  } catch (error) {
    console.error("Reading error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const challenge = await Challenge.findOne({ _id: params.id, userId: auth.userId });
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json({ days: challenge.days });
  } catch (error) {
    console.error("Get readings error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
