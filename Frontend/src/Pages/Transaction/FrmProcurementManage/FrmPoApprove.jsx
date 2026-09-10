import { useState, useEffect, useCallback } from "react";
import {
  Edit,
  Truck,
  X,
} from "lucide-react";

import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import { useNavigate } from "react-router-dom";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import FrmCreatePurchaseOrderPage from "./FrmCreatePurchaseOrderPage";
import ThreeTablePdf from "../FrmProcurementManage/ThreeTablePDF";

const FrmPoApprove = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const username = user?.username;
  const [showPODetail, setShowPODetail] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [createPOModal, setCreatePOModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [ulbName, setUlbName] = useState("");

  const handleViewPO = (po) => {
    setSelectedPO(po);
    setShowPODetail(true);
  };

  const urlToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

const fetchPurchaseOrders = useCallback(async () => {
  try {
    setLoading(true);

    const payload = { ulbId: user?.ulbId };
    const res = await apiService.post("AoinGetPurApproveOrders", payload);

    const orders = Array.isArray(res?.data)
      ? res.data
      : res?.data?.data || [];
    // console.log("Order", orders)
    // -------------------------------
    // GROUP ORDERS BY PO ID
    // -------------------------------
    const grouped = {};

  orders.forEach((o) => {
  const id = o.NUM_PURCHASEORDER_ID;

  // 1️⃣ FIRST: create PO if not exists
  if (!grouped[id]) {
    grouped[id] = {
      id,
      PONO: o.VAR_PURCHASEORDER_PONO,
      supplier: o.VAR_VENDOR_NAME,
      created: o.DAT_PURCHASEORDER_DATE
        ? new Date(o.DAT_PURCHASEORDER_DATE).toLocaleDateString()
        : "N/A",

      items: 0,

      totalAmount: 0,        // ✅ initialize
      totalValue: "₹0",

      status: o.VAR_PURCHASEORDER_STATUS || "Unknown",
      statusClass:
        o.VAR_PURCHASEORDER_STATUS === "R"
          ? "bg-red-100 text-red-800"
          : o.VAR_PURCHASEORDER_STATUS === "A"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800",

      details: {
        expectedDelivery: o.DAT_PURCHASEORDER_EXPDELIVERYDT
          ? new Date(o.DAT_PURCHASEORDER_EXPDELIVERYDT).toLocaleDateString()
          : "N/A",
        supplierContact: o.VAR_VENDOR_CONTACT || "N/A",
        deliveryAddress: o.VAR_DELIVERY_ADDRESS || "N/A",
        priority: o.VAR_PRIORITY || "Normal",
        priorityClass: "bg-blue-100 text-blue-800",
        items: [],
        subtotal: 0,         // ✅ number
        tax: 0,
        total: 0,
      },
    };
  }

  // 2️⃣ calculate item total
  const itemTotal =
    o.NUM_POITEM_TOTAL ??
    (o.NUM_POITEM_QTY || 0) * (o.NUM_POITEM_PRICE || 0);

  // 3️⃣ NOW safe to add
  grouped[id].totalAmount += itemTotal;
  grouped[id].details.subtotal += itemTotal;

  // 4️⃣ push item
  grouped[id].details.items.push({
    name: o.VAR_POITEM_NAME,
    quantity: o.NUM_POITEM_QTY,
    unitPrice: `₹${o.NUM_POITEM_PRICE}`,
    total: `₹${itemTotal}`,
    status: o.VAR_PURCHASEORDER_STATUS,
  });

  grouped[id].items = grouped[id].details.items.length;
});
Object.values(grouped).forEach((po) => {
  po.totalValue = `₹${po.totalAmount}`;
  po.details.total = `₹${po.totalAmount}`;
  po.details.subtotal = `₹${po.details.subtotal}`;
});
    // -------------------------------
    // Convert grouped object → array
    // -------------------------------
    let finalOrders = Object.values(grouped);

    // -------------------------------
    // Sort PO in DESC order
    // -------------------------------
    finalOrders.sort((a, b) => b.id - a.id);

    setPurchaseOrders(finalOrders);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    setPurchaseOrders([]);
  }
}, [user?.ulbId]);


  const fetchLogoAndName = async () => {
    try {
      setLoading(true);
      const logoRes = await  apiService.post(`textlogo`,{ulbId:user?.ulbId});
      if (logoRes.data?.success) {
        const { ULBLOGO, ABC_MUNICIPAL_TEXT } = logoRes.data.data;

        const base64Logo = await urlToBase64(ULBLOGO);

        setLogoUrl(base64Logo);
        setUlbName(ABC_MUNICIPAL_TEXT + " ");
      }
    } catch (error) {
      console.error("Error fetching ULB logo/name:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.ulbId) {
      fetchLogoAndName();
      fetchPurchaseOrders();
    }
  }, [user?.ulbId, fetchPurchaseOrders]);

  return (
    <Layout
      title="Procurement Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Procurement Management",
      }}
    >
      <div className="p-6">
    
        {createPOModal ? (
          <FrmCreatePurchaseOrderPage onClose={() => setCreatePOModal(false)} />
        ) : (
          <>

            {/* Purchase Orders Table */}
            <div>
              {/* <div className="p-4 border-b flex justify-between items-center">
                <Label text="Purchase Orders" className="font-semibold" />
              </div> */}
              <Table
                headers={[
                  "PO Number",
                  "Supplier",
                  "Created",
                  "Status",
                  "Actions",
                ]}
                data={purchaseOrders.map((po) => [
                  <button
                    className="text-blue-600 hover:underline hover:cursor-pointer"
                    onClick={() => handleViewPO(po)}
                  >
                    {po.PONO}
                  </button>,
                  po.supplier,
                  username,
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${po.statusClass}`}
                  >
                    {po.status === "A"
                      ? "Approved"
                      : po.status === "R"
                      ? "Rejected"
                      : "Pending"}
                  </span>,
                  <div className="flex space-x-2 justify-center">
                    <Button
                      className="hover:cursor-pointer"
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/Transaction/FrmEditPurchaseOrder?mode=2&id=${po.id}`
                        )
                      }
                    >
                      <Edit className="text-blue-600 underline border border-blue-500 p-1 rounded-md" />
                    </Button>
                    {po.status === "Ordered" && (
                      <Button variant="outline" className="text-green-600">
                        <Truck className="w-4 h-4" />
                      </Button>
                    )}
                  </div>,
                ])}
              />
            </div>
          </>
        )}

        {/* PO Detail View */}
        {showPODetail && selectedPO && (
          <div className="bg-white rounded-lg shadow-sm mt-6">
            <div className="p-4 border-b flex justify-between items-center">
              <Label text={`Purchase Order Details: ${selectedPO.PONO}`} />
              <Button variant="outline" onClick={() => setShowPODetail(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="bg-gray-50 p-4 rounded-md">
                <Label text="Order Information" className="font-medium mb-3" />
                <Table
                  headers={["Field", "Value"]}
                  data={[
                    ["PO Number", selectedPO.PONO.split("-")[1]],
                    ["Created Date", selectedPO.created],
                    ["Supplier", selectedPO.supplier],
                    ["Contact", selectedPO.details.supplierContact],
                    ["Delivery Address", selectedPO.details.deliveryAddress],
                  ]}
                />
              </div>

              {/* Right Column */}
              <div className="bg-gray-50 p-4 rounded-md">
                <Label text="Order Status" className="font-medium mb-3" />
                <Table
                  headers={["Field", "Value"]}
                  data={[
                    [
                      "Current Status",
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${selectedPO.statusClass}`}
                      >
                        {selectedPO.status === "A"
                          ? "Approved"
                          : selectedPO.status === "R"
                          ? "Reject"
                          : "Pending"}
                      </span>,
                    ],
                    ["Expected Delivery", selectedPO.details.expectedDelivery],
                    ["Total Items", selectedPO.items],
                    ["Total Value", selectedPO.totalValue],
                    [
                      "Priority",
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${selectedPO.details.priorityClass}`}
                      >
                        {selectedPO.details.priority}
                      </span>,
                    ],
                  ]}
                />
              </div>
            </div>

            {/* Items Table */}
            <div className="p-4 bg-gray-50 rounded-md">
              <Label text="Order Items" className="font-medium mb-3" />
              <Table
                headers={[
                  "Item Name",
                  "Quantity",
                  "Unit Price",
                  "Total",
                  "Status",
                ]}
                data={selectedPO.details.items.map((item) => [
                  item.name,
                  item.quantity,
                  item.unitPrice,
                  item.total,
                  <span
                    className={`px-2 py-1 bg-gray-100 rounded-full text-xs ${selectedPO.statusClass}`}
                  >
                    {item.status === "A"
                      ? "Approved"
                      : item.status === "R"
                      ? "Reject"
                      : "Pending"}
                  </span>,
                ])}
                footer={[
                  ["Subtotal", "", "", "", selectedPO.details.subtotal],
                  ["Tax", "", "", "", selectedPO.details.tax],
                  ["Total", "", "", "", selectedPO.details.total],
                ]}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 p-4">
         

              <ThreeTablePdf
                ulbName={ulbName}
                logoUrl={logoUrl}
                reportTitle="Purchase Order Details"
                fileName="Purchase-Order.pdf"
                table1Name="Order Information"
                table1Header={["Field", "Value"]}
                table1Data={[
                  ["PO Number", selectedPO.id],
                  ["Created Date", selectedPO.created],
                  ["Supplier", selectedPO.supplier],
                  ["Contact", selectedPO.details.supplierContact],
                  ["Delivery Address", selectedPO.details.deliveryAddress],
                ]}
                // Table 2 Data with name
                table2Name="Order Status"
                table2Header={["Field", "Value"]}
                table2Data={[
                  [
                    "Current Status",
                    <>
                      {selectedPO.status === "A"
                        ? "Approved"
                        : selectedPO.status === "R"
                        ? "Reject"
                        : "Pending"}
                    </>,
                  ],
                  ["Expected Delivery", selectedPO.details.expectedDelivery],
                  ["Total Items", selectedPO.items],
                  ["Total Value", selectedPO.totalValue],
                  ["Priority", <>{selectedPO.details.priority}</>],
                ]}
                table3Name="Order Items"
                table3Header={[
                  "Item Name",
                  "Quantity",
                  "Unit Price",
                  "Total",
                  "Status",
                ]}
                table3Data={selectedPO.details.items.map((item) => [
                  item.name,
                  item.quantity,
                  item.unitPrice,
                  item.total,
                  <>
                    {item.status === "A"
                      ? "Approved"
                      : item.status === "R"
                      ? "Reject"
                      : "Pending"}
                  </>,
                ])}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FrmPoApprove;
