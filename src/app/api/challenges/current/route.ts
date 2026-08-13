import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Challenge from "@/models/Challenge";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const challenge = await Challenge.findOne({ userId: auth.userId, status: "active" });

    if (!challenge) {
      return NextResponse.json({ challenge: null });
    }

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Current challenge error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
