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
import { formatDateMonth } from "../../../utils/dateUtils";
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

const FrmEditGrnStockApproval = ({ onApprove, onReject }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbId = user?.ulbId;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const queryParams = new URLSearchParams(location.search);
  const grnId = queryParams.get("id");
  const { statusGRN } = location.state || null;

  const [items, setItems] = useState([]);
  const [grnDetails, setGRNDetails] = useState(null);

  // 🔹 Fetch PO data, logo, and ULB name
useEffect(() => {
  const fetchData = async () => {
    if (!grnId || !ulbId) return;

    try {
      setLoading(true);

      const poRes = await apiService.post("getGoodsReceiptNoteDetbyId", {
        grnId: parseInt(grnId, 10),
        ulbId: ulbId,
      });

      if (poRes?.data?.success && Array.isArray(poRes.data.data)) {
        const apiData = poRes.data.data;
        console.log("api", apiData)
        setGRNDetails({
          vendorId: apiData[0].VENDOR_ID,
          pono: apiData[0].PONO,
          invoiceNo: apiData[0].INVOICE_NO,
          status: apiData[0].STATUS,
          challanDate : apiData[0].CHALLAN_DATE,
          receivedBy : apiData[0].RECEIVED_BY,
          receivedDate : apiData[0].RECEIVED_DATE,
          receivingStore : apiData[0].RECEIVING_STORE,
        });

        const mappedItems = apiData.map((row, idx) => ({
          id: row.GRN_ID,
          itemId: row.ITEM_ID,
          name: row.ITEM_NAME,
          categoryId: row.CATEGORY_ID,
          category: row.CATEGORY_NAME,
          poQty: row.PO_QTY,
          quantity: row.DELIVERY_QTY,
          batch: row.BATCHNO,
          expiry: row.EXPIRY_DATE,
          remarks: row.REMARKS,
        }));

        setItems(mappedItems);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [grnId, ulbId]);

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
      // readOnly
      className="w-20 border border-gray-300 rounded-md px-1 py-1 text-center"
      onChange={(e) => handleQuantityChange(index, e.target.value)}
    />,
  ]);

  const downloadPDF = async () => {
    try {
      setLoading(true);

      const payload = {
        "grnId": grnId,
        "ulbid": ulbId
      };

      const response = await axios.post(`${API_BASE_URL}/GRNChallanPdf`, payload, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Goods Receipt Note.pdf";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.message); 
    } finally {
      setLoading(false);
    }
  }

  // 🔹 API call to approve or reject the PO
 const handleStatusUpdate = async (status) => {
  try {
    if (!grnDetails || !userId || !ulbId || items.length === 0) {
      alert("GRN data is not yet available. Please try again.");
      return;
    }

    const ip = await GetIPAddress();
    setLoading(true);

    // ✅ build item string from STATE
    const grnItemStr = items
      .map(item =>
        [
          item.itemId,
          item.name,
          item.categoryId,
          item.poQty,
          item.quantity,
          item.batch,
          formatDateMonth(item.expiry),
          item.remarks || ""
        ].join("#")
      )
      .join("$");

    const payload = {
      in_userId: userId,
      in_mode: 2,
      in_UlbId: Number(ulbId),
      in_grnId: Number(grnId),
      in_Vendorid: grnDetails.vendorId,
      in_PONo: grnDetails.pono,
      in_invoiceno: grnDetails.invoiceNo,
      in_challandate: formatDateMonth(grnDetails.challanDate),
      in_receivedbye: grnDetails.receivedBy,
      in_receiveddate: formatDateMonth(grnDetails.receivedDate),
      in_Receivingstore: grnDetails.receivingStore,
      in_status: status,        
      in_grnItemStr: grnItemStr,
      in_ipaddress: ip,
      in_source: config.source,
    };

    console.log("FINAL PAYLOAD", payload);
    const res = await apiService.post("insertGoodsReceiptNote", payload);

    if (res?.data?.errorCode === 9999) {
      alert(res.data.errorMessage);

      if (status === "A") {
        await downloadPDF();
      }
      navigate("/Transaction/FrmGrnStockApp");
    } else {
      alert(res.data.errorMessage);
    }
  } catch (error) {
    console.error("Error updating GRN status:", error);
    alert("An error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Layout
      title="Goods Receipt Note"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Edit Goods Receipt Note",
      }}
    >
      <div>
        {/* <h2 className="text-xl font-semibold mb-6">Edit Goods Receipt Note</h2> */}
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
            disabled={statusGRN === "Approved"}
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

export default FrmEditGrnStockApproval;
