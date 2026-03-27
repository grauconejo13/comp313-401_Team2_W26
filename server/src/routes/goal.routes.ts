import { Router } from "express";
import { createGoal } from "../controllers/goal.controller";

const router = Router();

router.post("/", createGoal);

export default router;
