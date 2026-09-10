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

const FrmMaterialTypeMasterList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchMaterialTypes = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetMaterialTypeListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          MATERIAL_TYPE_ID: 1,
          CONSUMABLE: "Consumable",
          STATIONERY: "Stationery",
          ELECTRICAL: "Electrical",
          HARDWARE: "Hardware",
          FURNITURE: "Furniture",
          IT_EQUIPMENT: "IT Equipment",
          CLEANING_MATERIAL: "Cleaning Material",
          RAW_MATERIAL: "Raw Material",
          FINISHED_GOODS: "Finished Goods",
          MAPPED_STORE: "Electrical Store",
        },
        {
          MATERIAL_TYPE_ID: 2,
          CONSUMABLE: "Consumable",
          STATIONERY: "Stationery",
          ELECTRICAL: "Electrical",
          HARDWARE: "Hardware",
          FURNITURE: "Furniture",
          IT_EQUIPMENT: "IT Equipment",
          CLEANING_MATERIAL: "Cleaning Material",
          RAW_MATERIAL: "Raw Material",
          FINISHED_GOODS: "Finished Goods",
          MAPPED_STORE: "General Store",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedMaterialTypes = dummyData.map((mt) => [
          mt.CONSUMABLE,
          mt.STATIONERY,
          mt.ELECTRICAL,
          mt.HARDWARE,
          mt.FURNITURE,
          mt.IT_EQUIPMENT,
          mt.CLEANING_MATERIAL,
          mt.RAW_MATERIAL,
          mt.FINISHED_GOODS,
          mt.MAPPED_STORE,
          <div className="flex justify-center gap-2" key={mt.MATERIAL_TYPE_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmMaterialTypeMaster?mode=2&materialTypeId=${mt.MATERIAL_TYPE_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(
                  mt.MATERIAL_TYPE_ID,
                  mt.CONSUMABLE, // Using consumable as identifier for demo
                )
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedMaterialTypes);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching material types:", error);
      alert("Failed to fetch material types. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchMaterialTypes();
  }, [fetchMaterialTypes]);

  const handleDelete = async (materialTypeId, materialTypeName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete material type "${materialTypeName}"?`,
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
        in_materialTypeId: materialTypeId,
        in_materialTypeName: materialTypeName,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("MaterialTypeIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchMaterialTypes();
      } else {
        alert(data?.errorMessage || "Failed to delete material type.");
      }
    } catch (error) {
      console.error("Error deleting material type:", error);
      alert("An error occurred while deleting the material type.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns with all 10 fields
  const headers = [
    "Consumable",
    "Stationery",
    "Electrical",
    "Hardware",
    "Furniture",
    "IT Equipment",
    "Cleaning Material",
    "Raw Material",
    "Finished Goods",
    "Mapped Store",
    "Actions",
  ];

  return (
    <Layout
      title="Material Type Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Material Type Master",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Master/FrmMaterialTypeMaster")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmMaterialTypeMasterList;
