import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../../Components/Layout";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useNavigate } from "react-router-dom";
import Button from "../../../Components/Button";
import { Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";

const FrmMiscellaneousMaterialReceiptNoteList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchMiscReceipts = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetMiscReceiptListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          RECEIPT_ID: 1,
          CREATE_MISC_RECEIPT: "MISC001",
          MATERIAL: "A4 Paper",
          QUANTITY: "500",
          STORE_BIN: "Main Store - A01",
          APPROVAL: "Approved",
          STOCK_INCREASE: "Yes",
        },
        {
          RECEIPT_ID: 2,
          CREATE_MISC_RECEIPT: "MISC002",
          MATERIAL: "Paracetamol 500mg",
          QUANTITY: "1000",
          STORE_BIN: "Pharmacy Store - B02",
          APPROVAL: "Pending",
          STOCK_INCREASE: "No",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedReceipts = dummyData.map((rec) => [
          rec.CREATE_MISC_RECEIPT,
          rec.MATERIAL,
          rec.QUANTITY,
          rec.STORE_BIN,
          rec.APPROVAL,
          rec.STOCK_INCREASE,
          <div className="flex justify-center gap-2" key={rec.RECEIPT_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Transaction/FrmMiscellaneousMaterialReceiptNote?mode=2&receiptId=${rec.RECEIPT_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(rec.RECEIPT_ID, rec.CREATE_MISC_RECEIPT)
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedReceipts);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching misc receipts:", error);
      alert("Failed to fetch receipts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchMiscReceipts();
  }, [fetchMiscReceipts]);

  const handleDelete = async (receiptId, receiptNo) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete misc receipt "${receiptNo}"?`,
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);

      // ✅ Fetching IP directly here as per your instruction
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbId,
        in_receiptId: receiptId,
        in_createMiscReceipt: receiptNo,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("MiscReceiptIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchMiscReceipts();
      } else {
        alert(data?.errorMessage || "Failed to delete receipt.");
      }
    } catch (error) {
      console.error("Error deleting receipt:", error);
      alert("An error occurred while deleting the receipt.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing all fields
  const headers = [
    "Create Misc Receipt",
    "Material",
    "Quantity",
    "Store/Bin",
    "Approval",
    "Stock Increase",
    "Actions",
  ];

  return (
    <Layout
      title="Miscellaneous Material Receipt Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Miscellaneous Material Receipt Note",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() =>
          navigate("/Transaction/FrmMiscellaneousMaterialReceiptNote")
        }
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmMiscellaneousMaterialReceiptNoteList;
