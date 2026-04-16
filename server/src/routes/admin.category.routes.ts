import express from "express";
import { Category } from "../models/Category.model";
import { authenticate } from "../middleware/auth.middleware";
import { AuthRequest } from "../middleware/auth.middleware";

const router = express.Router();

// CREATE
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthenticated" });
    const { name, type } = req.body as { name?: string; type?: "income" | "expense" };
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    if (type !== "income" && type !== "expense") {
      return res.status(400).json({ message: "Category type must be income or expense" });
    }
    const category = await Category.create({
      name: name.trim(),
      type,
      user: userId,
    });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error creating category" });
  }
});

// READ
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthenticated" });
    const { type } = req.query as { type?: string };
    const filter: Record<string, unknown> = { user: userId };
    if (type === "income" || type === "expense") filter.type = type;
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// UPDATE
router.put("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthenticated" });
    const updated = await Category.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      {
      new: true,
      }
    );
    if (!updated) return res.status(404).json({ message: "Category not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating category" });
  }
});

// DELETE
router.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthenticated" });
    const deleted = await Category.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!deleted) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category" });
  }
});

export default router;
