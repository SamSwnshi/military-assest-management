import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT',
      'TRANSFER', 'PURCHASE', 'EXPENDITURE', 'ASSIGNMENT', 'ASSET_CREATE',
      'ASSET_UPDATE', 'ASSET_DELETE', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE'
    ]
  },
  resourceType: {
    type: String,
    required: true,
    enum: ['ASSET', 'PURCHASE', 'TRANSFER', 'EXPENDITURE', 'ASSIGNMENT', 'USER', 'BASE', 'AUTH']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Optional for actions like LOGIN/LOGOUT
  },
  resourceName: {
    type: String,
    required: false
  },
  details: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  baseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: false
  },
  oldValues: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  newValues: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  }
}, { timestamps: true });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;