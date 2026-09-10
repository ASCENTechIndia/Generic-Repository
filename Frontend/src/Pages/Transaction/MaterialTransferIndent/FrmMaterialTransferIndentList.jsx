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

const FrmMaterialTransferIndentList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchTransfers = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetMaterialTransferListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          TRANSFER_ID: 1,
          SOURCE_STORE_STOCK: "Main Store - 500 Units",
          TRANSFERRED_QTY: "100",
          DESTINATION_STORE_STOCK: "Pharmacy Store - 50 Units",
          RECEIVED_QTY: "100",
        },
        {
          TRANSFER_ID: 2,
          SOURCE_STORE_STOCK: "Central Store - 200 Units",
          TRANSFERRED_QTY: "50",
          DESTINATION_STORE_STOCK: "Event Store - 10 Units",
          RECEIVED_QTY: "50",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedTransfers = dummyData.map((transfer) => [
          transfer.SOURCE_STORE_STOCK,
          transfer.TRANSFERRED_QTY,
          transfer.DESTINATION_STORE_STOCK,
          transfer.RECEIVED_QTY,
          <div className="flex justify-center gap-2" key={transfer.TRANSFER_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Transaction/FrmMaterialTransferIndent?mode=2&transferId=${transfer.TRANSFER_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(transfer.TRANSFER_ID, transfer.SOURCE_STORE_STOCK)
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedTransfers);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching transfers:", error);
      alert("Failed to fetch transfers. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const handleDelete = async (transferId, sourceStoreStock) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete transfer from "${sourceStoreStock}"?`,
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
        in_transferId: transferId,
        in_sourceStoreStock: sourceStoreStock,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("MaterialTransferIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchTransfers();
      } else {
        alert(data?.errorMessage || "Failed to delete transfer.");
      }
    } catch (error) {
      console.error("Error deleting transfer:", error);
      alert("An error occurred while deleting the transfer.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing important fields
  const headers = [
    "Source Store Stock",
    "Transferred Qty",
    "Destination Store Stock",
    "Received Qty",
    "Actions",
  ];

  return (
    <Layout
      title="Material Transfer Indent Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Material Transfer Indent",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Transaction/FrmMaterialTransferIndent")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmMaterialTransferIndentList;
