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

const FrmUnitMeasureCategoryMasterList = () => {
  const [tableData, setTableData] = useState([]);
  const [ipAddress, setIpAddress] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const ip = await GetIPAddress();
        setIpAddress(ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
        setIpAddress(window.location.hostname || "127.0.0.1");
      }
    };
    fetchIP();
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetUOMCategoryListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          CATEGORY_ID: 1,
          CATEGORY_CODE: "UOMC001",
          CATEGORY_NAME: "Weight",
          DESCRIPTION: "Measuring weight in Kg, Gram, etc.",
          STATUS: "A",
        },
        {
          CATEGORY_ID: 2,
          CATEGORY_CODE: "UOMC002",
          CATEGORY_NAME: "Volume",
          DESCRIPTION: "Measuring volume in Litre, ml, etc.",
          STATUS: "A",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedCategories = dummyData.map((cat) => [
          cat.CATEGORY_CODE,
          cat.CATEGORY_NAME,
          cat.DESCRIPTION,
          cat.STATUS === "A" ? "Active" : "Inactive",
          <div className="flex justify-center gap-2" key={cat.CATEGORY_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmUnitMeasureCategoryMaster?mode=2&categoryId=${cat.CATEGORY_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(cat.CATEGORY_ID, cat.CATEGORY_NAME, cat.STATUS)
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedCategories);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (categoryId, categoryName, categoryFlag) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete category "${categoryName}"?`,
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbId,
        in_categoryId: categoryId,
        in_categoryName: categoryName,
        in_flag: categoryFlag,
        in_ipaddress: ipAddress,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("UOMCategoryIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchCategories();
      } else {
        alert(data?.errorMessage || "Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category.");
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    "Category Code",
    "Category Name",
    "Description",
    "Status",
    "Actions",
  ];

  return (
    <Layout
      title="Unit of Measure Category Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "UOM Categories",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Master/FrmUnitMeasureCategoryMaster")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmUnitMeasureCategoryMasterList;
