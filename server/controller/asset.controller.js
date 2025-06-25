import Asset from '../models/asset.js'
import AuditService from '../services/auditService.js';

export const getAllAssets = async(req,res)=> {
   try {
    const assets = await Asset.find().populate("baseId", "name");
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assets', error: error.message });
  }
}

export const getAssetById = async(req , res) =>{
   try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch asset', error: error.message });
  }
}

function generateAssetId() {
  // Simple unique assetId generator: 'A' + timestamp + random 3 digits
  return 'A' + Date.now() + Math.floor(Math.random() * 1000);
}

export const createAsset = async(req, res) =>{
    try {
    const { quantity, assetId, ...rest } = req.body;
    const numericQuantity = Number(quantity);
    // Auto-generate assetId if not provided
    const finalAssetId = assetId && assetId.trim() !== '' ? assetId : generateAssetId();
    const asset = new Asset({
      ...rest,
      assetId: finalAssetId,
      quantity: numericQuantity,
      closingBalance: numericQuantity,
      openingBalance: numericQuantity,
    });
    await asset.save();

    // Log asset creation
    await AuditService.logAssetAction(
      req.user._id,
      'ASSET_CREATE',
      asset._id,
      asset.name,
      `Created asset: ${asset.name} with quantity ${numericQuantity}`,
      null,
      asset.toObject(),
      asset.baseId
    );

    res.status(201).json(asset);
  } catch (error) {
    console.error('Asset creation error:', error);
    let errorMsg = error.message || 'Failed to create asset';
    let validationErrors = error.errors ? Object.values(error.errors).map(e => e.message) : null;
    // Handle duplicate assetId error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.assetId) {
      errorMsg = `Asset ID '${error.keyValue.assetId}' already exists. Please use a different Asset ID.`;
    }
    res.status(400).json({ 
      message: errorMsg,
      validationErrors
    });
  }
}

export const updateAsset = async(req, res) =>{
    try {
    const oldAsset = await Asset.findById(req.params.id);
    if (!oldAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Log asset update
    await AuditService.logAssetAction(
      req.user._id,
      'ASSET_UPDATE',
      asset._id,
      asset.name,
      `Updated asset: ${asset.name}`,
      oldAsset.toObject(),
      asset.toObject(),
      asset.baseId
    );

    res.status(200).json(asset);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update asset', error: error.message });
  }
}

export const deleteAsset = async(req, res) =>{
    try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    await Asset.findByIdAndDelete(req.params.id);

    // Log asset deletion
    await AuditService.logAssetAction(
      req.user._id,
      'ASSET_DELETE',
      asset._id,
      asset.name,
      `Deleted asset: ${asset.name}`,
      asset.toObject(),
      null,
      asset.baseId
    );

    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete asset', error: error.message });
  }
}