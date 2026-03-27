import mongoose from "mongoose";
import { Template } from "../src/models/Template.model";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envPath = path.resolve(process.cwd(), ".env");


// Load environment variables
dotenv.config({ path: envPath });

// Confirm it loaded
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is UNDEFINED");
  process.exit(1);
}

const MONGO_URI: string = process.env.MONGO_URI;

// Templates
const templates = [
  {
    name: "Tuition Template",
    categories: [
      {
        name: "General Info",
        items: [
          { name: "Semester / Term" },
          { name: "Program / Course Name" },
          { name: "School Name" }
        ]
      },
      {
        name: "Costs",
        items: [{ name: "Tuition Cost", suggestedAmount: 2000 }]
      },
      {
        name: "Payment",
        items: [
          { name: "Due Date" },
          { name: "Payment Status" }
        ]
      }
    ]
  },
  {
    name: "Course Materials",
    categories: [
      {
        name: "Course Information",
        items: [{ name: "Course Name" }]
      },
      {
        name: "Books",
        items: [
          { name: "Book Title" },
          { name: "Book Cost", suggestedAmount: 120 }
        ]
      },
      {
        name: "Supplies",
        items: [
          { name: "Calculator" },
          { name: "Lab Kit" }
        ]
      }
    ]
  },
  {
    name: "Lab / Program Fees",
    categories: [
      {
        name: "Fees",
        items: [
          { name: "Lab Fees", suggestedAmount: 75 },
          { name: "Equipment", suggestedAmount: 200 },
          { name: "Software Licenses", suggestedAmount: 100 },
          { name: "Printing", suggestedAmount: 35 }
        ]
      }
    ]
  },
  {
    name: "Monthly Transportation",
    categories: [
      {
        name: "Transportation Costs",
        items: [
          { name: "Transit Fare" },
          { name: "Transit Pass" },
          { name: "Uber/Lyft" },
          { name: "Parking" },
          { name: "Gas" }
        ]
      }
    ]
  },
  {
    name: "Rent",
    categories: [
      {
        name: "Rent",
        items: [
          { name: "Monthly Rent", suggestedAmount: 1500 },
          { name: "Rent Due Date" }
        ]
      },
      {
        name: "Utilities",
        items: [
          { name: "Hydro" },
          { name: "Water" },
          { name: "Internet" }
        ]
      },
      {
        name: "Other",
        items: [{ name: "Subscriptions" }]
      }
    ]
  },
  {
    name: "Grocery",
    categories: [
      {
        name: "Food",
        items: [
          { name: "Food", suggestedAmount: 250 },
          { name: "Drinks" },
          { name: "Snacks" }
        ]
      },
      {
        name: "Essentials",
        items: [
          { name: "Household Items" },
          { name: "Toiletries" }
        ]
      }
    ]
  },
  {
    name: "Emergency Fund",
    categories: [
      {
        name: "Savings",
        items: [
          { name: "Target Amount", suggestedAmount: 3000 },
          { name: "Current Savings" },
          { name: "Monthly Contribution" },
          { name: "Target Deadline" }
        ]
      }
    ]
  }
];

// Seed function
const seedTemplates = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Template.deleteMany();
    console.log("Old templates removed");

    await Template.insertMany(templates);
    console.log("Templates seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding templates:", error);
    process.exit(1);
  }
};

seedTemplates();
