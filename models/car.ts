import mongoose, { Schema, Document } from "mongoose";

export interface CarDocument extends Document {
  userId: string;
  modelPath: string;
  bodyColor: string;
  wheelColor: string;
  accessories: {
    wheels: string;
    headlights: string;
    interiorColor: string;
  };
  shared: boolean;
  createdAt: Date;
}

const CarSchema = new Schema<CarDocument>({
  userId: { type: String, required: true },
  modelPath: { type: String, required: true },
  bodyColor: { type: String, required: true },
  wheelColor: { type: String, required: true },
  accessories: {
    wheels: { type: String, required: true },
    headlights: { type: String, required: true },
    interiorColor: { type: String, required: true },
  },
  shared: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Car || mongoose.model<CarDocument>("Car", CarSchema);
