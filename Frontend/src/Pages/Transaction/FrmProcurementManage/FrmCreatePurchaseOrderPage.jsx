import React, { useState } from "react";
import { X } from "lucide-react";
import FrmSelectSupplierTab from "./FrmSelectSupplierTab";
import FrmAddItemsTab from "./FrmAddItemsTab";
import FrmReviewSubmitTab from "./FrmReviewSubmitTab";
import { useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import GetIPAddress from "../../../utils/ipHelper";
import { useLoader } from "../../../Context/LoaderContext";
import config from "../../../utils/config";

const FrmCreatePurchaseOrderPage = ({ onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [currentTab, setCurrentTab] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [poItems, setPoItems] = useState([]);
const [deliveryDate, setDeliveryDate] = useState(new Date());

  const userId = user?.userId;
  const ulbId = user?.ulbId;

  const handleClose = () => {
    navigate("/Transaction/FrmProcureManage");
  };
  
  const handleNext = () => {
//  if (currentTab === 2 && !isQuantityValid()) {
//     alert("Some items exceed available stock. Please correct quantities before proceeding.");
//     return;
//   }

    if (currentTab === 1 && !selectedSupplier) {
      alert("Please select a supplier.");
      return;
    }
    if (currentTab === 2 && poItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }
    setCurrentTab(currentTab + 1);
  };

  function formatDateYear(date) {
    if (!date) {
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

const handleSubmit = async (formValues = {}) => {
  if (!deliveryDate) {
    alert("Please select a delivery date.");
    return;
  }

  const { deliveryAddress = "", notes = "" } = formValues;

  const subtotal = poItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.12;
  const totalAmount = subtotal + tax;

  const poItemStr = poItems
  .map((item) => {
    const total = item.quantity * item.rate;
    return `${item.name}#${item.categoryid}#${item.quantity}#${item.id}#${item.rate}#${total}`;
  })
  .join("$");
  
 const reqIds = poItems.map(item => item.reqItemId).join(",");
 console.log("Request Item IDs:", reqIds);
  const ip = await GetIPAddress();

  setLoading(true);

  const payload = {
    in_userId: userId,
    in_mode: 1,
    in_ulbId: ulbId,
    in_porderId: null,
    in_vendorId: selectedSupplier.id,
    in_poDate: new Date().toISOString().split("T")[0],
    in_expDeliveryDt: formatDateYear(deliveryDate),
    in_status: "null",
    in_totalAmount: totalAmount,
    in_approvedBy: userId,
    in_approvedDt: new Date().toISOString().split("T")[0],
    In_poitemstr: poItemStr,
    In_deliaddres: String(deliveryAddress), // ✅ from child form
    In_addnotes: String(notes),             // ✅ from child form
    in_ipaddress: ip,
    in_source: config.source,
  };
console.log("Payload", payload)

  try {
    const response = await apiService.post("AoinPurchaseOrderIns", payload);
    setLoading(false);

    if (response.data.errorCode === 9999) {
      alert(response.data.errorMessage);
      navigate("/Transaction/FrmProcureManage");
    } else {
      alert(response.data.errorMessage);
    }
  } catch (error) {
    console.error("Submission error:", error);
    alert("An error occurred during submission.");
  }
};

  const isQuantityValid = () => {
  return poItems.every((item) => item.quantity <= item.currentStock);
};

  return (
    <Layout
      title="Procurement Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Procurement Management",
      }}
    >
      <div>
        {/* <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold">Create New Purchase Order</h3>
          <button
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-md"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div> */}

        <div>
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                currentTab === 1
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setCurrentTab(1)}
            >
              1. Select Supplier
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                currentTab === 2
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setCurrentTab(2)}
              disabled={!selectedSupplier}
            >
              2. Add Items
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                currentTab === 3
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setCurrentTab(3)}
              disabled={poItems.length === 0}
            >
              3. Review & Submit
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Tab 1: Select Supplier */}
          {currentTab === 1 && (
            <FrmSelectSupplierTab
              selectedSupplier={selectedSupplier}
              setSelectedSupplier={setSelectedSupplier}
              onNext={() => setCurrentTab(2)}
            />
          )}

          {/* Tab 2: Add Items */}
          {currentTab === 2 && (
            <FrmAddItemsTab
              poItems={poItems}
              setPoItems={setPoItems}
              onNext={() => setCurrentTab(3)}
              onBack={() => setCurrentTab(1)}
               selectedSupplier={selectedSupplier}
            />
          )}

          {/* Tab 3: Review & Submit */}
          {currentTab === 3 && (
            <FrmReviewSubmitTab
              selectedSupplier={selectedSupplier}
              poItems={poItems}
              deliveryDate={deliveryDate}
              setDeliveryDate={setDeliveryDate}
              onBack={() => setCurrentTab(2)}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          {currentTab < 3 ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleNext} // The key change is here
            >
              Next
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FrmCreatePurchaseOrderPage;
