import { Request, Response } from "express";
import { Savings } from "../models/Savings.model";

// Get savings
export const getSavings = async (req: Request, res: Response) => {
  try {
    let savings = await Savings.findOne();

    if (!savings) {
      savings = new Savings({ balance: 0 });
      await savings.save();
    }

    res.status(200).json(savings);
  } catch {
    res.status(500).json({ message: "Failed to fetch savings" });
  }
};

// Add money
export const addSavings = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const savings = await Savings.findOneAndUpdate(
      {},
      { $inc: { balance: amount } },
      { new: true, upsert: true }
    );

    res.json({ message: "Amount added", savings });
  } catch {
    res.status(500).json({ message: "Failed to add amount" });
  }
};

// Remove money
export const withdrawSavings = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    const savings = await Savings.findOne();

    if (!savings || savings.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    savings.balance -= amount;
    await savings.save();

    res.json({ message: "Amount removed", savings });
  } catch {
    res.status(500).json({ message: "Failed to remove amount" });
  }
};
