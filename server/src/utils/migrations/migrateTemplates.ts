import mongoose from "mongoose";
import { Template } from "../../models/Template.model";
import dotenv from "dotenv";

dotenv.config();

/**
 * Connect to MongoDB
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in .env");
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

/**
 * Map old template names  
 */
function getType(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes("grocery")) return "grocery";
  if (lower.includes("rent")) return "rent";
  if (
    lower.includes("tuition") ||
    lower.includes("course") ||
    lower.includes("lab")
  )
    return "tuition";
  if (lower.includes("vacation")) return "vacation";
  if (lower.includes("emergency")) return "personal";

  return "personal";
}

/**
 * Convert label  
 */
function toKey(label: any): string {
  if (!label) return "unknown";

  const safeLabel =
    typeof label === "string"
      ? label
      : typeof label === "object"
      ? label.label || label.name || JSON.stringify(label)
      : String(label);

  return safeLabel
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");
}

/**
 * Migration runner
 */
async function migrate() {
  await connectDB();

  try {
    const templates = await Template.find({});

    console.log(`Found ${templates.length} templates to update`);

    for (const t of templates) {
      const type = getType(t.name);

      let fields: any[] = [];

      if (type === "tuition") {
        fields = [
          { key: "tuition_fees", label: "Tuition Fees", type: "number" },
          { key: "books", label: "Books & Supplies", type: "number" },
          { key: "student_fees", label: "Student Fees", type: "number" },
          { key: "other_costs", label: "Other Costs", type: "number" }
        ];
      }

      if (type === "rent") {
        fields = [
          { key: "base_rent", label: "Base Rent", type: "number" },
          { key: "electricity", label: "Electricity", type: "number" },
          { key: "water", label: "Water", type: "number" },
          { key: "internet", label: "Internet", type: "number" }
        ];
      }

      if (type === "grocery") {
        fields = [
          { key: "produce", label: "Produce", type: "number" },
          { key: "protein", label: "Protein", type: "number" },
          { key: "dairy", label: "Dairy & Eggs", type: "number" },
          { key: "pantry", label: "Pantry Items", type: "number" }
        ];
      }

      if (type === "personal") {
        fields = [
          { key: "goal_name", label: "Goal Name", type: "text" },
          { key: "amount_needed", label: "Amount Needed", type: "number" },
          { key: "due_date", label: "Due Date", type: "date" },
          { key: "category", label: "Category", type: "text" }
        ];
      }

      if (type === "vacation") {
        fields = [
          { key: "destination", label: "Destination", type: "text" },
          { key: "flight", label: "Flight Cost", type: "number" },
          { key: "hotel", label: "Hotel Cost", type: "number" },
          { key: "other", label: "Other Expenses", type: "number" }
        ];
      }

      // BUILD SECTIONS
      const sections = [
        {
          title: t.name,
          key: toKey(t.name),
          fields
        }
      ];

      // DIRECT DB UPDATE 
      await mongoose.connection.collection("templates").updateOne(
        { _id: t._id },
        {
          $set: {
            type,
            sections
          },
          $unset: {
            categories: ""
          }
        }
      );

      console.log(`Updated: ${t.name}`);
    }

    console.log(" Migration complete");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log(" MongoDB disconnected");
  }
}

migrate();
