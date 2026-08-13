import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Challenge from "@/models/Challenge";
import { getAuthUser } from "@/lib/auth";
import { calculateStreak, FINGERS } from "@/lib/utils";
import { classifyGlucose, ReadingType } from "@/lib/classification";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get("type") as ReadingType | null;

    await connectDB();
    const challenge = await Challenge.findOne({ _id: params.id, userId: auth.userId });
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    let completedDays = challenge.days.filter((d: any) => d.status === "completed" && d.reading);

    // Apply reading type filter if provided
    if (filterType) {
      completedDays = completedDays.filter((d: any) => d.reading.readingType === filterType);
    }

    const readings = completedDays.map((d: any) => d.reading.glucoseValue);

    // Calculate averages by type
    const fastingReadings = challenge.days
      .filter((d: any) => d.status === "completed" && d.reading?.readingType === "FASTING")
      .map((d: any) => d.reading.glucoseValue);
    const postBreakfastReadings = challenge.days
      .filter((d: any) => d.status === "completed" && d.reading?.readingType === "POST_BREAKFAST")
      .map((d: any) => d.reading.glucoseValue);
    const randomReadings = challenge.days
      .filter((d: any) => d.status === "completed" && d.reading?.readingType === "RANDOM")
      .map((d: any) => d.reading.glucoseValue);

    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    // Classification distribution
    const classificationCounts: Record<string, number> = {};
    challenge.days.forEach((d: any) => {
      if (d.reading?.classification) {
        classificationCounts[d.reading.classification] = (classificationCounts[d.reading.classification] || 0) + 1;
      }
    });

    // Reading type counts
    const typeCounts = {
      FASTING: challenge.days.filter((d: any) => d.reading?.readingType === "FASTING").length,
      POST_BREAKFAST: challenge.days.filter((d: any) => d.reading?.readingType === "POST_BREAKFAST").length,
      RANDOM: challenge.days.filter((d: any) => d.reading?.readingType === "RANDOM").length,
    };

    const stats = {
      totalDays: 20,
      completedDays: completedDays.length,
      completionRate: Math.round((challenge.days.filter((d: any) => d.status === "completed").length / 20) * 100),
      average: readings.length > 0 ? avg(readings) : 0,
      minimum: readings.length > 0 ? Math.min(...readings) : 0,
      maximum: readings.length > 0 ? Math.max(...readings) : 0,
      median: 0,
      stdDev: 0,
      streak: calculateStreak(challenge.days.map((d: any) => ({ status: d.status, date: d.date }))),
      fingerUsage: {} as Record<string, number>,
      dailyData: challenge.days.map((d: any) => ({
        day: d.dayNumber,
        date: d.date,
        status: d.status,
        finger: d.assignedFinger,
        reading: d.reading?.glucoseValue || null,
        readingType: d.reading?.readingType || null,
        classification: d.reading?.classification || null,
        time: d.reading?.measuredAt || null,
      })),
      // Type-specific averages
      fastingAverage: avg(fastingReadings),
      postBreakfastAverage: avg(postBreakfastReadings),
      randomAverage: avg(randomReadings),
      typeCounts,
      classificationCounts,
    };

    if (readings.length > 0) {
      const sorted = [...readings].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      stats.median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }

    if (readings.length > 1) {
      const mean = stats.average;
      const variance = readings.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) / readings.length;
      stats.stdDev = Math.round(Math.sqrt(variance));
    }

    FINGERS.forEach((f) => (stats.fingerUsage[f] = 0));
    challenge.days.forEach((d: any) => {
      stats.fingerUsage[d.assignedFinger] = (stats.fingerUsage[d.assignedFinger] || 0) + 1;
    });

    return NextResponse.json({ statistics: stats, challenge });
  } catch (error) {
    console.error("Statistics error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
