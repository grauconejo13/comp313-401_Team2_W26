import { Router } from 'express';
import { getTemplates } from '../controllers/template.controller';
import { Template } from '../models/Template.model';

const router = Router();

router.get("/", async (req, res) => {
  const templates = await Template.find();
  res.json(templates);
});

export default router;
