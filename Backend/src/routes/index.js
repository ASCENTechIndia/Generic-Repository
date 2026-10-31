const express = require("express");
const router = express.Router();

const authRoutes = require("./Admin/authRoutes");
router.use("/", authRoutes);

const logoroutes = require("./Admin/logoroutes");
router.use("/", logoroutes);

const logoutRoutes = require("./Admin/logoutRoutes.js");
router.use("/", logoutRoutes);

const menurouted = require("./Admin/menuRoutes.js");
router.use("/", menurouted);

const itemIns = require("./Inventory/aoinItemins.js");
router.use("/", itemIns);

const DeptIns = require("./Inventory/aoinDeptIns.js");
router.use("/", DeptIns);

const FacitilyIns = require("./Inventory/aoinFacitilyIns.js");
router.use("/", FacitilyIns);

const CategoryIns = require("./Inventory/aoinCategoryIns.js");
router.use("/", CategoryIns);

const vendorIns = require("./Inventory/aoinVendorIns.js");
router.use("/", vendorIns);

const purchaseOrderIns= require("./Inventory/aoinPurchaseOrderIns.js");
router.use("/",purchaseOrderIns)

const AuditTrailIns= require("./Inventory/aoinAuditTrailIns.js");
router.use("/",AuditTrailIns)

const propertyDef=require("./Inventory/aoinPropDefController.js");
router.use("/",propertyDef)

const AoinNotificationIns=require("./Inventory/aoinNotificationController.js");
router.use("/",AoinNotificationIns)

const ItemPrtyMst=require("./Inventory/ItemPrtyMst.js");
router.use("/",ItemPrtyMst)

const aoin_propertyvalue_ins=require("./Inventory/aoin_propertyvalue_ins.js");
router.use("/",aoin_propertyvalue_ins)

const aoin_ReturnAdjustment_ins=require("./Inventory/aoin_ReturnAdjustment_ins.js");
router.use("/",aoin_ReturnAdjustment_ins)

const IssueIns = require("./Inventory/aoinIssueIns.js");
router.use("/", IssueIns);

const getExpiryStocks =require("./Inventory/getExpiryStocks.js");
router.use("/",getExpiryStocks);

const getPrescriptiondetails =require("./Inventory/FrmPrescription.js");
router.use("/",getPrescriptiondetails);

const aoin_Hospital_ins =require("./Inventory/aoin_Hospital_ins.js");
router.use("/",aoin_Hospital_ins)

const insertGoodsReceiptNote =require("./Inventory/goodsReceiptNote.js");
router.use("/",insertGoodsReceiptNote)

module.exports = router;
