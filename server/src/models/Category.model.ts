import mongoose, { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  type: "income" | "expense";
  user: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    // ✅ FIXED (correct Schema usage)
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Category = model<ICategory>("Category", categorySchema);
