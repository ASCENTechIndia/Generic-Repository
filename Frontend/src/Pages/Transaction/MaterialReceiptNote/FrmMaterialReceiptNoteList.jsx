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

const FrmMaterialReceiptNoteList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchMRNs = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetMRNListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          MRN_ID: 1,
          MRN_NUMBER: "MRN001",
          PO_NUMBER: "PO001",
          SUPPLIER: "MedPlus Distributors",
          MATERIAL: "A4 Paper",
          RECEIVED_QTY: "500",
          ACCEPTED_QTY: "490",
          RATE: "250",
        },
        {
          MRN_ID: 2,
          MRN_NUMBER: "MRN002",
          PO_NUMBER: "PO002",
          SUPPLIER: "ABC General Store",
          MATERIAL: "Paracetamol 500mg",
          RECEIVED_QTY: "1000",
          ACCEPTED_QTY: "1000",
          RATE: "10",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedMRNs = dummyData.map((mrn) => [
          mrn.MRN_NUMBER,
          mrn.PO_NUMBER,
          mrn.SUPPLIER,
          mrn.MATERIAL,
          mrn.RECEIVED_QTY,
          mrn.ACCEPTED_QTY,
          mrn.RATE,
          <div className="flex justify-center gap-2" key={mrn.MRN_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmMaterialReceiptNote?mode=2&mrnId=${mrn.MRN_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() => handleDelete(mrn.MRN_ID, mrn.MRN_NUMBER)}
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedMRNs);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching MRNs:", error);
      alert("Failed to fetch MRNs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchMRNs();
  }, [fetchMRNs]);

  const handleDelete = async (mrnId, mrnNumber) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete MRN "${mrnNumber}"?`,
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
        in_mrnId: mrnId,
        in_mrnNumber: mrnNumber,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("MRNIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchMRNs();
      } else {
        alert(data?.errorMessage || "Failed to delete MRN.");
      }
    } catch (error) {
      console.error("Error deleting MRN:", error);
      alert("An error occurred while deleting the MRN.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing important fields
  const headers = [
    "MRN Number",
    "PO Number",
    "Supplier",
    "Material",
    "Received Qty",
    "Accepted Qty",
    "Rate",
    "Actions",
  ];

  return (
    <Layout
      title="Material Receipt Note Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Material Receipt Note",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Transaction/FrmMaterialReceiptNote")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmMaterialReceiptNoteList;
