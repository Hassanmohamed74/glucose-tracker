import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Challenge from "@/models/Challenge";
import { getAuthUser } from "@/lib/auth";

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

    const today = new Date().toISOString().split("T")[0];
    const todayDay = challenge.days.find((d: any) => d.date === today);

    if (!todayDay) {
      return NextResponse.json({ error: "No measurement scheduled for today" }, { status: 404 });
    }

    return NextResponse.json({ day: todayDay });
  } catch (error) {
    console.error("Today error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
