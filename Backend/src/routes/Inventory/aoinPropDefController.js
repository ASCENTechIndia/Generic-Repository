const express = require("express");
const router = express.Router();
const { propertyDefIns } = require("../../controllers/Inventory/aoinPropDefController");

// POST /api/propertyDef/ins
router.post("/AoinPropertyIns", propertyDefIns);

module.exports = router;
