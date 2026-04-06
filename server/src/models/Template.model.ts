import mongoose from "mongoose";

/**
 * Field schema  
 */
const fieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "number", "date", "select", "boolean"],
    default: "text"
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  }
});

/**
 * Section schema  
 */
const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  key: { type: String, required: true },
  fields: [fieldSchema]
});

/**
 * Template schema 
 */
const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["grocery", "rent", "personal", "vacation", "tuition"],
      required: true
    },

    sections: [sectionSchema]
  },
  { timestamps: true }
);

export const Template = mongoose.model("Template", templateSchema);
