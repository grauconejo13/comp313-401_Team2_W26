import { Router } from "express";

const router = Router();

router.post("/currency", async (req, res) => {
  const { currency } = req.body;

  res.json({
    message: "Currency preference saved",
    currency
  });
});

export default router;