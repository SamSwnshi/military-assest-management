import { Router } from "express";
import { createAsset, deleteAsset, getAllAssets, getAssetById, updateAsset } from "../controller/asset.controller.js";

const router = Router();

router.get('/',getAllAssets)
router.get('/:id',getAssetById)
router.post('/create',createAsset)
router.put('/:id',updateAsset);
router.delete('/:id',deleteAsset)

export default router;