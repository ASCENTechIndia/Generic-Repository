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

const FrmMaterialMasterList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetMaterialListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          MATERIAL_ID: 1,
          MATERIAL_CODE: "MAT001",
          MATERIAL_NAME: "Paracetamol 500mg",
          MATERIAL_TYPE: "Medical",
          CATEGORY: "Tablets",
          UOM: "Strip",
          REORDER_LEVEL: "100",
          STATUS: "A",
        },
        {
          MATERIAL_ID: 2,
          MATERIAL_CODE: "MAT002",
          MATERIAL_NAME: "A4 Paper Ream",
          MATERIAL_TYPE: "General",
          CATEGORY: "Stationery",
          UOM: "Packet",
          REORDER_LEVEL: "20",
          STATUS: "A",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedMaterials = dummyData.map((mat) => [
          mat.MATERIAL_CODE,
          mat.MATERIAL_NAME,
          mat.MATERIAL_TYPE,
          mat.CATEGORY,
          mat.UOM,
          mat.REORDER_LEVEL,
          mat.STATUS === "A" ? "Active" : "Inactive",
          <div className="flex justify-center gap-2" key={mat.MATERIAL_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmMaterialMaster?mode=2&materialId=${mat.MATERIAL_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() => handleDelete(mat.MATERIAL_ID, mat.MATERIAL_NAME)}
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedMaterials);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      alert("Failed to fetch materials. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleDelete = async (materialId, materialName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete material "${materialName}"?`,
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
        in_materialId: materialId,
        in_materialName: materialName,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("MaterialIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchMaterials();
      } else {
        alert(data?.errorMessage || "Failed to delete material.");
      }
    } catch (error) {
      console.error("Error deleting material:", error);
      alert("An error occurred while deleting the material.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing important fields (not all 15 to keep the table readable)
  const headers = [
    "Material Code",
    "Material Name",
    "Material Type",
    "Category",
    "UOM",
    "Reorder Level",
    "Status",
    "Actions",
  ];

  return (
    <Layout
      title="Material Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Material Master",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Master/FrmMaterialMaster")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmMaterialMasterList;
