import Transfer from "../models/transfer.js";
import Asset from "../models/asset.js";

export const getAllTransfer = async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate("assetId")
      .populate("fromBaseId")
      .populate("toBaseId")
      .populate("transferredBy");

    res.status(200).json(transfers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch transfers", error: error.message });
  }
};

export const createTransfer = async (req, res) => {
  try {
    console.log('Transfer request body:', req.body);
    const { assetId, fromBaseId, toBaseId, quantity, transferredBy, notes } =
      req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    if (asset.baseId.toString() !== fromBaseId) {
      return res
        .status(400)
        .json({ message: "Asset doesn't belong to the specified source base" });
    }

    const availableQty = parseInt(asset.quantity);
    if (quantity > availableQty) {
      return res
        .status(400)
        .json({ message: "Insufficient asset quantity at source base" });
    }

    asset.quantity = availableQty - quantity;
    asset.netMovement -= quantity;
    await asset.save();

    const transfer = new Transfer({
      assetId,
      fromBaseId,
      toBaseId,
      quantity,
      transferredBy,
      notes,
      status: "pending",
    });

    await transfer.save();

    res.status(201).json({ message: "Transfer created", data: transfer });
  } catch (error) {
    console.error('Error in createTransfer:', error);
    res
      .status(500)
      .json({ message: "Transfer creation failed", error: error.message });
  }
};

export const updateTransferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const transfer = await Transfer.findById(id);
    if (!transfer)
      return res.status(404).json({ message: "Transfer not found" });

    if (status === "completed") {
      const asset = await Asset.findById(transfer.assetId);
      asset.quantity = parseInt(asset.quantity) + transfer.quantity;
      asset.netMovement += transfer.quantity;
      asset.baseId = transfer.toBaseId;
      await asset.save();
    }

    transfer.status = status;
    await transfer.save();

    res
      .status(200)
      .json({ message: "Transfer status updated", data: transfer });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to update transfer status",
        error: error.message,
      });
  }
};
