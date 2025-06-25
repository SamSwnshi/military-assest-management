import mongoose from 'mongoose';
import AuditLog from '../models/auditlog.js';
import User from '../models/user.models.js';
import dotenv from 'dotenv';

dotenv.config();

const populateAuditLogs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Get a user for testing
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    // Sample audit log entries
    const sampleLogs = [
      {
        userId: user._id,
        action: 'LOGIN',
        resourceType: 'AUTH',
        details: 'User logged in successfully',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        baseId: user.baseId
      },
      {
        userId: user._id,
        action: 'ASSET_CREATE',
        resourceType: 'ASSET',
        resourceName: 'M4 Carbine',
        details: 'Created new asset: M4 Carbine with quantity 50',
        baseId: user.baseId
      },
      {
        userId: user._id,
        action: 'PURCHASE',
        resourceType: 'PURCHASE',
        details: 'Created purchase for 25 units at $1200 each. Total: $30000',
        baseId: user.baseId
      },
      {
        userId: user._id,
        action: 'TRANSFER',
        resourceType: 'TRANSFER',
        details: 'Created transfer of 10 units of M4 Carbine between bases',
        baseId: user.baseId
      },
      {
        userId: user._id,
        action: 'EXPENDITURE',
        resourceType: 'EXPENDITURE',
        details: 'Expended 5 units of M4 Carbine. Reason: Training exercise',
        baseId: user.baseId
      },
      {
        userId: user._id,
        action: 'ASSET_UPDATE',
        resourceType: 'ASSET',
        resourceName: 'M4 Carbine',
        details: 'Updated asset quantity and status',
        baseId: user.baseId
      }
    ];

    // Create audit logs
    for (const logData of sampleLogs) {
      const auditLog = new AuditLog(logData);
      await auditLog.save();
      console.log(`Created audit log: ${logData.action}`);
    }

    console.log('Audit logs populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating audit logs:', error);
    process.exit(1);
  }
};

populateAuditLogs(); 