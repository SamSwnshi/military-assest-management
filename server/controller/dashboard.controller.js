import Asset from "../models/asset.js";
import Purchase from "../models/purchase.js";
import Transfer from "../models/transfer.js";
import Assignment from "../models/assignment.js";
import Expenditure from "../models/expenditure.js";

export const getMetrics = async (req, res) => {
  try {
    const { baseId, dateRange } = req.query;
    const [startDate, endDate] = dateRange || [null, null];

    const filters = {};
    if (baseId) {
      filters.baseId = baseId;
    }

    const dateFilter = {};
    if (startDate) {
      dateFilter.createdAt = { ...dateFilter.createdAt, $gte: new Date(startDate) };
    }
    if (endDate) {
      dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(endDate) };
    }

    const assetFilters = { ...filters };
    if (dateFilter.createdAt) {
      assetFilters.createdAt = dateFilter.createdAt;
    }

    let transferFilter = { status: "pending", ...dateFilter };
    if (baseId) {
      transferFilter.fromBaseId = baseId;
    }

    const [totalAssets, totalPurchases, activeTransfers, totalAssignments, expendedAssets] = await Promise.all([
      Asset.countDocuments(assetFilters),
      Purchase.countDocuments({ ...filters, ...dateFilter }),
      Transfer.countDocuments(transferFilter),
      Assignment.countDocuments({ ...filters, ...dateFilter }),
      Expenditure.countDocuments({ ...filters, ...dateFilter })
    ]);

    res.status(200).json({
      totalAssets,
      totalPurchases,
      activeTransfers,
      assignedAssets: totalAssignments,
      expendedAssets
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
