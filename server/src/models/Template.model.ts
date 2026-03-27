import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  suggestedAmount: {
    type: Number,
    default: 0
  }
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  items: [itemSchema]
});

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  categories: [categorySchema]
});

export const Template = mongoose.model("Template", templateSchema);
