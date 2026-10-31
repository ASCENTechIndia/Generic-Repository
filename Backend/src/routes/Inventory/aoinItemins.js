const express = require("express");
const {
  itemIns,
  getItemActiveList,
  getItemList,
  getItemDetail,
} = require("../../controllers/Inventory/aoinItemins");
const router = express.Router();

router.post("/AoinItemIns", itemIns);
router.post("/GetItemActiveList", getItemActiveList);
router.post("/GetItemList", getItemList);
router.post("/GetItemDetail", getItemDetail);

module.exports = router;
