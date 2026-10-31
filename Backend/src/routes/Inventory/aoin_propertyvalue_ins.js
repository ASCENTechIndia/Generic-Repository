// routes/propertyValue.js
const express = require("express");
const router = express.Router();
const { aoin_propertyvalue_ins ,getVendorsDropdown,getcategoryDropdown,
    getMedicineList,getEquipmentList,getItemdetails,getStocksList,getUtilizationReport} = require("../../controllers/Inventory/aoin_propertyvalue_ins");

router.post("/aoin_propertyvalue_ins", aoin_propertyvalue_ins);
router.post("/getVendorsDropdown", getVendorsDropdown);
router.post("/getcategoryDropdown", getcategoryDropdown);
router.post("/getMedicineList", getMedicineList);
router.post("/getEquipmentList", getEquipmentList);
router.post("/getItemdetails", getItemdetails);
router.post("/getStocksList", getStocksList);
router.post("/getUtilizationReport", getUtilizationReport);

module.exports = router;
