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

const FrmBinMasterList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchBins = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetBinListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          BIN_ID: 1,
          BIN_CODE: "BIN001",
          BIN_NAME: "Rack A Bin 1",
          STORE_ID: "STR001",
          RACK_NUMBER: "A1",
          CAPACITY: "100",
        },
        {
          BIN_ID: 2,
          BIN_CODE: "BIN002",
          BIN_NAME: "Rack B Bin 2",
          STORE_ID: "STR002",
          RACK_NUMBER: "B2",
          CAPACITY: "50",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedBins = dummyData.map((bin) => [
          bin.BIN_CODE,
          bin.BIN_NAME,
          bin.STORE_ID,
          bin.RACK_NUMBER,
          bin.CAPACITY,
          <div className="flex justify-center gap-2" key={bin.BIN_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(`/Master/FrmBinMaster?mode=2&binId=${bin.BIN_ID}`)
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() => handleDelete(bin.BIN_ID, bin.BIN_NAME)}
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedBins);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching bins:", error);
      alert("Failed to fetch bins. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchBins();
  }, [fetchBins]);

  const handleDelete = async (binId, binName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete bin "${binName}"?`,
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
        in_binId: binId,
        in_binName: binName,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("BinIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchBins();
      } else {
        alert(data?.errorMessage || "Failed to delete bin.");
      }
    } catch (error) {
      console.error("Error deleting bin:", error);
      alert("An error occurred while deleting the bin.");
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    "Bin Code",
    "Bin Name",
    "Store ID",
    "Rack Number",
    "Capacity",
    "Actions",
  ];

  return (
    <Layout
      title="Bin Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bin Master",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Master/FrmBinMaster")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmBinMasterList;
