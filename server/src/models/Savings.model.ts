import mongoose from "mongoose";

const savingsSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0
  }
});

export const Savings = mongoose.model("Savings", savingsSchema);
