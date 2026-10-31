const express = require("express");
const { vendorIns,vendorList ,vendorsById} = require("../../controllers/Inventory/aoinVendorIns");

const router = express.Router();

// POST API for vendor insert/update/delete
router.post("/AoinVendorIns", vendorIns);
router.post("/vendorList",vendorList)
router.post("/vendorsById",vendorsById)

module.exports = router;
