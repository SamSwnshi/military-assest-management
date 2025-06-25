import Transfer from "../models/transfer.js";
import Asset from "../models/asset.js";
import AuditService from "../services/auditService.js";

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

    const assetBaseId = (asset.baseId && asset.baseId._id ? asset.baseId._id : asset.baseId).toString();
    if (assetBaseId !== fromBaseId.toString()) {
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

    // Defensive logging
    console.log('asset:', asset);
    console.log('transfer:', transfer);
    console.log('fromBaseId:', fromBaseId);
    console.log('toBaseId:', toBaseId);
    console.log('asset.baseId:', asset.baseId);
    console.log('asset.name:', asset.name);
    console.log('transfer._id:', transfer && transfer._id);

    // Log transfer creation
    const baseIdStr = asset.baseId && asset.baseId._id ? asset.baseId._id.toString() : (asset.baseId ? asset.baseId.toString() : '');
    const assetNameStr = asset && asset.name ? asset.name : '';
    await AuditService.logTransferAction(
      req.user && req.user._id ? req.user._id : null,
      'TRANSFER',
      transfer && transfer._id ? transfer._id : null,
      `Created transfer of ${quantity} units of ${assetNameStr} from base ${fromBaseId} to base ${toBaseId}`,
      null,
      transfer ? transfer.toObject() : null,
      baseIdStr
    );

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
    console.log('updateTransferStatus - transfer:', transfer);
    if (!transfer)
      return res.status(404).json({ message: "Transfer not found" });

    const oldStatus = transfer.status;

    if (status === "completed") {
      const asset = await Asset.findById(transfer.assetId);
      console.log('updateTransferStatus - asset:', asset);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found for this transfer" });
      }
      asset.quantity = parseInt(asset.quantity) + parseInt(transfer.quantity);
      asset.netMovement += parseInt(transfer.quantity);
      asset.baseId = transfer.toBaseId;
      await asset.save();
    }

    transfer.status = status;
    await transfer.save();

    // Log transfer status update
    await AuditService.logTransferAction(
      req.user && req.user._id ? req.user._id : null,
      'UPDATE',
      transfer && transfer._id ? transfer._id : null,
      `Updated transfer status from ${oldStatus} to ${status}`,
      { status: oldStatus },
      { status: transfer.status },
      transfer && transfer.fromBaseId ? (transfer.fromBaseId._id || transfer.fromBaseId) : null
    );

    res
      .status(200)
      .json({ message: "Transfer status updated", data: transfer });
  } catch (error) {
    console.error('Error in updateTransferStatus:', error);
    res
      .status(500)
      .json({
        message: "Failed to update transfer status",
        error: error.message,
      });
  }
};
