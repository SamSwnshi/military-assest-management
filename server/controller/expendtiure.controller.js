import Expenditure from "../models/expenditure.js";
import Asset from "../models/asset.js";
import AuditService from "../services/auditService.js";

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
    console.log('Expenditure creation request body:', req.body);
    const { assetId, quantity, expendedBy, reason, notes } = req.body;

    // Input validation with detailed error messages
    if (!assetId) {
      return res.status(400).json({ message: "Asset ID is required" });
    }
    if (!quantity) {
      return res.status(400).json({ message: "Quantity is required" });
    }
    if (!expendedBy) {
      return res.status(400).json({ message: "Expended by user ID is required" });
    }
    if (!reason) {
      return res.status(400).json({ message: "Reason is required" });
    }

    // Validate quantity is a positive number
    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    console.log('Validating asset with ID:', assetId);
    // Check if asset exists
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    console.log('Asset found:', asset.name, 'Current balance:', asset.closingBalance);
    // Check for sufficient balance
    if (asset.closingBalance < quantityNum) {
      return res.status(400).json({ 
        message: `Insufficient asset quantity. Available: ${asset.closingBalance}, Requested: ${quantityNum}` 
      });
    }

    console.log('Validating user with ID:', expendedBy);
    // Check if user exists (you might want to add this validation)
    // const user = await User.findById(expendedBy);
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // Update asset balances
    asset.closingBalance -= quantityNum;
    asset.netMovement -= quantityNum;
    await asset.save();

    console.log('Asset balance updated. New balance:', asset.closingBalance);

    // Create expenditure record
    const expenditure = new Expenditure({
      assetId,
      quantity: quantityNum,
      expendedBy,
      reason,
      notes,
    });

    await expenditure.save();
    console.log('Expenditure saved successfully:', expenditure._id);

    // Log expenditure creation
    await AuditService.logExpenditureAction(
      req.user._id,
      'EXPENDITURE',
      expenditure._id,
      `Expended ${quantityNum} units of ${asset.name}. Reason: ${reason}`,
      null,
      expenditure.toObject(),
      asset.baseId
    );

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
    console.error("Error calculating net movement:", error);
    res.status(500).json({
      message: "Internal server error while calculating net movement",
    });
  }
};
