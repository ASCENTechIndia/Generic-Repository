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

const FrmSupplierMaterialMappingList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchMappings = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetSupplierMaterialMappingListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          MAPPING_ID: 1,
          SUPPLIER_ID: "SUP001",
          MATERIAL_ID: "MAT001",
          SUPPLIER_MATERIAL_CODE: "SUPMAT001",
          PURCHASE_RATE: "100",
          MIN_ORDER_QTY: "50",
          LEAD_TIME: "7 Days",
          STATUS: "A",
        },
        {
          MAPPING_ID: 2,
          SUPPLIER_ID: "SUP002",
          MATERIAL_ID: "MAT002",
          SUPPLIER_MATERIAL_CODE: "SUPMAT002",
          PURCHASE_RATE: "200",
          MIN_ORDER_QTY: "20",
          LEAD_TIME: "3 Days",
          STATUS: "A",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedMappings = dummyData.map((mapping) => [
          mapping.SUPPLIER_ID,
          mapping.MATERIAL_ID,
          mapping.SUPPLIER_MATERIAL_CODE,
          mapping.PURCHASE_RATE,
          mapping.MIN_ORDER_QTY,
          mapping.LEAD_TIME,
          mapping.STATUS === "A" ? "Active" : "Inactive",
          <div className="flex justify-center gap-2" key={mapping.MAPPING_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmSupplierMaterialMapping?mode=2&mappingId=${mapping.MAPPING_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(mapping.MAPPING_ID, mapping.SUPPLIER_MATERIAL_CODE)
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedMappings);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching mappings:", error);
      alert("Failed to fetch mappings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  const handleDelete = async (mappingId, supplierMaterialCode) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete mapping "${supplierMaterialCode}"?`,
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
        in_mappingId: mappingId,
        in_supplierMaterialCode: supplierMaterialCode,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("SupplierMaterialMappingIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchMappings();
      } else {
        alert(data?.errorMessage || "Failed to delete mapping.");
      }
    } catch (error) {
      console.error("Error deleting mapping:", error);
      alert("An error occurred while deleting the mapping.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing important fields
  const headers = [
    "Supplier ID",
    "Material ID",
    "Supplier Material Code",
    "Purchase Rate",
    "Min Order Qty",
    "Lead Time",
    "Status",
    "Actions",
  ];

  return (
    <Layout
      title="Supplier Material Mapping"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Supplier Material Mapping",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Master/FrmSupplierMaterialMapping")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmSupplierMaterialMappingList;
