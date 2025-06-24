import { Router } from "express";
import { Login, Logout, Register, getProfile, updateProfile } from "../controller/auth.controller.js";
import auth from "../middleware/auth.js";
const router = Router();

router.post("/login", Login);
router.post("/register", Register);
router.post("/logout", Logout);

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

export default router;