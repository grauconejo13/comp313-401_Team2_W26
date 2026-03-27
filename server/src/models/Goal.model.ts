import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  }
});

export const Goal = mongoose.model("Goal", goalSchema);
