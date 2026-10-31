const express = require("express");
const {insertGoodsReceiptNote, getGoodsReceiptNoteList, getGoodsReceiptNoteDetbyId,GRNChallanPdf
} = require("../../controllers/Inventory/goodsReceiptNote");

const router = express.Router();

router.post("/insertGoodsReceiptNote", insertGoodsReceiptNote);
router.post("/getGoodsReceiptNoteList", getGoodsReceiptNoteList)
router.post("/getGoodsReceiptNoteDetbyId", getGoodsReceiptNoteDetbyId)
router.post("/GRNChallanPdf", GRNChallanPdf)

module.exports = router;
