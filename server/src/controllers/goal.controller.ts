import { Request, Response } from "express";
import { Goal } from "../models/Goal.model";

export const createGoal = async (req: Request, res: Response) => {
  try {
    const { name, targetAmount, deadline } = req.body;

    if (!name || !targetAmount || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const goal = new Goal({
      name,
      targetAmount,
      deadline
    });

    await goal.save();

    res.status(201).json({
      message: "Goal created successfully",
      goal
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to create goal" });
  }
};
