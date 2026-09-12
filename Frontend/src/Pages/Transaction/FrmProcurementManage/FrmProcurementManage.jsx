import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Edit,
  Truck,
  Download,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  Printer,
  Send,
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
import ThreeTablePdf from "./ThreeTablePDF";

const FrmProcureManage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ulbId = user?.ulbId;
  const { setLoading } = useLoader();
  const username = user?.username;
  const [showPODetail, setShowPODetail] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [createPOModal, setCreatePOModal] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [ulbName, setUlbName] = useState("");

  const handleViewPO = (po) => {
    console.log("purchse order ;", po);
    setSelectedPO(po);
    setShowPODetail(true);
  };

  // const fetchPurchaseOrders = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const payload = { ulbId: user?.ulbId };
  //     const res = await apiService.post("AoinGetOrderList", payload);

  //     // Check shape
  //     const orders = Array.isArray(res?.data)
  //       ? res.data
  //       : res?.data?.data || [];
  //     const mappedOrders = orders.map((po) => ({
  //       id: po.NUM_PURCHASEORDER_ID,
  //       PONO: po.VAR_PURCHASEORDER_PONO,
  //       supplier: po.VAR_VENDOR_NAME,
  //       created: po.DAT_PURCHASEORDER_DATE
  //         ? new Date(po.DAT_PURCHASEORDER_DATE).toLocaleDateString()
  //         : "N/A",
  //       items: po.NUM_POITEM_QTY || 0,
  //       totalValue: `₹${po.NUM_PURCHASEORDER_TOTALAMOUNT || 0}`,
  //       status: po.VAR_PURCHASEORDER_STATUS || "Unknown",
  //       statusClass:
  //         po.VAR_PURCHASEORDER_STATUS === "R"
  //           ? "bg-red-100 text-red-800"
  //           : po.VAR_PURCHASEORDER_STATUS === "A"
  //           ? "bg-green-100 text-green-800"
  //           : "bg-yellow-100 text-yellow-800",
  //       details: {
  //         expectedDelivery: po.DAT_PURCHASEORDER_EXPDELIVERYDT
  //           ? new Date(po.DAT_PURCHASEORDER_EXPDELIVERYDT).toLocaleDateString()
  //           : "N/A",
  //         supplierContact: po.VAR_VENDOR_CONTACT || "N/A", // if backend sends
  //         deliveryAddress: po.VAR_DELIVERY_ADDRESS || "N/A", // if backend sends
  //         priority: po.VAR_PRIORITY || "Normal",
  //         priorityClass: "bg-blue-100 text-blue-800",
  //         items: orders.filter(
  //           (order) => po.NUM_PURCHASEORDER_ID == order.NUM_PURCHASEORDER_ID
  //         ),
  //         subtotal: `₹${po.NUM_PURCHASEORDER_TOTALAMOUNT || 0}`,
  //         tax: "₹0",
  //         total: `₹${po.NUM_PURCHASEORDER_TOTALAMOUNT || 0}`,
  //       },
  //     }));
  //     setLoading(false);

  //     setPurchaseOrders(mappedOrders);
  //   } catch (error) {
  //     console.error("Error fetching purchase orders:", error);
  //     setPurchaseOrders([]);
  //   }
  // }, [user?.ulbId]);

const fetchPurchaseOrders = useCallback(async () => {
  try {
    setLoading(true);

    const payload = { ulbId: user?.ulbId };
    const res = await apiService.post("AoinGetOrderList", payload);

    // Flatten response
    const orders = Array.isArray(res?.data)
      ? res.data
      : res?.data?.data || [];

    // GROUP BY PO ID
    const grouped = {};

    orders.forEach((po) => {
      const id = po.NUM_PURCHASEORDER_ID;

      if (!grouped[id]) {
        grouped[id] = {
          id,
          PONO: po.VAR_PURCHASEORDER_PONO,
          supplier: po.VAR_VENDOR_NAME,
          created: po.DAT_PURCHASEORDER_DATE
            ? new Date(po.DAT_PURCHASEORDER_DATE).toLocaleDateString()
            : "N/A",
          items: 0,
          totalValue: `₹${po.NUM_PURCHASEORDER_TOTALAMOUNT || 0}`,
          status: po.VAR_PURCHASEORDER_STATUS || "Unknown",
          statusClass:
            po.VAR_PURCHASEORDER_STATUS === "R"
              ? "bg-red-100 text-red-800"
              : po.VAR_PURCHASEORDER_STATUS === "A"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800",

          details: {
            expectedDelivery: po.DAT_PURCHASEORDER_EXPDELIVERYDT
              ? new Date(po.DAT_PURCHASEORDER_EXPDELIVERYDT).toLocaleDateString()
              : "N/A",
            supplierContact: po.VAR_VENDOR_CONTACT || "N/A",
            deliveryAddress: po.VAR_DELIVERY_ADDRESS || "N/A",
            priority: po.VAR_PRIORITY || "Normal",
            priorityClass: "bg-blue-100 text-blue-800",
            items: [],
            subtotal: `₹${po.NUM_PURCHASEORDER_TOTALAMOUNT || 0}`,
            tax: "₹0",
            total: `₹${po.NUM_PURCHASEORDER_TOTALAMOUNT || 0}`,
          },
        };
      }

      // Add item into grouped PO
      grouped[id].details.items.push(po);
      grouped[id].items = grouped[id].details.items.length;
    });

    // 🔥 SORT IN DESC ORDER BY PO ID
    const sorted = Object.values(grouped).sort((a, b) => b.id - a.id);

    setLoading(false);
    setPurchaseOrders(sorted);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    setPurchaseOrders([]);
  }
}, [user?.ulbId]);


  const urlToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    if (user?.ulbId) fetchPurchaseOrders();
    const fetchLogoAndName = async () => {
      try {
        setLoading(true);
        const logoRes = await apiService.post(`textlogo`,{ulbId:ulbId});
        if (logoRes.data?.success) {
          const { ULBLOGO, ABC_MUNICIPAL_TEXT } = logoRes.data.data;

          // convert logo url to base64
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

    if (user?.ulbId) {
      fetchLogoAndName();
    }
  }, [user?.ulbId, fetchPurchaseOrders]);

  return (
    <Layout
      title="Purchase Order"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Purchase Order",
      }}
    >
      <div className="p-6">
        {/* Create PO */}
        <div className="flex justify-start mb-6">
          <Button
            onClick={() => navigate("/Transaction/FrmCreatePurchaseOrderPage")}
          >
            Create Purchase Order
          </Button>
        </div>

        {createPOModal ? (
          <FrmCreatePurchaseOrderPage onClose={() => setCreatePOModal(false)} />
        ) : (
          <>
            {/* Stats */}
            {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {[
                { number: "24", label: "Pending PO" },
                { number: "18", label: "Approval Needed" },
                { number: "42", label: "Items to Order" },
                { number: "₹284,500", label: "Pending Budget" },
                { number: "7", label: "Delayed Orders" },
                { number: "92%", label: "Procurement Rate" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-sm p-4 text-center"
                >
                  <div className="text-2xl font-bold text-blue-700">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div> */}

            {/* Filters */}
            {/* <div className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
              <input
                type="text"
                placeholder="Search PO, supplier..."
                className="p-2 border border-gray-300 rounded-md col-span-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
              </select>
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <option value="">All Suppliers</option>
                <option value="PharmaCorp">PharmaCorp Inc.</option>
                <option value="MediSupplies">MediSupplies Ltd.</option>
              </select>
              <input
                type="date"
                className="p-2 border border-gray-300 rounded-md"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
              />
              <Button className="flex items-center justify-center">
                <Filter className="w-4 h-4 mr-1" /> Apply
              </Button>
            </div> */}

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
                  // "Actions",
                ]}
                data={purchaseOrders.map((po) => [
                  <button
                    className="text-blue-600 hover:underline"
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
                
                ])}
              />
            </div>
          </>
        )}

        {/* PO Detail View */}
        {showPODetail && selectedPO && (
          <div className="bg-white rounded-lg shadow-sm mt-6">
            <div className="p-4 border-b flex justify-between items-center">
              <Label text={`Purchase Order Details: ${selectedPO.id}`} />
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
                    ["PO Number", selectedPO.id],
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
                  // "",
                  item.VAR_POITEM_NAME,
                  item.NUM_POITEM_QTY,
                  item.NUM_POITEM_PRICE,
                  item.NUM_POITEM_TOTAL,
                  <span
                    className={`px-2 py-1 bg-gray-100 rounded-full text-xs ${selectedPO.statusClass}`}
                  >
                    {item.VAR_PURCHASEORDER_STATUS === "A"
                      ? "Approved"
                      : item.VAR_PURCHASEORDER_STATUS === "R"
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
                  ["Priority", selectedPO.details.priority],
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
                  // "",
                  item.VAR_POITEM_NAME,
                  item.NUM_POITEM_QTY,
                  item.NUM_POITEM_PRICE,
                  item.NUM_POITEM_TOTAL,
                  <>
                    {item.VAR_PURCHASEORDER_STATUS === "A"
                      ? "Approved"
                      : item.VAR_PURCHASEORDER_STATUS === "R"
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

export default FrmProcureManage;
