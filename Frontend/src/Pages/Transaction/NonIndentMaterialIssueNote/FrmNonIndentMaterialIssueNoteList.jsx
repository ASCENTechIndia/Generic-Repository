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

const FrmNonIndentMaterialIssueNoteList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetNonIndentIssueListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          ISSUE_ID: 1,
          STORE_OPERATOR: "John Doe",
          CREATE_DIRECT_ISSUE: "Yes",
          DEPARTMENT_USER: "OPD Department",
          MATERIAL: "Paracetamol 500mg",
          QUANTITY: "100",
          ISSUE: "Emergency Issue",
        },
        {
          ISSUE_ID: 2,
          STORE_OPERATOR: "Jane Smith",
          CREATE_DIRECT_ISSUE: "No",
          DEPARTMENT_USER: "General Ward",
          MATERIAL: "A4 Paper",
          QUANTITY: "50",
          ISSUE: "Regular Issue",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedIssues = dummyData.map((issue) => [
          issue.STORE_OPERATOR,
          issue.CREATE_DIRECT_ISSUE,
          issue.DEPARTMENT_USER,
          issue.MATERIAL,
          issue.QUANTITY,
          issue.ISSUE,
          <div className="flex justify-center gap-2" key={issue.ISSUE_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Transaction/FrmNonIndentMaterialIssueNote?mode=2&issueId=${issue.ISSUE_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() => handleDelete(issue.ISSUE_ID, issue.MATERIAL)}
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedIssues);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
      alert("Failed to fetch issues. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleDelete = async (issueId, materialName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete issue for "${materialName}"?`,
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
        in_issueId: issueId,
        in_material: materialName,
        in_ipaddress: ip, // ✅ Passed directly
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("NonIndentIssueIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchIssues();
      } else {
        alert(data?.errorMessage || "Failed to delete issue.");
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
      alert("An error occurred while deleting the issue.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns showing important fields
  const headers = [
    "Store Operator",
    "Create Direct Issue",
    "Department/User",
    "Material",
    "Quantity",
    "Issue",
    "Actions",
  ];

  return (
    <Layout
      title="Non-Indent Material Issue Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Non-Indent Material Issue Note",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Transaction/FrmNonIndentMaterialIssueNote")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmNonIndentMaterialIssueNoteList;
