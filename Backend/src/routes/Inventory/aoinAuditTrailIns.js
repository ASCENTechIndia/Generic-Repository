const express = require("express");
const { auditTrailIns, purchaseOrderReport } = require("../../controllers/Inventory/aoinAuditTrailIns");

const router = express.Router();

// API endpoint
router.post("/AoinAuditTrailIns", auditTrailIns);
router.post('/PoOrderReport', purchaseOrderReport);

module.exports = router;
