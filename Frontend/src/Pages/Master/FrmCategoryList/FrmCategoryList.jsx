import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../../Components/Layout";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useNavigate } from "react-router-dom";
import Button from "../../../Components/Button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext"; // ✅ Added for loader

import GetIPAddress from "../../../utils/ipHelper"; // ✅ IP helper
import config from "../../../utils/config"; // ✅ Centralized source

const FrmCategoryList = () => {
  const [tableData, setTableData] = useState([]);
  const [ipAddress, setIpAddress] = useState(""); // ✅ Store IP here
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader(); // ✅ Destructured setLoading

  const ulbId = user?.ulbId;
  const userId = user?.userId; // ✅ Fetch IP address once

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
  }, []); // ✅ Fetch category list

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true); // ✅ Show loader
      const payload = { ulbId };
      const { data } = await apiService.post("GetCategoryListByUlb", payload);

      if (Array.isArray(data)) {
        const mappedCategories = data.map((cat) => [
          cat.CATEGORY_NAME,
          cat.CATEGORY_FLAG === "A" ? "Active" : "Inactive",
          <div className="flex justify-center gap-2" key={cat.CATEGORY_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmCategoryMaster?mode=2&categoryId=${cat.CATEGORY_ID}`
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(
                  cat.CATEGORY_ID,
                  cat.CATEGORY_NAME,
                  cat.CATEGORY_FLAG
                )
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
      setLoading(false); // ✅ Hide loader
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // ✅ Delete handler

  const handleDelete = async (categoryId, categoryName, categoryFlag) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete category "${categoryName}"?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true); // ✅ Show loader
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbId,
        in_categoryId: categoryId,
        in_categoryName: categoryName,
        in_parentCatId: null,
        in_flag: categoryFlag,
        in_ipaddress: ipAddress, // ✅ using helper
        in_source: config.source, // ✅ centralized
      };

      const { data } = await apiService.post("CategoryIns", payload);

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
      setLoading(false); // ✅ Hide loader
    }
  };

  const headers = ["Category Name", "Flag", "Actions"];

  return (
    <Layout
      title="Category Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Categories",
      }}
    >
        <Button
          type="button"
          className="hover:cursor-pointer "
          onClick={() => navigate("/Master/FrmCategoryMaster")}
        >
          Add New
        </Button>
    
      <Table  headers={headers} data={tableData} /> 
    </Layout>
  );
};

export default FrmCategoryList;
