import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./HOC/Login/Login";
import FrmMediManage from "./Pages/Transaction/FrmMediManage/FrmMediManage";
import FrmEquipManage from "./Pages/Transaction/FrmEquipManage/FrmEquipManage";
import FrmMedicineForm from "./Pages/Transaction/FrmMediManage/FrmMedicineForm";
import FrmEquipmentForm from "./Pages/Transaction/FrmEquipmentForm/FrmEquipmentForm";
import FrmProcureManage from "./Pages/Transaction/FrmProcurementManage/FrmProcurementManage";
import FrmInventManage from "./Pages/Transaction/FrmInventManage/FrmInventManage";
import FrmNewIssue from "./Pages/Transaction/IndentMaterialIssueNote/FrmNewIssue.jsx";
import FrmViewIssue from "./Pages/Transaction/IndentMaterialIssueNote/FrmViewIssue.jsx";
import FrmCreatePurchaseOrderPage from "./Pages/Transaction/FrmProcurementManage/FrmCreatePurchaseOrderPage";
import FrmItemMaster from "./Pages/Master/FrmItemMaster/FrmItemMaster";
import FrmItemPrtyMst from "./Pages/Master/FrmItemPrtyMst/FrmItemPrtyMst";
import FrmAlerts from "./Pages/Transaction/FrmAlerts/FrmAlerts";
import FrmReports from "./Pages/Transaction/FrmReports/FrmReports";
import FrmCreateAlert from "./Pages/Transaction/FrmAlerts/FrmCreateAlert";
import FrmGenerateReport from "./Pages/Transaction/FrmReports/FrmGenerateReport";
import FrmReturn from "./Pages/Transaction/FrmReturn/FrmReturn";
import FrmReturnForm from "./Pages/Transaction/FrmReturn/FrmReturnForm";
import FrmMaintananceManage from "./Pages/Transaction/FrmMaintainanceMangament/FrmMaintainanceManagement";
import FrmMaintainanceForm from "./Pages/Transaction/FrmMaintainanceMangament/FrmMaintainanceForm";
import FrmCategoryMaster from "./Pages/Master/FrmCategoryMaster/FrmCategoryMaster";
import FrmCategoryList from "./Pages/Master/FrmCategoryList/FrmCategoryList";
import FrmPropertyDefMaster from "./Pages/Master/FrmPropertyDefMaster/FrmPropertyDefMaster";
import FrmFacilityMaster from "./Pages/Master/FrmFacilityMaster/FrmFacilityMaster";
import FrmFacilityList from "./Pages/Master/FrmFacilityList/FrmFacilityList";
import FrmItemMasterList from "./Pages/Master/FrmItemMasterList/FrmItemMasterList";
import FrmVendorMasterList from "./Pages/Master/FrmVendorMasterList/FrmVendorMasterList";
import FrmVendorMaster from "./Pages/Master/FrmVendorMaster/FrmVendorMaster";
import FrmDepartmentMaster from "./Pages/Master/FrmDepartmentMaster/FrmDepartmentMaster";
import FrmDepartmentList from "./Pages/Master/FrmDepartmentMasterList/FrmDepartmentList";
import FrmCurrentStocks from "./Pages/Transaction/FrmCurrentStocks/FrmCurrentStocks";
import FrmStockTransfer from "./Pages/Transaction/FrmInventManage/FrmStockTransfer";
import FrmStockAdjust from "./Pages/Transaction/FrmInventManage/FrmStockAdjust";
import FrmIssueDispense from "./Pages/Transaction/IndentMaterialIssueNote/FrmIssueDispense.jsx";
import FrmEditOrder from "./Pages/Transaction/IndentMaterialIssueNote/FrmEditOrder.jsx";
import FrmEditPurchaseOrder from "./Pages/Transaction/FrmProcurementManage/FrmEditPurchaseOrder";
import RptReturnAdjustment from "./Pages/Reports/RptReturnAdjustment/RptReturnAdjustment";
import FrmPoApprove from "./Pages/Transaction/FrmProcurementManage/FrmPoApprove";
import FrmReturnList from "./Pages/Transaction/FrmReturn/FrmReturnList";
import FrmReportsByDate from "./Pages/Reports/RptReportsByDate/RptReportsByDate";
import RptItem from "./Pages/Reports/RptItem/RptItem";
// import useDynamicFavicon from "./Hooks/useDynamicFavicon";
// import RequireAuth from "./RequireAuth";
import FrmPrescription from "./Pages/Transaction/FrmPrescription/FrmPrescription";
import FrmHospitalList from "./Pages/Master/FrmHospitalList/FrmHospitalList";
import FrmHospitalMst from "./Pages/Master/FrmHospitalMst/FrmHospitalMst";
import FrmSubCategoryList from "./Pages/Master/FrmSubCategoryList/FrmSubCategoryList";
import FrmSubCategoryMaster from "./Pages/Master/FrmSubCategoryMaster/FrmSubCategoryMaster";
import FrmGrnStock from "./Pages/Transaction/FrmGrnStock/FrmGrnStock";
import FrmRequisitionList from "./Pages/Transaction/FrmRequisitionList/FrmRequisitionList";
import FrmRequisitionMst from "./Pages/Transaction/MaterialIndentNote/FrmMaterialIndentNote.jsx";
import FrmGrnStockApproval from "./Pages/Transaction/FrmGrnStockApproval/FrmGrnStockApproval";
import FrmEditGrnStockApproval from "./Pages/Transaction/FrmGrnStockApproval/FrmEditGrnStockApproval";
import RptPendingGRN from "./Pages/Reports/RptPendingGRN/RptPendingGRN";
import ProtectedRoute from "./HOC/ProtectedRoute.jsx";
import FrmLocationMaster from "./Pages/Master/LocationMaster/FrmLocationMaster.jsx";
import FrmLocationMasterList from "./Pages/Master/LocationMaster/FrmLocationMasterList.jsx";
import FrmUnitMeasureCategoryMasterList from "./Pages/Master/UnitMeasureCategoryMaster/FrmUnitMeasureCategoryMasterList.jsx";
import FrmUnitMeasureCategoryMaster from "./Pages/Master/UnitMeasureCategoryMaster/FrmUnitMeasureCategoryMaster.jsx";
import FrmUnitMeasureMasterList from "./Pages/Master/UnitMeasureMaster/FrmUnitMeasureMasterList.jsx";
import FrmUnitMeasureMaster from "./Pages/Master/UnitMeasureMaster/FrmUnitMeasureMaster.jsx";
import FrmStoresMasterList from "./Pages/Master/StoresMaster/FrmStoresMasterList.jsx";
import FrmStoresMaster from "./Pages/Master/StoresMaster/FrmStoresMaster.jsx";
import FrmBinMaster from "./Pages/Master/BinMaster/FrmBinMaster.jsx";
import FrmBinMasterList from "./Pages/Master/BinMaster/FrmBinMasterList.jsx";
import FrmMaterialTypeMasterList from "./Pages/Master/MaterialTypeMaster/FrmMaterialTypeMasterList.jsx";
import FrmMaterialTypeMaster from "./Pages/Master/MaterialTypeMaster/FrmMaterialTypeMaster.jsx";
import FrmMaterialMasterList from "./Pages/Master/MaterialMaster/FrmMaterialMasterList.jsx";
import FrmMaterialMaster from "./Pages/Master/MaterialMaster/FrmMaterialMaster.jsx";
import FrmSupplierMasterList from "./Pages/Master/SupplierMaster/FrmSupplierMasterList.jsx";
import FrmSupplierMaster from "./Pages/Master/SupplierMaster/FrmSupplierMaster.jsx";
import FrmSupplierMaterialMappingList from "./Pages/Master/SupplierMaterialMapping/FrmSupplierMaterialMappingList.jsx";
import FrmSupplierMaterialMapping from "./Pages/Master/SupplierMaterialMapping/FrmSupplierMaterialMapping.jsx";
import FrmRateContractList from "./Pages/Master/RateContract/FrmRateContractList.jsx";
import FrmRateContract from "./Pages/Master/RateContract/FrmRateContract.jsx";
import FrmMaterialOpeningBalanceEntryList from "./Pages/Master/MaterialOpeningBalanceEntry/FrmMaterialOpeningBalanceEntryList.jsx";
import FrmMaterialOpeningBalanceEntry from "./Pages/Master/MaterialOpeningBalanceEntry/FrmMaterialOpeningBalanceEntry.jsx";
import FrmMaterialReceiptNoteList from "./Pages/Transaction/MaterialReceiptNote/FrmMaterialReceiptNoteList.jsx";
import FrmMaterialReceiptNote from "./Pages/Transaction/MaterialReceiptNote/FrmMaterialReceiptNote.jsx";
import FrmNonIndentMaterialIssueNoteList from "./Pages/Transaction/NonIndentMaterialIssueNote/FrmNonIndentMaterialIssueNoteList.jsx";
import FrmNonIndentMaterialIssueNote from "./Pages/Transaction/NonIndentMaterialIssueNote/FrmNonIndentMaterialIssueNote.jsx";
import FrmMaterialTransferIndentList from "./Pages/Transaction/MaterialTransferIndent/FrmMaterialTransferIndentList.jsx";
import FrmMaterialTransferIndent from "./Pages/Transaction/MaterialTransferIndent/FrmMaterialTransferIndent.jsx";
import FrmAdvanceRequisitionFormList from "./Pages/Transaction/AdvanceRequisitionForm/FrmAdvanceRequisitionFormList.jsx";
import FrmAdvanceRequisitionForm from "./Pages/Transaction/AdvanceRequisitionForm/FrmAdvanceRequisitionForm.jsx";
import FrmSupplierBillList from "./Pages/Transaction/SupplierBill/FrmSupplierBillList.jsx";
import FrmSupplierBill from "./Pages/Transaction/SupplierBill/FrmSupplierBill.jsx";
import FrmStockAgingReport from "./Pages/Reports/StockAgingReport/FrmStockAgingReport.jsx";
import FrmDeadStockDisposalList from "./Pages/Transaction/DeadStockDisposal/FrmDeadStockDisposalList.jsx";
import FrmDeadStockDisposal from "./Pages/Transaction/DeadStockDisposal/FrmDeadStockDisposal.jsx";
import FrmMiscellaneousMaterialReceiptNoteList from "./Pages/Transaction/MiscellaneousMaterialReceiptNote/FrmMiscellaneousMaterialReceiptNoteList.jsx";
import FrmMiscellaneousMaterialReceiptNote from "./Pages/Transaction/MiscellaneousMaterialReceiptNote/FrmMiscellaneousMaterialReceiptNote.jsx";

function App() {
  //  useDynamicFavicon();
  const hostname = window.location.hostname;
  const module = hostname.split(".")[0];
  return (
    <>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login module={module}/>} />
          <Route path="/dashboard" element={<RequireAuth module={module}> <Dashboard /> </RequireAuth>}/>
          <Route
            path="/Transaction/FrmMediManage"
            element={<RequireAuth module={module}> <FrmMediManage /></RequireAuth>
          }
          />
          <Route

            path="/Transaction/FrmEquipManage"
            element={<RequireAuth module={module}> <FrmEquipManage /></RequireAuth>
          }
          />
          <Route
            path="/Transaction/FrmMedicineForm"
            element={<RequireAuth module={module}> <FrmMedicineForm /></RequireAuth>
          }
          />
          <Route
            path="/Transaction/FrmEquipmentForm"
            element={<RequireAuth module={module}> <FrmEquipmentForm /></RequireAuth>
          }
          />
          <Route
            path="/Transaction/FrmProcureManage"
            element={<RequireAuth module={module}> <FrmProcureManage /></RequireAuth>
          }
          />
           <Route
            path="/Transaction/FrmPoApprove"
            element={<RequireAuth module={module}> <FrmPoApprove /></RequireAuth>
          }
          />
          <Route
            path="/Transaction/FrmCreatePurchaseOrderPage"
            element={<RequireAuth module={module}> <FrmCreatePurchaseOrderPage /></RequireAuth>
          }
          />
          <Route
            path="/Transaction/FrmInventManage"
            element={<RequireAuth module={module}> <FrmInventManage /></RequireAuth>
          }
          />
          <Route
            path="/Transaction/FrmStockTransfer"
            element={<RequireAuth module={module}> <FrmStockTransfer /></RequireAuth>
          }
          />
          <Route
            path="/Transaction/FrmStockAdjust"
            element={<RequireAuth module={module}> <FrmStockAdjust /></RequireAuth>
          }
          />
          <Route
            path="/Transaction/FrmIssueDispense"
            element={<RequireAuth module={module}> <FrmIssueDispense /></RequireAuth>
          }
          />
          <Route path="/Transaction/FrmNewIssue" element={<RequireAuth module={module}> <FrmNewIssue /></RequireAuth>} />
          <Route
            path="/Transaction/FrmViewIssue/:issueNo"
            element={<RequireAuth module={module}> <FrmViewIssue /></RequireAuth>
          }
          />
         <Route path="/Transaction/FrmRequisitionList" element={<RequireAuth module={module}><FrmRequisitionList /></RequireAuth>} />
          <Route path="/Transaction/FrmRequisitionMst" element={<RequireAuth module={module}><FrmRequisitionMst /></RequireAuth>} />
          <Route path="/Master/FrmItemMaster" element={<RequireAuth module={module}><FrmItemMaster /></RequireAuth>} />
          <Route
            path="/Master/FrmItemMasterList"
            element={<RequireAuth module={module}><FrmItemMasterList/></RequireAuth> }
          />
          <Route
            path="/Master/FrmCategoryMaster"
            element={<RequireAuth module={module}> <FrmCategoryMaster /></RequireAuth>
          }
          />
          <Route
            path="/Master/FrmFacilityMaster"
            element={<RequireAuth module={module}> <FrmFacilityMaster /></RequireAuth>
          }
          />
          <Route
            path="/Master/FrmVendorMasterList"
            element={<RequireAuth module={module}> <FrmVendorMasterList /></RequireAuth>
          }
          />
          <Route path="/Master/FrmVendorMaster" element={<RequireAuth module={module}> <FrmVendorMaster /></RequireAuth>} />
          <Route
            path="/Transaction/FrmCurrentStocks"
            element={<RequireAuth module={module}> <FrmCurrentStocks /></RequireAuth>
          }
          />
          <Route path="/Transaction/FrmEditOrder" element={<RequireAuth module={module}> <FrmEditOrder /></RequireAuth>} />

          <Route
            path="/Master/FrmDepartmentList"
            element={<RequireAuth module={module}> <FrmDepartmentList /></RequireAuth>
          }
          />
          <Route
            path="/Master/FrmDepartmentMaster"
            element={<RequireAuth module={module}> <FrmDepartmentMaster /></RequireAuth>
          }
          />
          <Route
            path="/Master/FrmItemPrtyMst"
            element={<RequireAuth module={module}> <FrmItemPrtyMst entityId={101} entityType="MEDICINE" /></RequireAuth>
          }
          />

          <Route
            path="/Master/FrmCategoryMaster"
            element={<RequireAuth module={module}> <FrmCategoryMaster /></RequireAuth>
          }
          />
          <Route path="/Master/FrmCategoryList" element={<FrmCategoryList />} />
          <Route
            path="/Master/FrmPropertyDefMaster"
            element={<RequireAuth module={module}> <FrmPropertyDefMaster /></RequireAuth>
          }
          />
          <Route
            path="/Master/FrmFacilityMaster"
            element={<RequireAuth module={module}> <FrmFacilityMaster /></RequireAuth>
          }
          />
          <Route path="/Master/FrmFacilityList" element={<RequireAuth module={module}> <FrmFacilityList /></RequireAuth>} />
          <Route path="/Transaction/FrmAlerts" element={<RequireAuth module={module}> <FrmAlerts /></RequireAuth>} />
          <Route path="/Transaction/FrmReports" element={<RequireAuth module={module}> <FrmReports /></RequireAuth>} />
          <Route
            path="/Transaction/FrmCreateAlert"
            element={<RequireAuth module={module}> <FrmCreateAlert /></RequireAuth>
          }
          />
          <Route
            path="/Transaction/FrmGenerateReport"
            element={<RequireAuth module={module}> <FrmGenerateReport /></RequireAuth>
          }
          />

          <Route path="/Transaction/FrmReturn" element={<RequireAuth module={module}> <FrmReturn /></RequireAuth>} />

          <Route
            path="/Transaction/FrmMaintananceManage"
            element={<RequireAuth module={module}> <FrmMaintananceManage /></RequireAuth>
          }
          />

          <Route
            path="/Transaction/FrmMaintainanceForm"
            element={<RequireAuth module={module}> <FrmMaintainanceForm /></RequireAuth>
          }
          />

          <Route
            path="/Transaction/FrmReturnForm"
            element={<RequireAuth module={module}> <FrmReturnForm /></RequireAuth>
          }
          />
          <Route
            path="/Transaction/FrmEditPurchaseOrder"
            element={<RequireAuth module={module}> <FrmEditPurchaseOrder /></RequireAuth>
          }
          />
          <Route
            path="/Report/RptReturnAdjustment"
            element={<RequireAuth module={module}> <RptReturnAdjustment/></RequireAuth>
          }
          />
           <Route
            path="/Transaction/FrmReturnList"
            element={<RequireAuth module={module}> <FrmReturnList/></RequireAuth>
          }
          />
          <Route
            path="/Reports/FrmReportsByDate"
            element={<RequireAuth module={module}> <FrmReportsByDate /></RequireAuth>
          }
          />
           <Route
            path="/Reports/RptItem"
            element={<RequireAuth module={module}> <RptItem /></RequireAuth>
          }/>
          <Route path="/Transaction/FrmPrescription" 
          element={<RequireAuth module={module}><FrmPrescription /> </RequireAuth>
          } 
          />
              <Route path="/Master/FrmHospitalMst" element={<RequireAuth module={module}><FrmHospitalMst /></RequireAuth>} />
          <Route path="/Master/FrmHospitalList" element={<RequireAuth module={module}><FrmHospitalList /></RequireAuth>} />
          <Route path="/Master/FrmSubCategoryList" element={<RequireAuth module={module}><FrmSubCategoryList /></RequireAuth>} />
          <Route path="/Master/FrmSubCategoryMaster" element={<RequireAuth module={module}><FrmSubCategoryMaster /></RequireAuth>} />
            <Route path="/Transaction/FrmGrnStock" element={<RequireAuth module={module}><FrmGrnStock /></RequireAuth>} />
          <Route path="/Transaction/FrmGrnStockApp" element={<RequireAuth module={module}><FrmGrnStockApproval /></RequireAuth>} />
          <Route path="/Transaction/FrmEditGrnStockApproval" element={<RequireAuth module={module}><FrmEditGrnStockApproval /></RequireAuth>} />
                    <Route path="/Reports/RptPendingGRN" element={<RequireAuth module={module}><RptPendingGRN /></RequireAuth>} />

        </Routes>
      </BrowserRouter> */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Master routes */}
                  <Route
                    path="/Master/FrmItemMaster"
                    element={<FrmItemMaster />}
                  />
                  <Route
                    path="/Master/FrmItemMasterList"
                    element={<FrmItemMasterList />}
                  />
                  <Route
                    path="/Master/FrmCategoryMaster"
                    element={<FrmCategoryMaster />}
                  />
                  <Route
                    path="/Master/FrmFacilityMaster"
                    element={<FrmFacilityMaster />}
                  />
                  <Route
                    path="/Master/FrmVendorMasterList"
                    element={<FrmVendorMasterList />}
                  />
                  <Route
                    path="/Master/FrmVendorMaster"
                    element={<FrmVendorMaster />}
                  />
                  <Route
                    path="/Transaction/FrmCurrentStocks"
                    element={<FrmCurrentStocks />}
                  />
                  <Route
                    path="/Transaction/FrmEditOrder"
                    element={<FrmEditOrder />}
                  />

                  <Route
                    path="/Master/FrmDepartmentList"
                    element={<FrmDepartmentList />}
                  />
                  <Route
                    path="/Master/FrmDepartmentMaster"
                    element={<FrmDepartmentMaster />}
                  />
                  <Route
                    path="/Master/FrmItemPrtyMst"
                    element={
                      <FrmItemPrtyMst entityId={101} entityType="MEDICINE" />
                    }
                  />
                  <Route
                    path="/Master/FrmCategoryMaster"
                    element={<FrmCategoryMaster />}
                  />
                  <Route
                    path="/Master/FrmCategoryList"
                    element={<FrmCategoryList />}
                  />
                  <Route
                    path="/Master/FrmPropertyDefMaster"
                    element={<FrmPropertyDefMaster />}
                  />
                  <Route
                    path="/Master/FrmFacilityMaster"
                    element={<FrmFacilityMaster />}
                  />
                  <Route
                    path="/Master/FrmFacilityList"
                    element={<FrmFacilityList />}
                  />
                  <Route
                    path="/Master/FrmLocationMaster"
                    element={<FrmLocationMaster />}
                  />
                  <Route
                    path="/Master/FrmLocationMasterList"
                    element={<FrmLocationMasterList />}
                  />
                  <Route
                    path="/Master/FrmUnitMeasureCategoryMaster"
                    element={<FrmUnitMeasureCategoryMaster />}
                  />
                  <Route
                    path="/Master/FrmUnitMeasureCategoryMasterList"
                    element={<FrmUnitMeasureCategoryMasterList />}
                  />
                  <Route
                    path="/Master/FrmUnitMeasureMaster"
                    element={<FrmUnitMeasureMaster />}
                  />
                  <Route
                    path="/Master/FrmUnitMeasureMasterList"
                    element={<FrmUnitMeasureMasterList />}
                  />
                  <Route
                    path="/Master/FrmStoresMaster"
                    element={<FrmStoresMaster />}
                  />
                  <Route
                    path="/Master/FrmStoresMasterList"
                    element={<FrmStoresMasterList />}
                  />
                  <Route
                    path="/Master/FrmBinMaster"
                    element={<FrmBinMaster />}
                  />
                  <Route
                    path="/Master/FrmBinMasterList"
                    element={<FrmBinMasterList />}
                  />
                  <Route
                    path="/Master/FrmMaterialTypeMaster"
                    element={<FrmMaterialTypeMaster />}
                  />
                  <Route
                    path="/Master/FrmMaterialTypeMasterList"
                    element={<FrmMaterialTypeMasterList />}
                  />
                  <Route
                    path="/Master/FrmMaterialMaster"
                    element={<FrmMaterialMaster />}
                  />
                  <Route
                    path="/Master/FrmMaterialMasterList"
                    element={<FrmMaterialMasterList />}
                  />
                  <Route
                    path="/Master/FrmSupplierMaster"
                    element={<FrmSupplierMaster />}
                  />
                  <Route
                    path="/Master/FrmSupplierMasterList"
                    element={<FrmSupplierMasterList />}
                  />
                  <Route
                    path="/Master/FrmSupplierMaterialMapping"
                    element={<FrmSupplierMaterialMapping />}
                  />
                  <Route
                    path="/Master/FrmSupplierMaterialMappingList"
                    element={<FrmSupplierMaterialMappingList />}
                  />
                  <Route
                    path="/Master/FrmRateContract"
                    element={<FrmRateContract />}
                  />
                  <Route
                    path="/Master/FrmRateContractList"
                    element={<FrmRateContractList />}
                  />
                  <Route
                    path="/Master/FrmMaterialOpeningBalanceEntry"
                    element={<FrmMaterialOpeningBalanceEntry />}
                  />
                  <Route
                    path="/Master/FrmMaterialOpeningBalanceEntryList"
                    element={<FrmMaterialOpeningBalanceEntryList />}
                  />

                  {/* Transaction routes */}
                  <Route
                    path="/Transaction/FrmAlerts"
                    element={<FrmAlerts />}
                  />
                  <Route
                    path="/Transaction/FrmReports"
                    element={<FrmReports />}
                  />
                  <Route
                    path="/Transaction/FrmCreateAlert"
                    element={<FrmCreateAlert />}
                  />
                  <Route
                    path="/Transaction/FrmGenerateReport"
                    element={<FrmGenerateReport />}
                  />
                  <Route
                    path="/Transaction/FrmMediManage"
                    element={<FrmMediManage />}
                  />
                  <Route
                    path="/Transaction/FrmEquipManage"
                    element={<FrmEquipManage />}
                  />
                  <Route
                    path="/Transaction/FrmMedicineForm"
                    element={<FrmMedicineForm />}
                  />
                  <Route
                    path="/Transaction/FrmEquipmentForm"
                    element={<FrmEquipmentForm />}
                  />
                  <Route
                    path="/Transaction/FrmProcureManage"
                    element={<FrmProcureManage />}
                  />
                  <Route
                    path="/Transaction/FrmPoApprove"
                    element={<FrmPoApprove />}
                  />
                  <Route
                    path="/Transaction/FrmCreatePurchaseOrderPage"
                    element={<FrmCreatePurchaseOrderPage />}
                  />
                  <Route
                    path="/Transaction/FrmInventManage"
                    element={<FrmInventManage />}
                  />
                  <Route
                    path="/Transaction/FrmStockTransfer"
                    element={<FrmStockTransfer />}
                  />
                  <Route
                    path="/Transaction/FrmStockAdjust"
                    element={<FrmStockAdjust />}
                  />
                  <Route
                    path="/Transaction/FrmIssueDispense"
                    element={<FrmIssueDispense />}
                  />
                  <Route
                    path="/Transaction/FrmNewIssue"
                    element={<FrmNewIssue />}
                  />
                  <Route
                    path="/Transaction/FrmViewIssue/:issueNo"
                    element={<FrmViewIssue />}
                  />
                  <Route
                    path="/Transaction/FrmRequisitionList"
                    element={<FrmRequisitionList />}
                  />
                  <Route
                    path="/Transaction/FrmRequisitionMst"
                    element={<FrmRequisitionMst />}
                  />

                  <Route
                    path="/Transaction/FrmReturn"
                    element={<FrmReturn />}
                  />

                  <Route
                    path="/Transaction/FrmMaintananceManage"
                    element={<FrmMaintananceManage />}
                  />

                  <Route
                    path="/Transaction/FrmMaintainanceForm"
                    element={<FrmMaintainanceForm />}
                  />

                  <Route
                    path="/Transaction/FrmReturnForm"
                    element={<FrmReturnForm />}
                  />
                  <Route
                    path="/Transaction/FrmEditPurchaseOrder"
                    element={<FrmEditPurchaseOrder />}
                  />
                  <Route
                    path="/Report/RptReturnAdjustment"
                    element={<RptReturnAdjustment />}
                  />
                  <Route
                    path="/Transaction/FrmReturnList"
                    element={<FrmReturnList />}
                  />
                  <Route
                    path="/Transaction/FrmMaterialReceiptNoteList"
                    element={<FrmMaterialReceiptNoteList />}
                  />
                  <Route
                    path="/Transaction/FrmMaterialReceiptNote"
                    element={<FrmMaterialReceiptNote />}
                  />
                  <Route
                    path="/Transaction/FrmNonIndentMaterialIssueNote"
                    element={<FrmNonIndentMaterialIssueNote />}
                  />
                  <Route
                    path="/Transaction/FrmNonIndentMaterialIssueNoteList"
                    element={<FrmNonIndentMaterialIssueNoteList />}
                  />
                  <Route
                    path="/Transaction/FrmMaterialTransferIndent"
                    element={<FrmMaterialTransferIndent />}
                  />
                  <Route
                    path="/Transaction/FrmMaterialTransferIndentList"
                    element={<FrmMaterialTransferIndentList />}
                  />
                  <Route
                    path="/Transaction/FrmAdvanceRequisitionForm"
                    element={<FrmAdvanceRequisitionForm />}
                  />
                  <Route
                    path="/Transaction/FrmAdvanceRequisitionFormList"
                    element={<FrmAdvanceRequisitionFormList />}
                  />
                  <Route
                    path="/Transaction/FrmSupplierBill"
                    element={<FrmSupplierBill />}
                  />
                  <Route
                    path="/Transaction/FrmSupplierBillList"
                    element={<FrmSupplierBillList />}
                  />
                  <Route
                    path="/Transaction/FrmDeadStockDisposal"
                    element={<FrmDeadStockDisposal />}
                  />
                  <Route
                    path="/Transaction/FrmDeadStockDisposalList"
                    element={<FrmDeadStockDisposalList />}
                  />
                  <Route
                    path="/Transaction/FrmMiscellaneousMaterialReceiptNote"
                    element={<FrmMiscellaneousMaterialReceiptNote />}
                  />
                  <Route
                    path="/Transaction/FrmMiscellaneousMaterialReceiptNoteList"
                    element={<FrmMiscellaneousMaterialReceiptNoteList />}
                  />

                  {/* Reports routes */}
                  <Route
                    path="/Reports/FrmReportsByDate"
                    element={<FrmReportsByDate />}
                  />
                  <Route
                    path="/Reports/FrmStockAgingReport"
                    element={<FrmStockAgingReport />}
                  />
                  <Route path="/Reports/RptItem" element={<RptItem />} />

                  <Route
                    path="/Transaction/FrmPrescription"
                    element={<FrmPrescription />}
                  />
                  <Route
                    path="/Master/FrmHospitalMst"
                    element={<FrmHospitalMst />}
                  />
                  <Route
                    path="/Master/FrmHospitalList"
                    element={<FrmHospitalList />}
                  />
                  <Route
                    path="/Master/FrmSubCategoryList"
                    element={<FrmSubCategoryList />}
                  />
                  <Route
                    path="/Master/FrmSubCategoryMaster"
                    element={<FrmSubCategoryMaster />}
                  />
                  <Route
                    path="/Transaction/FrmGrnStock"
                    element={<FrmGrnStock />}
                  />
                  <Route
                    path="/Transaction/FrmGrnStockApp"
                    element={<FrmGrnStockApproval />}
                  />
                  <Route
                    path="/Transaction/FrmEditGrnStockApproval"
                    element={<FrmEditGrnStockApproval />}
                  />
                  <Route
                    path="/Reports/RptPendingGRN"
                    element={<RptPendingGRN />}
                  />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
