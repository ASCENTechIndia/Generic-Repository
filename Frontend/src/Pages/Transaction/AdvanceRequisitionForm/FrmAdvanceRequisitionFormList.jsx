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

const FrmAdvanceRequisitionFormList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchRequisitions = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetAdvanceRequisitionListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          REQUISITION_ID: 1,
          REQUISITION_NO: "REQ001",
          DEPARTMENT: "OPD Department",
          REQUIRED_DATE: "2023-11-01",
          MATERIAL: "Paracetamol 500mg",
          QUANTITY: "100",
          ESTIMATED_AMOUNT: "1000",
          APPROVAL_STATUS: "Pending",
        },
        {
          REQUISITION_ID: 2,
          REQUISITION_NO: "REQ002",
          DEPARTMENT: "General Ward",
          REQUIRED_DATE: "2023-11-05",
          MATERIAL: "A4 Paper",
          QUANTITY: "50",
          ESTIMATED_AMOUNT: "500",
          APPROVAL_STATUS: "Approved",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedRequisitions = dummyData.map((req) => [
          req.REQUISITION_NO,
          req.DEPARTMENT,
          req.REQUIRED_DATE,
          req.MATERIAL,
          req.QUANTITY,
          req.ESTIMATED_AMOUNT,
          req.APPROVAL_STATUS,
          <div className="flex justify-center gap-2" key={req.REQUISITION_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Transaction/FrmAdvanceRequisitionForm?mode=2&requisitionId=${req.REQUISITION_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(req.REQUISITION_ID, req.REQUISITION_NO)
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedRequisitions);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching requisitions:", error);
      alert("Failed to fetch requisitions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]);

  const handleDelete = async (requisitionId, requisitionNo) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete requisition "${requisitionNo}"?`,
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
        in_requisitionId: requisitionId,
        in_requisitionNo: requisitionNo,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("AdvanceRequisitionIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchRequisitions();
      } else {
        alert(data?.errorMessage || "Failed to delete requisition.");
      }
    } catch (error) {
      console.error("Error deleting requisition:", error);
      alert("An error occurred while deleting the requisition.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing important fields
  const headers = [
    "Requisition No",
    "Department",
    "Required Date",
    "Material",
    "Quantity",
    "Estimated Amount",
    "Approval Status",
    "Actions",
  ];

  return (
    <Layout
      title="Advance Requisition Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Advance Requisition Form",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Transaction/FrmAdvanceRequisitionForm")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmAdvanceRequisitionFormList;
