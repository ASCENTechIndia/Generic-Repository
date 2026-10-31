const express = require("express");
const router = express.Router();
const { notificationIns } = require("../../controllers/Inventory/aoinNotificationController");

// POST /api/notification/ins
router.post("/AoinNotificationIns", notificationIns);

module.exports = router;
