import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
