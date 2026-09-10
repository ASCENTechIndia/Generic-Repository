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

const FrmMaterialOpeningBalanceEntryList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchOpeningBalances = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetOpeningBalanceListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          BALANCE_ID: 1,
          MATERIAL: "A4 Paper",
          STORE: "Main Store",
          BIN: "A01",
          OPENING_QTY: "500",
          RATE: "250",
          OPENING_VALUE: "125000",
        },
        {
          BALANCE_ID: 2,
          MATERIAL: "Paracetamol 500mg",
          STORE: "Pharmacy Store",
          BIN: "B02",
          OPENING_QTY: "1000",
          RATE: "10",
          OPENING_VALUE: "10000",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedBalances = dummyData.map((bal) => [
          bal.MATERIAL,
          bal.STORE,
          bal.BIN,
          bal.OPENING_QTY,
          bal.RATE,
          bal.OPENING_VALUE,
          <div className="flex justify-center gap-2" key={bal.BALANCE_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmMaterialOpeningBalanceEntry?mode=2&balanceId=${bal.BALANCE_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() => handleDelete(bal.BALANCE_ID, bal.MATERIAL)}
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedBalances);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching opening balances:", error);
      alert("Failed to fetch opening balances. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchOpeningBalances();
  }, [fetchOpeningBalances]);

  const handleDelete = async (balanceId, materialName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete opening balance for "${materialName}"?`,
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
        in_balanceId: balanceId,
        in_material: materialName,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("OpeningBalanceIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchOpeningBalances();
      } else {
        alert(data?.errorMessage || "Failed to delete opening balance.");
      }
    } catch (error) {
      console.error("Error deleting opening balance:", error);
      alert("An error occurred while deleting the opening balance.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing important fields
  const headers = [
    "Material",
    "Store",
    "Bin",
    "Opening Qty",
    "Rate",
    "Opening Value",
    "Actions",
  ];

  return (
    <Layout
      title="Material Opening Balance Entry"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Material Opening Balance Entry",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Master/FrmMaterialOpeningBalanceEntry")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmMaterialOpeningBalanceEntryList;
