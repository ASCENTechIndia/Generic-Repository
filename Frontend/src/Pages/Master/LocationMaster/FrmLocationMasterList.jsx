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

const FrmLocationMasterList = () => {
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

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetLocationListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          LOCATION_ID: 1,
          LOCATION_CODE: "LOC001",
          LOCATION_NAME: "Central Warehouse",
          LOCATION_TYPE: "Warehouse",
          CONTACT_PERSON: "John Doe",
          STATUS: "A",
        },
        {
          LOCATION_ID: 2,
          LOCATION_CODE: "LOC002",
          LOCATION_NAME: "Event Venue A",
          LOCATION_TYPE: "Event Venue",
          CONTACT_PERSON: "Jane Smith",
          STATUS: "A",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedLocations = dummyData.map((loc) => [
          loc.LOCATION_CODE,
          loc.LOCATION_NAME,
          loc.LOCATION_TYPE,
          loc.CONTACT_PERSON,
          loc.STATUS === "A" ? "Active" : "Inactive",
          <div className="flex justify-center gap-2" key={loc.LOCATION_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmLocationMaster?mode=2&locationId=${loc.LOCATION_ID}`,
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(loc.LOCATION_ID, loc.LOCATION_NAME, loc.STATUS)
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedLocations);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      alert("Failed to fetch locations. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleDelete = async (locationId, locationName, locationFlag) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete location "${locationName}"?`,
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbId,
        in_locationId: locationId,
        in_locationName: locationName,
        in_flag: locationFlag,
        in_ipaddress: ipAddress,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("LocationIns", payload);

      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchLocations();
      } else {
        alert(data?.errorMessage || "Failed to delete location.");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      alert("An error occurred while deleting the location.");
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    "Location Code",
    "Location Name",
    "Location Type",
    "Contact Person",
    "Status",
    "Actions",
  ];

  return (
    <Layout
      title="Location Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Locations",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Master/FrmLocationMaster")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmLocationMasterList;
