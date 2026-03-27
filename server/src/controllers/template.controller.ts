import { Request, Response } from "express";
import { Template } from "../models/Template.model";

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch templates" });
  }
};
