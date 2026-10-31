const express = require("express");
const {
  facilityIns,
  getFacilityActiveList,
  getFacilityById,
  getFacilityFullList,
} = require("../../controllers/Inventory/aoinFacitilyIns");

const router = express.Router();

// Insert / Update / Delete Facility
router.post("/AoinFacitilyIns", facilityIns);

// Get active facility list (flag = 'A')
router.post("/GetFacilityActiveList", getFacilityActiveList);

// Get facility details by ID (for autofill)
router.post("/GetFacilityById", getFacilityById);

// Get full facility list (with audit fields)
router.post("/GetFacilityFullList", getFacilityFullList);

module.exports = router;
