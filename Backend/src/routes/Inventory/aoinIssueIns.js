const express = require("express");
const { issueIns, requisitionIns,requisitionList ,requisitionById} = require("../../controllers/Inventory/aoinIssueIns");

const router = express.Router();

// POST API for Issue Insert/Update/Delete
router.post("/AoinIssueIns", issueIns);
router.post("/RequisitionIns",requisitionIns)
router.post("/RequisitionList", requisitionList);
router.post("/RequisitionById", requisitionById);

module.exports = router;
