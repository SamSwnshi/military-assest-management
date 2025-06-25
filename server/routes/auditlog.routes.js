import { Router } from "express";
import { 
  getAuditLogs, 
  getAuditLogById, 
  getAuditLogsByUser, 
  getAuditLogsByBase,
  getAuditLogStatistics 
} from "../controller/auditlog.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(auth);

// Get all audit logs with filtering and pagination
router.get('/', getAuditLogs);

// Get audit log by ID
router.get('/:id', getAuditLogById);

// Get audit logs by user
router.get('/user/:userId', getAuditLogsByUser);

// Get audit logs by base
router.get('/base/:baseId', getAuditLogsByBase);

// Get audit log statistics
router.get('/statistics/overview', getAuditLogStatistics);

export default router; 