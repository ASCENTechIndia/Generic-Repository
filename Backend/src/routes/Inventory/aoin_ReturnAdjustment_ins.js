// routes/propertyValue.js
const express = require("express");
const router = express.Router();
const { aoin_ReturnAdjustment_ins ,getIssueItemList,getDepartmentddList,
    getIssueList,getReturnAdjustmentList,getReturnAdjbyId,aoin_issueitemutdt_ins,getReturnAdjReport} = require("../../controllers/Inventory/aoin_ReturnAdjustment_ins");

router.post("/aoin_ReturnAdjustment_ins", aoin_ReturnAdjustment_ins);
router.post("/getIssueItemList", getIssueItemList);
router.post("/getDepartmentddList", getDepartmentddList);
router.post("/getIssueList", getIssueList);
router.post("/getReturnAdjustmentList", getReturnAdjustmentList);
router.post("/getReturnAdjbyId", getReturnAdjbyId);
router.post("/aoin_issueitemutdt_ins", aoin_issueitemutdt_ins);
router.post("/getReturnAdjReport", getReturnAdjReport);

module.exports = router;
