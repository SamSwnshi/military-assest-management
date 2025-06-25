import Purchase from "../models/purchase.js";
import AuditService from "../services/auditService.js";

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
    const totalCost = quantity * unitPrice;

    const purchase = new Purchase({
      assetId,
      baseId,
      quantity,
      unitPrice,
      totalCost,
      status: "delivered"
    });

    await purchase.save();

    // Log purchase creation
    await AuditService.logPurchaseAction(
      req.user._id,
      'PURCHASE',
      purchase._id,
      `Created purchase for ${quantity} units at $${unitPrice} each. Total: $${totalCost}`,
      null,
      purchase.toObject(),
      baseId
    );

    res.status(201).json({ message: "Purchase recorded successfully", purchase });
  } catch (error) {
    console.error('Purchase creation error:', error);
    let errorMsg = error.message || 'Failed to create purchase';
    let validationErrors = error.errors ? Object.values(error.errors).map(e => e.message) : null;
    // Handle duplicate key error
    if (error.code === 11000) {
      errorMsg = 'Duplicate key error: a purchase with the same unique field already exists.';
    }
    res.status(400).json({ 
      message: errorMsg,
      validationErrors
    });
  }
};


export const updatePurchase = async (req, res) => {
  try {
    const oldPurchase = await Purchase.findById(req.params.id);
    if (!oldPurchase) return res.status(404).json({ message: "Purchase not found" });

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPurchase) return res.status(404).json({ message: "Purchase not found" });

    // Log purchase update
    await AuditService.logPurchaseAction(
      req.user._id,
      'UPDATE',
      updatedPurchase._id,
      `Updated purchase details`,
      oldPurchase.toObject(),
      updatedPurchase.toObject(),
      updatedPurchase.baseId
    );

    res.status(200).json(updatedPurchase);
  } catch (error) {
    res.status(400).json({ message: "Failed to update purchase", error: error.message });
  }
};


export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });

    await Purchase.findByIdAndDelete(req.params.id);

    // Log purchase deletion
    await AuditService.logPurchaseAction(
      req.user._id,
      'DELETE',
      purchase._id,
      `Deleted purchase`,
      purchase.toObject(),
      null,
      purchase.baseId
    );

    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete purchase", error: error.message });
  }
};
