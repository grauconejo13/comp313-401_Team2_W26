import { Router } from "express";
import { createGoal } from "../controllers/goal.controller";

const router = Router();

router.post("/", createGoal);
router.get("/", (req, res) => {
  res.json({ message: "Goals route working" });
});

export default router;
