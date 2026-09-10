import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../../Components/Layout";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useNavigate } from "react-router-dom";
import Button from "../../../Components/Button";
import { Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext"; // ✅ Added for loader

import GetIPAddress from "../../../utils/ipHelper"; // ✅ IP helper
import config from "../../../utils/config"; // ✅ Centralized config

const FrmDepartmentList = () => {
  const [tableData, setTableData] = useState([]);
  const [ipAddress, setIpAddress] = useState(""); // ✅ State for IP
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader(); // ✅ Destructured setLoading

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  // ✅ Fetch IP once when component mounts
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const ip = await GetIPAddress(); // Your ipHelper should return IP/hostname
        setIpAddress(ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
        setIpAddress(window.location.hostname || "127.0.0.1"); // fallback
      }
    };

    fetchIP();
  }, []);

  // ✅ Fetch department list
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true); // ✅ Show loader
      const payload = { in_ulbId: ulbId };
      const { data } = await apiService.post("GetDeptList", payload);

      if (Array.isArray(data)) {
        const mappedDepartments = data.map((dept) => {
          const facilityId = dept.NUM_DEPT_FACILITYID ?? null;

          return [
            dept.FACILITY_NAME,
            dept.VAR_DEPT_NAME,
            dept.VAR_DEPT_TYPE,
            dept.VAR_DEPT_FLAG === "A" ? "Active" : "Inactive",
            <div className="flex justify-center gap-2" key={dept.NUM_DEPT_ID}>
              <button
                className="p-1 border rounded hover:bg-gray-100 text-blue-600"
                onClick={() => handleEdit(dept.NUM_DEPT_ID)}
              >
                <Edit size={16} />
              </button>

              <button
                className="p-1 border rounded hover:bg-red-50 text-red-600"
                onClick={() =>
                  handleDelete(
                    dept.NUM_DEPT_ID,
                    dept.VAR_DEPT_NAME,
                    dept.VAR_DEPT_FLAG,
                    facilityId,
                    dept.VAR_DEPT_TYPE
                  )
                }
              >
                <Trash2 size={16} />
              </button>
            </div>,
          ];
        });

        setTableData(mappedDepartments);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      alert("Failed to fetch departments. Please try again later.");
    } finally {
      setLoading(false); // ✅ Hide loader
    }
  }, [ulbId, setLoading]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleEdit = (deptId) => {
    navigate(`/Master/FrmDepartmentMaster?mode=2&deptId=${deptId}`);
  };

  const handleDelete = async (
    deptId,
    deptName,
    deptFlag,
    facilityId,
    deptType
  ) => {
    if (!facilityId) {
      alert("Facility ID missing. Cannot delete this department.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${deptName}"?`))
      return;

    try {
      setLoading(true); // ✅ Show loader
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbId,
        in_deptId: deptId,
        in_facilityId: facilityId,
        in_deptName: deptName,
        in_deptType: deptType || "Medical",
        in_flag: deptFlag,
        in_ipaddress: ipAddress, // ✅ Now coming from GetIPAddress()
        in_source: config.source, // ✅ Centralized
      };

      console.log("Delete Department Payload:", payload);

      const { data } = await apiService.post("AoinDeptIns", payload);

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Department deleted successfully.");
        fetchDepartments();
      } else {
        alert(data?.errorMessage || "Failed to delete department.");
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("An error occurred while deleting the department.");
    } finally {
      setLoading(false); // ✅ Hide loader
    }
  };

  const headers = [
    "Facility Name",
    "Department Name",
    "Type",
    "Flag",
    "Actions",
  ];

  return (
    <Layout
      title="Department Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Departments",
      }}
    >
      <div className="flex justify-start mb-4">
        <Button
          type="button"
          className="hover:cursor-pointer"
          onClick={() => navigate("/Master/FrmDepartmentMaster?mode=1")}
        >
          Add New
        </Button>
      </div>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmDepartmentList;
