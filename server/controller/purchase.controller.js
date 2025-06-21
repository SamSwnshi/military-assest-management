import Purchase from "../models/purchase.js";  
export const getAllPurchase = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("assetId").populate("baseId");
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch purchases", error: error.message });
  }
};


export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate("assetId").populate("baseId");
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch purchase", error: error.message });
  }
};


export const createPurchase = async (req, res) => {
  try {
    const { assetId, baseId, quantity, unitPrice } = req.body;
    const totalAmount = quantity * unitPrice;

    const purchase = new Purchase({
      assetId,
      baseId,
      quantity,
      unitPrice,
      totalAmount
    });

    await purchase.save();
    res.status(201).json({ message: "Purchase recorded successfully", purchase });
  } catch (error) {
    res.status(400).json({ message: "Failed to create purchase", error: error.message });
  }
};


export const updatePurchase = async (req, res) => {
  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPurchase) return res.status(404).json({ message: "Purchase not found" });
    res.status(200).json(updatedPurchase);
  } catch (error) {
    res.status(400).json({ message: "Failed to update purchase", error: error.message });
  }
};


export const deletePurchase = async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Purchase not found" });
    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete purchase", error: error.message });
  }
};
