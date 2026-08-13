import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    let settings = await Settings.findOne({ userId: auth.userId });
    if (!settings) {
      settings = await Settings.create({ userId: auth.userId });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { preferredUnit, reminderTime, notificationsEnabled } = await req.json();

    await connectDB();
    const settings = await Settings.findOneAndUpdate(
      { userId: auth.userId },
      { preferredUnit, reminderTime, notificationsEnabled },
      { new: true, upsert: true }
    );

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
