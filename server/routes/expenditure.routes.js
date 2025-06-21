import { Router } from "express";
import { createExpenditure, getExpenditure } from "../controller/expendtiure.controller.js";

const router = Router();

router.get('/',getExpenditure)
router.post('/create',createExpenditure)

export default router;