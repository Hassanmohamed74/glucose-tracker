import mongoose, { Schema, Document } from "mongoose";
import { Finger } from "@/lib/utils";
import { ReadingType } from "@/lib/classification";

export interface IReading {
  glucoseValue: number;
  unit: string;
  finger: Finger;
  readingType: ReadingType;
  classification: string;
  measuredAt: Date;
  note?: string;
}

export interface IChallengeDay {
  dayNumber: number;
  date: string;
  assignedFinger: Finger;
  status: "pending" | "completed" | "missed";
  completedAt?: Date;
  reading?: IReading;
}

export interface IChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "abandoned";
  days: IChallengeDay[];
  createdAt: Date;
  updatedAt: Date;
}

const ReadingSchema = new Schema<IReading>(
  {
    glucoseValue: { type: Number, required: true },
    unit: { type: String, required: true, default: "mg/dL" },
    finger: { type: String, required: true },
    readingType: { type: String, enum: ["FASTING", "POST_BREAKFAST", "RANDOM"], required: true },
    classification: { type: String, required: true },
    measuredAt: { type: Date, required: true },
    note: { type: String },
  },
  { _id: false }
);

const ChallengeDaySchema = new Schema<IChallengeDay>(
  {
    dayNumber: { type: Number, required: true },
    date: { type: String, required: true },
    assignedFinger: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed", "missed"], default: "pending" },
    completedAt: { type: Date },
    reading: { type: ReadingSchema },
  },
  { _id: false }
);

const ChallengeSchema = new Schema<IChallenge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { type: String, enum: ["active", "completed", "abandoned"], default: "active" },
    days: { type: [ChallengeDaySchema], required: true },
  },
  { timestamps: true }
);

ChallengeSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Challenge || mongoose.model<IChallenge>("Challenge", ChallengeSchema);
