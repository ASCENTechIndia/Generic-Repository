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

const FrmSupplierBillList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetSupplierBillListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          BILL_ID: 1,
          MATERIAL: "Paracetamol 500mg",
          QUANTITY: "100",
          RATE: "10",
          RECEIVED_QUANTITY: "100",
          ACCEPTED_QUANTITY: "95",
          BILLING_QUANTITY: "95",
          BILLING_RATE: "10",
        },
        {
          BILL_ID: 2,
          MATERIAL: "A4 Paper",
          QUANTITY: "500",
          RATE: "250",
          RECEIVED_QUANTITY: "500",
          ACCEPTED_QUANTITY: "490",
          BILLING_QUANTITY: "490",
          BILLING_RATE: "250",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedBills = dummyData.map((bill) => [
          bill.MATERIAL,
          bill.QUANTITY,
          bill.RATE,
          bill.RECEIVED_QUANTITY,
          bill.ACCEPTED_QUANTITY,
          bill.BILLING_QUANTITY,
          bill.BILLING_RATE,
          <div className="flex justify-center gap-2" key={bill.BILL_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Transaction/FrmSupplierBill?mode=2&billId=${bill.BILL_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() => handleDelete(bill.BILL_ID, bill.MATERIAL)}
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedBills);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
      alert("Failed to fetch bills. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const handleDelete = async (billId, materialName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete bill for "${materialName}"?`,
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
        in_billId: billId,
        in_material: materialName,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("SupplierBillIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchBills();
      } else {
        alert(data?.errorMessage || "Failed to delete bill.");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert("An error occurred while deleting the bill.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing important fields
  const headers = [
    "Material",
    "Quantity",
    "Rate",
    "Received Qty",
    "Accepted Qty",
    "Billing Qty",
    "Billing Rate",
    "Actions",
  ];

  return (
    <Layout
      title="Supplier Bill Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Supplier Bill",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Transaction/FrmSupplierBill")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmSupplierBillList;
