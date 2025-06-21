import { Router } from "express";
import { createAssignment, deleteAssignment, getAssignmnet, getAssignmnetById, updateAssignment } from "../controller/assignment.controller.js";

const router = Router()

router.get("/",getAssignmnet)
router.get("/:id",getAssignmnetById)
router.post('/create',createAssignment)
router.put("/:id",updateAssignment)
router.delete('/:id',deleteAssignment)
export default router