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

const FrmStoresMasterList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetStoreListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          STORE_ID: 1,
          STORE_CODE: "STR001",
          STORE_NAME: "Central Store",
          LOCATION: "Mumbai",
          STORE_TYPE: "Main Store",
          STATUS: "A",
        },
        {
          STORE_ID: 2,
          STORE_CODE: "STR002",
          STORE_NAME: "Event Store",
          LOCATION: "Delhi",
          STORE_TYPE: "Event Store",
          STATUS: "A",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedStores = dummyData.map((store) => [
          store.STORE_CODE,
          store.STORE_NAME,
          store.LOCATION,
          store.STORE_TYPE,
          store.STATUS === "A" ? "Active" : "Inactive",
          <div className="flex justify-center gap-2" key={store.STORE_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmStoresMaster?mode=2&storeId=${store.STORE_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(store.STORE_ID, store.STORE_NAME, store.STATUS)
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedStores);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      alert("Failed to fetch stores. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleDelete = async (storeId, storeName, storeFlag) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete store "${storeName}"?`,
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
        in_storeId: storeId,
        in_storeName: storeName,
        in_flag: storeFlag,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("StoreIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchStores();
      } else {
        alert(data?.errorMessage || "Failed to delete store.");
      }
    } catch (error) {
      console.error("Error deleting store:", error);
      alert("An error occurred while deleting the store.");
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    "Store Code",
    "Store Name",
    "Location",
    "Store Type",
    "Status",
    "Actions",
  ];

  return (
    <Layout
      title="Stores Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Stores Master",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Master/FrmStoresMaster")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmStoresMasterList;
