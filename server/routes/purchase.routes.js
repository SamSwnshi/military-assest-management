import { Router } from "express";
import { createPurchase, deletePurchase, getAllPurchase, getPurchaseById, updatePurchase } from "../controller/purchase.controller.js";
import auth from "../middleware/auth.js";
 
const router = Router()

router.use(auth);

router.get('/',getAllPurchase)
router.get('/:id',getPurchaseById)
router.post('/create',createPurchase);
router.put('/update',updatePurchase)
router.delete('/delete',deletePurchase)

export default router;