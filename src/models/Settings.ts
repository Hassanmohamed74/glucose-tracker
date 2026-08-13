import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  userId: mongoose.Types.ObjectId;
  preferredUnit: string;
  reminderTime: string;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    preferredUnit: { type: String, default: "mg/dL" },
    reminderTime: { type: String, default: "08:00" },
    notificationsEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
