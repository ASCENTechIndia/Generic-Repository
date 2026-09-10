import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import Table from "../../../Components/Table";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import GetIPAddress from "../../../utils/ipHelper";
import { useLoader } from "../../../Context/LoaderContext";
import config from "../../../utils/config";
import FrmPurchaseOrderPDF from "../../../Components/PDFButton/FrmPurchaseOrderPDF";
import axios from "axios";

// 🔹 New helper function to convert a URL to a Base64 string
const urlToBase64 = async (url) => {
  if (!url) return null;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to Base64:", url, error);
    return null;
  }
};

const FrmEditPurchaseOrder = ({ onApprove, onReject }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userId = user?.username;
  const ulbId = user?.ulbId;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const queryParams = new URLSearchParams(location.search);
  const purchaseOrderId = queryParams.get("id");
  const [items, setItems] = useState([]);
  const [poDetails, setPoDetails] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [ulbName, setUlbName] = useState("");

  // 🔹 Fetch PO data, logo, and ULB name
  useEffect(() => {
    const fetchData = async () => {
      if (!purchaseOrderId || !ulbId) {
        return;
      }

      try {
        setLoading(true);

        // Fetch PO data
        const poRes = await apiService.post("AoinPurOrderById", {
          purchaseOrderId: parseInt(purchaseOrderId, 10),
        });

        if (poRes?.data?.success && Array.isArray(poRes.data.data)) {
          const firstPo = poRes.data.data[0];
          setPoDetails(firstPo);
          const mappedItems = poRes.data.data.map((row, idx) => ({
            id: `${row.NUM_PURCHASEORDER_ID}-${idx}`,
            name: row.VAR_POITEM_NAME,
            category: row.VAR_CATEGORY_NAME,
            categoryid: row.VAR_POITEM_CATEGORY,
            quantity: row.NUM_POITEM_QTY,
            price: row.NUM_POITEM_PRICE,
            status: row.VAR_PURCHASEORDER_STATUS,
            attribute_id: row.NUM_POITEM_ATTRIBUTEID,
          }));
          setItems(mappedItems);
        }

        // Fetch logo and ULB name and convert logo to Base64
        const logoRes = await apiService.post(`textlogo`, { ulbId: ulbId });
        if (logoRes.data?.success) {
          const { ULBLOGO, ABC_MUNICIPAL_TEXT } = logoRes.data.data;

          // 🔹 Convert the logo URL to a Base64 string here
          const base64Logo = await urlToBase64(ULBLOGO);
          setLogoUrl(base64Logo);
          setUlbName(ABC_MUNICIPAL_TEXT + " ");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [purchaseOrderId, ulbId, setLoading]);

  // 🔹 Update quantity and recalc total
  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...items];
    const qty = parseInt(newQuantity) || 0;
    updatedItems[index].quantity = qty;
    updatedItems[index].total = qty * updatedItems[index].price;
    setItems(updatedItems);
  };



  // 🔹 Format any date value into YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d)) return null;
    return d.toISOString().slice(0, 10);
  };

  // 🔹 Totals calculation
  const { subtotal, tax, total } = useMemo(() => {
    const subtotalCalc = items.reduce((sum, item) => sum + item.total, 0);
    const taxCalc = subtotalCalc * 0.12;
    return {
      subtotal: subtotalCalc,
      tax: taxCalc,
      total: subtotalCalc + taxCalc,
    };
  }, [items]);

  // 🔹 Table formatting
  const headers = ["Item", "Category", "Quantity"];
  const data = items.map((item, index) => [
    <div key={item.id}>
      <div className="font-medium">{item.name}</div>
    </div>,
    <div className="font-medium text-gray-500">{item.category}</div>,
    <input
      key={`qty-${item.id}`}
      type="number"
      value={item.quantity}
      min="1"
      readOnly
      className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center"
      onChange={(e) => handleQuantityChange(index, e.target.value)}
    />,
    // <button
    //   key={`del-${item.id}`}
    //   onClick={() => handleDelete(index)}
    //   className="text-red-600 hover:text-red-800"
    // >
    //   <Trash2 size={18} />
    // </button>,
  ]);

  // 🔹 Function to handle PDF download
  // const handleDownloadPDF = async () => {
  //   if (!poDetails || items.length === 0 || !ulbName) {
  //     console.error("Missing essential data for PDF generation.");
  //     alert("Missing data for PDF generation. Please try again.");
  //     return;
  //   }

  //   // Check for logoUrl, which is now a Base64 string
  //   if (logoUrl === null) {
  //     alert("Logo is not available yet. Please wait a moment and try again.");
  //     return;
  //   }

  //   try {
  //     const pdfBlob = await pdf(
  //       <FrmPurchaseOrderPDF
  //         poDetails={poDetails}
  //         items={items}
  //         approvedBy={userId}
  //         ulbName={ulbName}
  //         logoUrl={logoUrl}
  //       />
  //     ).toBlob();
  //     saveAs(pdfBlob, `PurchaseOrder_${poDetails.VAR_PURCHASEORDER_PONO}.pdf`);
  //   } catch (err) {
  //     console.error("Detailed PDF Error:", err);
  //     alert("PDF generation failed.");
  //   }
  // };

  const downloadPdf = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/PurOrdPdf`,
        {
          purchaseOrderId: parseInt(purchaseOrderId, 10),
        },
        {
          responseType: "blob", // important
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "PurchaseOrder.pdf";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 API call to approve or reject the PO
  const handleStatusUpdate = async (status) => {
    try {
      const formattedItems = items
        .map((item) =>{
            const total = item.quantity * item.price;
        return `${item.name}#${item.categoryid}#${item.quantity}#${item.attribute_id}#${item.price}#${total}`
    })
        .join("$");

      if (!poDetails || !userId || !ulbId) {
        alert("PO data is not yet available. Please try again.");
        return;
      }
      const ip = await GetIPAddress();
      setLoading(true);
      const payload = {
        in_userId: userId,
        in_mode: 2,
        in_ulbId: ulbId,
        in_porderId: parseInt(purchaseOrderId, 10),
        in_vendorId: poDetails.NUM_PURCHASEORDER_VENDORID,
        in_poDate: formatDate(poDetails.DAT_PURCHASEORDER_DATE),
        in_expDeliveryDt: formatDate(poDetails.DAT_PURCHASEORDER_EXPDELIVERYDT),
        in_status: status,
        in_totalAmount: total,
        in_approvedBy: userId,
        in_approvedDt: formatDate(new Date().toISOString().slice(0, 10)),
        In_poitemstr: formattedItems,
         In_deliaddres: String(poDetails.VAR_PURCHASEORDER_DELIADDRES), // ✅ from child form
    In_addnotes: String(poDetails.VAR_PURCHASEORDER_ADDNOTES),
        in_ipaddress: ip,
        in_source: config.source,
      };
      const res = await apiService.post("AoinPurchaseOrderIns", payload);
      setLoading(false);

      if (res.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        if (status === "A") {
          await downloadPdf();
        }

        navigate("/Transaction/FrmPoApprove");
      } else {
        alert(res.data.errorMessage);
      }
    } catch (error) {
      console.error("Error updating purchase order status:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false)
    }
  };

  return (
    <Layout
      title="Purchase Order"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Edit Purchase Order",
      }}
    >
      <div>
        {/* <h2 className="text-xl font-semibold mb-6">Edit Purchase Order</h2> */}
        <Table
          headers={headers}
          data={data}
          headerlabel="Order List"
          columnStyles={[
            "text-left",
            "text-center",
            "text-center",
            "text-center",
          ]}
        />

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={() => handleStatusUpdate("R")}
            className="bg-red-500 hover:bg-red-600"
          >
            Reject
          </Button>
          <Button
            onClick={() => handleStatusUpdate("A")}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve & Download
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default FrmEditPurchaseOrder;
