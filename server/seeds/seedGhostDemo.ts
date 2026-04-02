import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User } from "../src/models/User.model";
import Income from "../src/models/income.model";
import { Expense } from "../src/models/expense.model";
import { Debt } from "../src/models/Debt.model";
import { Transaction } from "../src/models/Transaction.model";
import { hashPassword } from "../src/utils/hashPassword";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in server/.env");
  process.exit(1);
}

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return fallback;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

const email = (arg("--email", "developer@test.com") as string).toLowerCase().trim();
const password = arg("--password", "password") as string;
const months = Math.min(5, Math.max(3, Number(arg("--months", "4")) || 4));
const reset = hasFlag("--reset");

const categories = ["Food", "Transport", "Rent", "Utilities", "Entertainment", "Healthcare", "Education", "Other"] as const;

type Category = (typeof categories)[number];

const categoryBase: Record<Category, number> = {
  Food: 28,
  Transport: 15,
  Rent: 700,
  Utilities: 120,
  Entertainment: 24,
  Healthcare: 40,
  Education: 55,
  Other: 22,
};

const categoryClass: Record<Category, "Necessary" | "Avoidable"> = {
  Food: "Necessary",
  Transport: "Necessary",
  Rent: "Necessary",
  Utilities: "Necessary",
  Entertainment: "Avoidable",
  Healthcare: "Necessary",
  Education: "Necessary",
  Other: "Avoidable",
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function monthBehavior(monthOffsetFromNow: number): "good" | "bad" | "ugly" | "recovery" {
  if (monthOffsetFromNow >= 4) return "good";
  if (monthOffsetFromNow === 3) return "bad";
  if (monthOffsetFromNow === 2) return "ugly";
  if (monthOffsetFromNow === 1) return "recovery";
  return "good";
}

function factorFor(cat: Category, behavior: ReturnType<typeof monthBehavior>): number {
  if (behavior === "good") {
    if (cat === "Entertainment" || cat === "Other") return randomFloat(0.55, 0.85);
    if (cat === "Food") return randomFloat(0.75, 0.95);
    return randomFloat(0.9, 1.05);
  }
  if (behavior === "bad") {
    if (cat === "Entertainment" || cat === "Other") return randomFloat(1.1, 1.5);
    if (cat === "Food" || cat === "Transport") return randomFloat(1.05, 1.25);
    return randomFloat(0.95, 1.15);
  }
  if (behavior === "ugly") {
    if (cat === "Entertainment" || cat === "Other") return randomFloat(1.5, 2.2);
    if (cat === "Food" || cat === "Transport") return randomFloat(1.2, 1.6);
    return randomFloat(1.0, 1.2);
  }
  // recovery
  if (cat === "Entertainment" || cat === "Other") return randomFloat(0.7, 1.0);
  if (cat === "Food" || cat === "Transport") return randomFloat(0.85, 1.1);
  return randomFloat(0.9, 1.05);
}

async function ensureUser() {
  let user = await User.findOne({ email }).select("+password");
  if (!user) {
    const hashed = await hashPassword(password);
    user = await User.create({
      email,
      password: hashed,
      displayName: "Ghost Demo User",
      homeCurrency: "CAD",
      role: "student",
      savingsGoalLabel: "Emergency fund",
      savingsGoalTarget: 2500,
    });
    console.log(`Created demo user: ${email}`);
  } else {
    console.log(`Using existing user: ${email}`);
  }
  return user;
}

async function seedForUser(userId: mongoose.Types.ObjectId) {
  if (reset) {
    await Promise.all([
      Income.deleteMany({ user: userId }),
      Expense.deleteMany({ user: userId }),
      Debt.deleteMany({ user: userId }),
      Transaction.deleteMany({ user: userId }),
    ]);
    console.log("Cleared existing financial records for demo user.");
  }

  const now = new Date();
  let incomeCount = 0;
  let expenseCount = 0;
  let txCount = 0;

  for (let m = months - 1; m >= 0; m--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const behavior = monthBehavior(m);

    // Biweekly income + side income variability
    const incomeDays = [5, 19, 27];
    for (const d of incomeDays) {
      if (d > daysInMonth) continue;
      const isSide = d === 27;
      const amt = isSide ? randomFloat(120, 320) : randomFloat(780, 980);
      const date = new Date(year, month, d);
      const reason = isSide ? "Part-time shift" : "Biweekly pay";
      await Income.create({ user: userId, amount: amt, reason, date });
      await Transaction.create({
        user: userId,
        type: "income",
        amount: amt,
        description: reason,
        category: "Income",
        createdAt: date,
        updatedAt: date,
      });
      incomeCount += 1;
      txCount += 1;
    }

    // Monthly rent + utilities anchors
    const anchors: Array<{ day: number; cat: Category; reason: string }> = [
      { day: 1, cat: "Rent", reason: "Monthly rent" },
      { day: 7, cat: "Utilities", reason: "Utilities bill" },
      { day: 12, cat: "Education", reason: "Course materials" },
      { day: 16, cat: "Healthcare", reason: "Pharmacy / clinic" },
    ];
    for (const a of anchors) {
      if (a.day > daysInMonth) continue;
      const date = new Date(year, month, a.day);
      const amount = Math.round(categoryBase[a.cat] * factorFor(a.cat, behavior) * 100) / 100;
      await Expense.create({
        user: userId,
        amount,
        category: a.cat,
        classification: categoryClass[a.cat],
        reason: a.reason,
        date,
      });
      await Transaction.create({
        user: userId,
        type: "expense",
        amount,
        description: a.reason,
        category: a.cat,
        createdAt: date,
        updatedAt: date,
      });
      expenseCount += 1;
      txCount += 1;
    }

    // Random spending events for habits
    const spendEvents = randomInt(14, 24);
    for (let i = 0; i < spendEvents; i++) {
      const cat = categories[randomInt(0, categories.length - 1)];
      const day = randomInt(1, daysInMonth);
      const date = new Date(year, month, day);
      const amount = Math.round(categoryBase[cat] * randomFloat(0.6, 1.25) * factorFor(cat, behavior) * 100) / 100;
      const reason =
        cat === "Food"
          ? "Groceries / meals"
          : cat === "Transport"
          ? "Transit / ride"
          : cat === "Entertainment"
          ? "Leisure activity"
          : cat === "Other"
          ? "Misc purchase"
          : `${cat} expense`;

      await Expense.create({
        user: userId,
        amount,
        category: cat,
        classification: categoryClass[cat],
        reason,
        date,
      });
      await Transaction.create({
        user: userId,
        type: "expense",
        amount,
        description: reason,
        category: cat,
        createdAt: date,
        updatedAt: date,
      });
      expenseCount += 1;
      txCount += 1;
    }
  }

  // Debt records to populate debt charts/use-cases
  const debtDocs = [
    {
      user: userId,
      label: "Laptop installment",
      counterparty: "Campus Store",
      amount: 620,
      currency: "CAD",
      direction: "owed_by_me" as const,
      dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 15),
      notes: "Monthly payment plan",
    },
    {
      user: userId,
      label: "Shared utilities",
      counterparty: "Roommate",
      amount: 180,
      currency: "CAD",
      direction: "owed_to_me" as const,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 25),
      notes: "Waiting reimbursement",
    },
    {
      user: userId,
      label: "Credit card carry-over",
      counterparty: "Bank",
      amount: 340,
      currency: "CAD",
      direction: "owed_by_me" as const,
      dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 2),
      notes: "Keep utilization in check",
    },
  ];
  await Debt.insertMany(debtDocs);

  return { incomeCount, expenseCount, txCount, debtCount: debtDocs.length };
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for ghost demo seeding.");
  const user = await ensureUser();
  const stats = await seedForUser(user._id as mongoose.Types.ObjectId);
  console.log("Seed complete.");
  console.log(
    JSON.stringify(
      {
        email,
        months,
        reset,
        created: stats,
        loginHint: "Use the seeded email/password in app login.",
      },
      null,
      2
    )
  );
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("Ghost demo seeding failed:", err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});

