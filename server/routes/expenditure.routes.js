import { Router } from "express";
import { createExpenditure, getExpenditure } from "../controller/expendtiure.controllers.js";

const router = Router();

router.get('/',getExpenditure)
router.post('/create',createExpenditure)

export default router;