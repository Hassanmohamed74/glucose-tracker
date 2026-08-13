import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production-12345";

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export function getAuthUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setAuthCookie(token: string) {
  const cookieStore = cookies();
  (await cookieStore).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function removeAuthCookie() {
  const cookieStore = cookies();
  (await cookieStore).delete("token");
}
