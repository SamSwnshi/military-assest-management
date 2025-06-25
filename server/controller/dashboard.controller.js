import Asset from "../models/asset.js";
import Purchase from "../models/purchase.js";
import Transfer from "../models/transfer.js";
import Assignment from "../models/assignment.js";
import Expenditure from "../models/expenditure.js";
import mongoose from "mongoose";

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

    // Net Movement Calculation
    let netMovement = { in: 0, out: 0 };
    if (baseId) {
      // Purchases In
      const purchasesIn = await Purchase.aggregate([
        { $match: { baseId: typeof baseId === 'string' ? mongoose.Types.ObjectId(baseId) : baseId, status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ]);
      // Transfers In
      const transfersIn = await Transfer.aggregate([
        { $match: { toBaseId: typeof baseId === 'string' ? mongoose.Types.ObjectId(baseId) : baseId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ]);
      // Transfers Out
      const transfersOut = await Transfer.aggregate([
        { $match: { fromBaseId: typeof baseId === 'string' ? mongoose.Types.ObjectId(baseId) : baseId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ]);

      // Debug logs
      console.log('User baseId:', baseId);
      console.log('Purchases In:', purchasesIn);
      console.log('Transfers In:', transfersIn);
      console.log('Transfers Out:', transfersOut);

      netMovement.in = (purchasesIn[0]?.total || 0) + (transfersIn[0]?.total || 0);
      netMovement.out = transfersOut[0]?.total || 0;
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
      expendedAssets,
      netMovement
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
    console.log('User data in getNetMovement:', req.user);
    
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const baseId = req.user.baseId;
    console.log('User baseId:', baseId);

    // If user doesn't have a baseId, return zeros (or handle differently based on role)
    if (!baseId) {
      console.log('No baseId found for user, returning zero values');
      return res.status(200).json({
        success: true,
        message: "Net movement calculated successfully (no base assigned)",
        data: {
          purchases: 0,
          transfersIn: 0,
          transfersOut: 0,
          netMovement: 0
        }
      });
    }

    // Validate baseId is a valid ObjectId
    let validBaseId;
    try {
      validBaseId = typeof baseId === 'string' ? mongoose.Types.ObjectId(baseId) : baseId;
    } catch (error) {
      console.error('Invalid baseId format:', baseId);
      return res.status(400).json({
        success: false,
        message: "Invalid base ID format",
      });
    }

    // Simple calculation: Purchases + Transfers In - Transfers Out
    const [purchases, transfersIn, transfersOut] = await Promise.all([
      // Get total purchases (delivered status)
      Purchase.aggregate([
        { 
          $match: { 
            baseId: validBaseId, 
            status: "delivered" 
          } 
        },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ]),
      
      // Get total transfers in (completed status)
      Transfer.aggregate([
        { 
          $match: { 
            toBaseId: validBaseId, 
            status: "completed" 
          } 
        },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ]),
      
      // Get total transfers out (completed status)
      Transfer.aggregate([
        { 
          $match: { 
            fromBaseId: validBaseId, 
            status: "completed" 
          } 
        },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ])
    ]);

    console.log('Aggregation results:', { purchases, transfersIn, transfersOut });

    // Extract totals (default to 0 if no results)
    const totalPurchases = purchases[0]?.total || 0;
    const totalTransfersIn = transfersIn[0]?.total || 0;
    const totalTransfersOut = transfersOut[0]?.total || 0;

    // Calculate net movement: Purchases + Transfers In - Transfers Out
    const netMovement = totalPurchases + totalTransfersIn - totalTransfersOut;

    console.log('Calculated net movement:', {
      totalPurchases,
      totalTransfersIn,
      totalTransfersOut,
      netMovement
    });

    res.status(200).json({
      success: true,
      message: "Net movement calculated successfully",
      data: {
        purchases: totalPurchases,
        transfersIn: totalTransfersIn,
        transfersOut: totalTransfersOut,
        netMovement: netMovement
      }
    });
  } catch (error) {
    console.error("Error calculating net movement:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while calculating net movement",
    });
  }
};
