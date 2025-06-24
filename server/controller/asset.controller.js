import Asset from '../models/asset.js'
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

export const createAsset = async(req, res) =>{
    try {
    const { quantity, ...rest } = req.body;
    const numericQuantity = Number(quantity);
    const asset = new Asset({
      ...rest,
      quantity: numericQuantity,
      closingBalance: numericQuantity,
      openingBalance: numericQuantity,
    });
    await asset.save();
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create asset', error: error.message });
  }
}
export const updateAsset = async(req, res) =>{
    try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(200).json(asset);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update asset', error: error.message });
  }
}
export const deleteAsset = async(req, res) =>{
    try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete asset', error: error.message });
  }
}