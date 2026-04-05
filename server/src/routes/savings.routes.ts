import { Router } from "express";
import {
  getSavings,
  addSavings,
  withdrawSavings
} from "../controllers/savings.controller";

const router = Router();

router.get("/", getSavings);
router.post("/add", addSavings);
router.post("/withdraw", withdrawSavings);



export default router;
