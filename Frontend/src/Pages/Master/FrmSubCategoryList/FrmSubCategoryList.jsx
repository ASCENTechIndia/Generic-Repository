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

const FrmSubCategoryList = () => {
  const [tableData, setTableData] = useState([]);
  const [ipAddress, setIpAddress] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  // Fetch IP once
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

  // Fetch Subcategories
  const fetchSubCategories = useCallback(async () => {
    try {
      setLoading(true);
      const payload = { ulbId };
      const { data } = await apiService.post("Subcategorylist", payload);

      if (Array.isArray(data)) {
        const mappedData = data.map((sub) => [
          sub.CATEGORY_NAME, // Category Name
          sub.SUBCATEGORY_NAME, // Subcategory Name
          sub.ACTIVE_FLAG === "A" ? "Active" : "Inactive", // Flag
          <div className="flex justify-center gap-2" key={sub.SUBCATEGORY_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmSubCategoryMaster?mode=2&subcategoryId=${sub.SUBCATEGORY_ID}`
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(
                  sub.SUBCATEGORY_ID,
                  sub.SUBCATEGORY_NAME,
                  sub.ACTIVE_FLAG
                )
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);
        setTableData(mappedData);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      alert("Failed to fetch subcategories. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    if (ulbId) {
      fetchSubCategories();
    }
  }, [fetchSubCategories, ulbId]);

  // Delete handler
  const handleDelete = async (subCategoryId, subCategoryName, flag) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete subcategory "${subCategoryName}"?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbId,
        in_categoryId: subCategoryId,
        in_categoryName: subCategoryName,
        in_parentCatId: null,
        in_flag: flag,
        in_ipaddress: ipAddress,
        in_source: config.source,
      };

      const { data } = await apiService.post("CategoryIns", payload);

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchSubCategories();
      } else {
        alert(data?.errorMessage || "Failed to delete subcategory.");
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      alert("An error occurred while deleting the subcategory.");
    } finally {
      setLoading(false);
    }
  };

  const headers = ["Category Name", "Subcategory Name", "Flag", "Actions"];

  return (
    <Layout
      title="Subcategory Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Subcategories",
      }}
    >
      <div className="flex justify-start mb-4">
        <Button
          type="button"
          className="hover:cursor-pointer"
          onClick={() => navigate("/Master/FrmSubCategoryMaster?mode=1")}
        >
          Add New
        </Button>
      </div>
      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmSubCategoryList;
