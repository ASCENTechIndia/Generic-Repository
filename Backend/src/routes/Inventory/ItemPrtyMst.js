const express = require("express");
const {savePropertyDefinition,
  getPropertyDefinitions,
  savePropertyValues,
} = require("../../controllers/Inventory/ItemPrtyMst");

const router = express.Router();

router.post("/savePropertyDefinition", savePropertyDefinition);
router.post("/getPropertyDefinitions", getPropertyDefinitions);
router.post("/savePropertyValues", savePropertyValues);

module.exports = router;
