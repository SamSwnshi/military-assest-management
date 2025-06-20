import { Router } from "express";
import { createTransfer, getAllTransfer, updateTransferStatus } from "../controller/transfer.controller.js";

const router = Router();

router.get('/',getAllTransfer)
router.post('/create',createTransfer)
router.put('/:id',updateTransferStatus)

export default router;