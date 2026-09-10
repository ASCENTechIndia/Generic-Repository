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

const FrmDeadStockDisposalList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchDisposals = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetDeadStockDisposalListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          DISPOSAL_ID: 1,
          DISPOSAL_NO: "DSP001",
          DATE: "2023-11-15",
          MATERIAL: "Expired Paracetamol 500mg",
          BATCH_NO: "BATCH001",
          QTY: "50",
          REASON: "Expired",
          STORE_LOCATION: "Pharmacy Store",
          DISPOSAL_METHOD: "Destroy",
          DISPOSAL_VALUE: "500",
        },
        {
          DISPOSAL_ID: 2,
          DISPOSAL_NO: "DSP002",
          DATE: "2023-11-20",
          MATERIAL: "Old Office Chair",
          BATCH_NO: "-",
          QTY: "3",
          REASON: "Obsolete",
          STORE_LOCATION: "General Store",
          DISPOSAL_METHOD: "Write-off",
          DISPOSAL_VALUE: "3000",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedDisposals = dummyData.map((disp) => [
          disp.DISPOSAL_NO,
          disp.DATE,
          disp.MATERIAL,
          disp.QTY,
          disp.REASON,
          disp.STORE_LOCATION,
          disp.DISPOSAL_METHOD,
          disp.DISPOSAL_VALUE,
          <div className="flex justify-center gap-2" key={disp.DISPOSAL_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Transaction/FrmDeadStockDisposal?mode=2&disposalId=${disp.DISPOSAL_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() => handleDelete(disp.DISPOSAL_ID, disp.DISPOSAL_NO)}
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedDisposals);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching disposals:", error);
      alert("Failed to fetch disposals. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchDisposals();
  }, [fetchDisposals]);

  const handleDelete = async (disposalId, disposalNo) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete disposal "${disposalNo}"?`,
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
        in_disposalId: disposalId,
        in_disposalNo: disposalNo,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("DeadStockDisposalIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchDisposals();
      } else {
        alert(data?.errorMessage || "Failed to delete disposal.");
      }
    } catch (error) {
      console.error("Error deleting disposal:", error);
      alert("An error occurred while deleting the disposal.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing important fields
  const headers = [
    "Disposal No.",
    "Date",
    "Material",
    "Qty",
    "Reason",
    "Store Location",
    "Disposal Method",
    "Disposal Value",
    "Actions",
  ];

  return (
    <Layout
      title="Dead Stock Disposal Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Dead Stock Disposal",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Transaction/FrmDeadStockDisposal")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmDeadStockDisposalList;
