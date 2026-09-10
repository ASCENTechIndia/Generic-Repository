import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../../Components/Layout";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useNavigate } from "react-router-dom";
import Button from "../../../Components/Button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext"; // ✅ Added for loader

import GetIPAddress from "../../../utils/ipHelper"; // ✅ use for IP
import config from "../../../utils/config"; // ✅ centralized config

const FrmFacilityList = () => {
  const [tableData, setTableData] = useState([]);
  const [ipAddress, setIpAddress] = useState(""); // ✅ store IP
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader(); // ✅ Destructure setLoading from useLoader

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  // ✅ Fetch IP once when component loads
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const ip = await GetIPAddress();
        setIpAddress(ip);
      } catch (error) {
        console.error("Failed to get IP address:", error);
        setIpAddress("127.0.0.1"); // fallback
      }
    };
    fetchIP();
  }, []);

  // Fetch Facilities
  const fetchFacilities = useCallback(async () => {
    try {
      setLoading(true); // ✅ Show loader before API call
      const payload = { ulbId };
      const { data } = await apiService.post("GetFacilityFullList", payload);

      if (Array.isArray(data)) {
        const mappedFacilities = data.map((facility) => [
          facility.FACILITY_NAME,
          facility.FACILITY_TYPE,
          facility.FACILITY_LOCATION,
          facility.FACILITY_FLAG === "A" ? "Active" : "Inactive",
          <div className="flex justify-center gap-2" key={facility.FACILITY_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmFacilityMaster?mode=2&facilityId=${facility.FACILITY_ID}`
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(
                  facility.FACILITY_ID,
                  facility.FACILITY_NAME,
                  facility.FACILITY_FLAG
                )
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedFacilities);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
      alert("Failed to fetch facilities. Please try again later.");
    } finally {
      setLoading(false); // ✅ Hide loader after API call completes (success or failure)
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const handleDelete = async (facilityId, facilityName, facilityFlag) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete facility "${facilityName}"?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true); // ✅ Show loader before API call
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbId,
        in_facilityId: facilityId,
        in_facilityName: facilityName,
        in_facilityType: "",
        in_facilityLocation: "",
        in_parentFacilityId: null,
        in_flag: facilityFlag,
        in_ipaddress: ipAddress, // ✅ use fetched IP
        in_source: config.source, // ✅ use centralized config
      };

      const { data } = await apiService.post("AoinFacitilyIns", payload);

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchFacilities();
      } else {
        alert(data?.errorMessage || "Failed to delete facility.");
      }
    } catch (error) {
      console.error("Error deleting facility:", error);
      alert("An error occurred while deleting the facility.");
    } finally {
      setLoading(false); // ✅ Hide loader after API call completes
    }
  };

  const headers = ["Name", "Type", "Location", "Flag", "Actions"];

  return (
    <Layout
      title="Facility Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Facilities",
      }}
    >
      <div className="flex justify-start mb-4">
        <Button
          type="button"
          className="hover:cursor-pointer"
          onClick={() => navigate("/Master/FrmFacilityMaster")}
        >
          Add New
        </Button>
      </div>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmFacilityList;
