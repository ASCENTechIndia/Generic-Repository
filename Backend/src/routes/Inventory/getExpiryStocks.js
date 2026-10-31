const express = require("express");
const {getNearExpiryList
} = require("../../controllers/Inventory/getExpiryStocks");

const router = express.Router();

router.post("/getNearExpiryList", getNearExpiryList);

module.exports = router;
