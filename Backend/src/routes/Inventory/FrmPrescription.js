const express = require("express");
const { aopd_prescription_ins,getPrescriptionList,getConsultDataByPId,getPrescriptionDetails } = require("../../controllers/Inventory/FrmPrescription");

const router = express.Router();

router.post("/aopd_prescription_ins", aopd_prescription_ins);
router.post("/getPrescriptionDetails",getPrescriptionDetails);
router.post("/getPrescriptionList", getPrescriptionList);
router.post("/getConsultDataByPId", getConsultDataByPId);

module.exports = router;