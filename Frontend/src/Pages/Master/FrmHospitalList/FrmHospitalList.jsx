import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";

const FrmHospitalList = () => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const [tableData, setTableData] = useState([]);
  const [ipAddress, setIpAddress] = useState("");

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

  // Fetch hospital list
  const fetchHospitals = useCallback(async () => {
    try {
      setLoading(true);
      const payload = { ulbId };
      const { data } = await apiService.post("hospitallist", payload);

      if (Array.isArray(data)) {
        const mappedData = data.map((hospital) => [
          hospital.VAR_HOSPITAL_NAME,
          hospital.VAR_HOSPITAL_LOCATION,
          hospital.VAR_HOSPITAL_ACTIVEFLAG === "A" ? "Yes" : "No",
          <div className="flex justify-center gap-2" key={hospital.NUM_HOSPITAL_ID}>
            <Link
              to={`/Master/FrmHospitalMst?mode=2&hospitalId=${hospital.NUM_HOSPITAL_ID}`}
              className="text-blue-600 border border-blue-500 p-1 rounded-md"
            >
              <Edit size={16} />
            </Link>
            <span
              className="hover:cursor-pointer border border-red-500 p-1 rounded-md"
              onClick={() =>
                handleDelete(
                  hospital.NUM_HOSPITAL_ID,
                  hospital.VAR_HOSPITAL_NAME,
                  hospital.VAR_HOSPITAL_ACTIVEFLAG
                )
              }
            >
              <Trash2 size={15} className="text-red-500" />
            </span>
          </div>,
        ]);
        setTableData(mappedData);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      alert("Failed to fetch hospital list. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, setLoading]);

  useEffect(() => {
    if (ulbId) {
      fetchHospitals();
    }
  }, [fetchHospitals, ulbId]);

  // Delete handler
  const handleDelete = async (hospitalId, hospitalName, flag) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete hospital "${hospitalName}"?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbId,
        in_hospitalId: hospitalId,
        in_hospitalName: hospitalName,
        in_flag: flag,
        in_ipaddress: ipAddress,
        in_source: config.source,
      };

      const { data } = await apiService.post("HospitalIns", payload);

      if (data?.errorCode === 9999) {
        alert(data?.message || "Deleted Successfully");
        fetchHospitals();
      } else {
        alert(data?.message || "Failed to delete hospital.");
      }
    } catch (error) {
      console.error("Error deleting hospital:", error);
      alert("An error occurred while deleting the hospital.");
    } finally {
      setLoading(false);
    }
  };

  const tableHeader = ["Hospital Name", "Location", "Active", "Action"];

  return (
    <Layout
      title="Hospital / Dispensary List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Hospital / Dispensary List",
      }}
    >
      <div className="">
        <div className="ml-auto">
          <Link to="/Master/FrmHospitalMst?mode=1">
            <Button
              type="button"
              variant="primary"
              className="hover:cursor-pointer"
            >
              Add New
            </Button>
          </Link>
        </div>

        <div className="mt-3">
          <Table headers={tableHeader} data={tableData} />
        </div>
      </div>
    </Layout>
  );
};

export default FrmHospitalList;
