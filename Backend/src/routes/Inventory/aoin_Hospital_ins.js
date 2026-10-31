const express = require("express");
const router = express.Router();
const {hospitalIns, getHospitalList, getHospitalById}=require("../../controllers/Inventory/aoin_Hospital_ins")

router.post("/hospitalins", hospitalIns);
router.post("/hospitallist", getHospitalList);
router.post("/hospitalgetbyId", getHospitalById);

module.exports = router;