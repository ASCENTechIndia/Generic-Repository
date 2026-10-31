const express = require("express");
const {

  departmentIns,getDepartmentsWithFacility,getDeptById

} = require("../../controllers/Inventory/aoinDeptIns");
const router = express.Router();


router.post("/AoinDeptIns",departmentIns)
router.post("/GetDeptList", getDepartmentsWithFacility);
router.post("/GetListById", getDeptById)


module.exports = router;
