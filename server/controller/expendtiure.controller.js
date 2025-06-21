import Expenditure from "../models/expenditure.js";
import Asset from "../models/asset.js";

export const getExpenditure = async (req, res) => {
  try {
    const expenditures = await Expenditure.find()
      .populate("assetId", "name type closingBalance")
      .populate("expendedBy", "firstName lastName role");
    
    res.status(200).json(expenditures);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch expenditures",
      error: error.message,
    });
  }
};

export const createExpenditure = async (req, res) => {
  try {
    const { assetId, quantity, expendedBy, reason, notes } = req.body;

    // Input validation
    if (!assetId || !quantity || !expendedBy || !reason) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Check if asset exists
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Check for sufficient balance
    if (asset.closingBalance < quantity) {
      return res.status(400).json({ message: "Insufficient asset quantity" });
    }

    // Update asset balances
    asset.closingBalance -= quantity;
    asset.netMovement -= quantity;
    await asset.save();

    // Create expenditure record
    const expenditure = new Expenditure({
      assetId,
      quantity,
      expendedBy,
      reason,
      notes,
    });

    await expenditure.save();

    res.status(201).json({
      message: "Expenditure recorded successfully",
      expenditure,
      updatedAsset: {
        name: asset.name,
        closingBalance: asset.closingBalance,
        netMovement: asset.netMovement,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to record expenditure",
      error: error.message,
    });
  }
};
