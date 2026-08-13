import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Settings from "@/models/Settings";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    await Settings.create({ userId: user._id });

    const token = signToken({ userId: user._id.toString(), email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
