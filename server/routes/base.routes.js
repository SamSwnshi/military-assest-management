import { Router } from "express";
import {
  createBase,
  deleteBase,
  getAllBase,
  getBaseById,
  updateBase,
} from "../controller/base.controller.js";
import  authVerify  from "../middleware/auth.js";
const router = Router();

router.get("/", getAllBase);
router.get("/:id", getBaseById);
router.post("/create", authVerify, createBase);
router.put("/update", updateBase);
router.get("/delete", deleteBase);
export default router;
