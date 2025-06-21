import { Router } from "express";
import { getMetrics, getNetMovement } from "../controller/dashboard.controller.js";
import auth from "../middleware/auth.js";

const router = Router();
router.get('/metrics',  getMetrics);


router.get('/net-movement', auth,getNetMovement);
export default router;