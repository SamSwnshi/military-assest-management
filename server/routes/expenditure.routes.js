import { Router } from "express";
import { createExpenditure, getExpenditure } from "../controller/expendtiure.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get('/', auth, getExpenditure)
router.post('/create', auth, createExpenditure)

export default router;