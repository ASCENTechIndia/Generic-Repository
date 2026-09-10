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

const FrmRateContractList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchRateContracts = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetRateContractListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          RATE_CONTRACT_ID: 1,
          RATE_CONTRACT_NO: "RC001",
          SUPPLIER: "MedPlus Distributors",
          MATERIAL: "Paracetamol 500mg",
          UOM: "Strip",
          RATE: "100",
          TAX: "12%",
          STATUS: "A",
        },
        {
          RATE_CONTRACT_ID: 2,
          RATE_CONTRACT_NO: "RC002",
          SUPPLIER: "ABC General Store",
          MATERIAL: "A4 Paper Ream",
          UOM: "Packet",
          RATE: "200",
          TAX: "18%",
          STATUS: "A",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedRateContracts = dummyData.map((rc) => [
          rc.RATE_CONTRACT_NO,
          rc.SUPPLIER,
          rc.MATERIAL,
          rc.UOM,
          rc.RATE,
          rc.TAX,
          rc.STATUS === "A" ? "Active" : "Inactive",
          <div className="flex justify-center gap-2" key={rc.RATE_CONTRACT_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmRateContract?mode=2&rateContractId=${rc.RATE_CONTRACT_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(rc.RATE_CONTRACT_ID, rc.RATE_CONTRACT_NO)
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedRateContracts);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching rate contracts:", error);
      alert("Failed to fetch rate contracts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchRateContracts();
  }, [fetchRateContracts]);

  const handleDelete = async (rateContractId, rateContractNo) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete rate contract "${rateContractNo}"?`,
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
        in_rateContractId: rateContractId,
        in_rateContractNo: rateContractNo,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("RateContractIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchRateContracts();
      } else {
        alert(data?.errorMessage || "Failed to delete rate contract.");
      }
    } catch (error) {
      console.error("Error deleting rate contract:", error);
      alert("An error occurred while deleting the rate contract.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing important fields
  const headers = [
    "Rate Contract No",
    "Supplier",
    "Material",
    "UOM",
    "Rate",
    "Tax",
    "Status",
    "Actions",
  ];

  return (
    <Layout
      title="Rate Contract Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Rate Contract",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Master/FrmRateContract")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmRateContractList;
