import express from "express";
import { Template } from "../models/Template.model";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const template = await Template.create(req.body);
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: "Error creating template" });
  }
});

// READ
router.get("/", async (_req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: "Error fetching templates" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Template.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating template" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting template" });
  }
});

export default router;
