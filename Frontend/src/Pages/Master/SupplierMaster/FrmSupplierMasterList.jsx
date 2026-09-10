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

const FrmSupplierMasterList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetSupplierListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          SUPPLIER_ID: 1,
          SUPPLIER_CODE: "SUP001",
          SUPPLIER_NAME: "MedPlus Distributors",
          CONTACT_PERSON: "John Doe",
          MOBILE: "9876543210",
          EMAIL: "john@medplus.com",
          STATUS: "A",
        },
        {
          SUPPLIER_ID: 2,
          SUPPLIER_CODE: "SUP002",
          SUPPLIER_NAME: "ABC General Store",
          CONTACT_PERSON: "Jane Smith",
          MOBILE: "9123456780",
          EMAIL: "jane@abc.com",
          STATUS: "A",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedSuppliers = dummyData.map((sup) => [
          sup.SUPPLIER_CODE,
          sup.SUPPLIER_NAME,
          sup.CONTACT_PERSON,
          sup.MOBILE,
          sup.EMAIL,
          sup.STATUS === "A" ? "Active" : "Inactive",
          <div className="flex justify-center gap-2" key={sup.SUPPLIER_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmSupplierMaster?mode=2&supplierId=${sup.SUPPLIER_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() => handleDelete(sup.SUPPLIER_ID, sup.SUPPLIER_NAME)}
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedSuppliers);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      alert("Failed to fetch suppliers. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleDelete = async (supplierId, supplierName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete supplier "${supplierName}"?`,
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
        in_supplierId: supplierId,
        in_supplierName: supplierName,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("SupplierIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchSuppliers();
      } else {
        alert(data?.errorMessage || "Failed to delete supplier.");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("An error occurred while deleting the supplier.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing important fields
  const headers = [
    "Supplier Code",
    "Supplier Name",
    "Contact Person",
    "Mobile",
    "Email",
    "Status",
    "Actions",
  ];

  return (
    <Layout
      title="Supplier Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Supplier Master",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Master/FrmSupplierMaster")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmSupplierMasterList;
