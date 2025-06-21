import Asset from "../models/asset.js";
import Purchase from "../models/purchase.js";
import Transfer from "../models/transfer.js";
import Assignment from "../models/assignment.js";

export const getMetrics = async (req, res) => {
  try {
    const [totalAssets, totalPurchases, activeTransfers, totalAssignments] = await Promise.all([
      Asset.countDocuments(),
      Purchase.countDocuments(),
      Transfer.countDocuments({ status: "pending" }),
      Assignment.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard metrics fetched successfully",
      data: {
        totalAssets,
        totalPurchases,
        activeTransfers,
        assignedAssets: totalAssignments,
      },
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching dashboard metrics",
    });
  }
};

export const getNetMovement = async (req, res) => {
  try {
    if (!req.user || !req.user.baseId) {
      return res.status(400).json({
        success: false,
        message: "User baseId is missing. Cannot apply base-level filtering.",
      });
    }

    const baseId = req.user.baseId;

    // Fetch relevant data
    const purchases = await Purchase.find({
      baseId: baseId,
      status: "delivered",
    }).populate("assetId", "name type");

    const transfersIn = await Transfer.find({
      toBaseId: baseId,
      status: "completed",
    }).populate("assetId", "name type");

    const transfersOut = await Transfer.find({
      fromBaseId: baseId,
      status: "completed",
    }).populate("assetId", "name type");

    res.status(200).json({
      success: true,
      message: "Net movement data fetched successfully",
      data: {
        purchases,
        transfersIn,
        transfersOut,
      },
    });
  } catch (error) {
    console.error("Error fetching net movement:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching net movement",
    });
  }
};
