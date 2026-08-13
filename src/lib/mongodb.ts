import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/glucose-tracker";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
