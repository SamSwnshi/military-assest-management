import { Router } from "express";
import { createPurchase, deletePurchase, getAllPurchase, getPurchaseById, updatePurchase } from "../controller/purchase.controller.js";
 
const router = Router()

router.get('/',getAllPurchase)
router.get('/:id',getPurchaseById)
router.post('/create',createPurchase);
router.put('/update',updatePurchase)
router.delete('/delete',deletePurchase)

export default router;