const express = require("express");
const { purchaseOrderIns, getActivePurchaseOrders, getPurchaseOrders,
    getPurchaseOrderDetailsById,getPurApproveOrders,getIssueIdByAttrId,getPoItemsBySup,PurOrdPdf
,issueDespenseList,getPurApproveGrn, getActivePurchaseOrdersForIssue } = require("../../controllers/Inventory/aoinPurchaseOrderIns");

const router = express.Router();

// POST API for Purchase Order Insert/Update/Delete
router.post("/AoinPurchaseOrderIns", purchaseOrderIns);

router.post("/AoinGetAppStockList", getActivePurchaseOrders);

router.post("/AoinGetAppStockListIssueDes", getActivePurchaseOrdersForIssue);

router.post("/AoinGetOrderList", getPurchaseOrders);

router.post("/AoinPurOrderById", getPurchaseOrderDetailsById);

router.post("/AoinGetPurApproveOrders", getPurApproveOrders);

router.post("/getIssueIdByAttrId", getIssueIdByAttrId);

router.post("/getPoItemsBySup", getPoItemsBySup);

router.post("/PurOrdPdf", PurOrdPdf);

router.post("/issueDespenseList", issueDespenseList)

router.post("/getPurApproveGrn", getPurApproveGrn)

module.exports = router;
