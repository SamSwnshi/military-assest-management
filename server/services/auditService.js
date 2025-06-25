import AuditLog from '../models/auditlog.js';

class AuditService {
  static async logAction({
    userId,
    action,
    resourceType,
    resourceId = null,
    resourceName = null,
    details = null,
    userAgent = null,
    baseId = null,
    oldValues = null,
    newValues = null
  }) {
    try {
      const auditLog = new AuditLog({
        userId,
        action,
        resourceType,
        resourceId,
        resourceName,
        details,
        userAgent,
        baseId,
        oldValues,
        newValues
      });

      await auditLog.save();
      console.log(`Audit log created: ${action} on ${resourceType}`);
      return auditLog;
    } catch (error) {
      console.error('Error creating audit log:', error);
      // Don't throw error to avoid breaking the main functionality
      return null;
    }
  }

  static async logLogin(userId, userAgent = null) {
    return this.logAction({
      userId,
      action: 'LOGIN',
      resourceType: 'AUTH',
      details: 'User logged in successfully',
      userAgent
    });
  }

  static async logLogout(userId, userAgent = null) {
    return this.logAction({
      userId,
      action: 'LOGOUT',
      resourceType: 'AUTH',
      details: 'User logged out',
      userAgent
    });
  }

  static async logAssetAction(userId, action, assetId, assetName, details = null, oldValues = null, newValues = null, baseId = null) {
    return this.logAction({
      userId,
      action,
      resourceType: 'ASSET',
      resourceId: assetId,
      resourceName: assetName,
      details,
      baseId,
      oldValues,
      newValues
    });
  }

  static async logPurchaseAction(userId, action, purchaseId, details = null, oldValues = null, newValues = null, baseId = null) {
    return this.logAction({
      userId,
      action,
      resourceType: 'PURCHASE',
      resourceId: purchaseId,
      details,
      baseId,
      oldValues,
      newValues
    });
  }

  static async logTransferAction(userId, action, transferId, details = null, oldValues = null, newValues = null, baseId = null) {
    return this.logAction({
      userId,
      action,
      resourceType: 'TRANSFER',
      resourceId: transferId,
      details,
      baseId,
      oldValues,
      newValues
    });
  }

  static async logExpenditureAction(userId, action, expenditureId, details = null, oldValues = null, newValues = null, baseId = null) {
    return this.logAction({
      userId,
      action,
      resourceType: 'EXPENDITURE',
      resourceId: expenditureId,
      details,
      baseId,
      oldValues,
      newValues
    });
  }

  static async logAssignmentAction(userId, action, assignmentId, details = null, oldValues = null, newValues = null, baseId = null) {
    return this.logAction({
      userId,
      action,
      resourceType: 'ASSIGNMENT',
      resourceId: assignmentId,
      details,
      baseId,
      oldValues,
      newValues
    });
  }

  static async logUserAction(userId, action, targetUserId, details = null, oldValues = null, newValues = null) {
    return this.logAction({
      userId,
      action,
      resourceType: 'USER',
      resourceId: targetUserId,
      details,
      oldValues,
      newValues
    });
  }
}

export default AuditService; 