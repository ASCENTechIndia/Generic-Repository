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

const FrmUnitMeasureMasterList = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const fetchUOMs = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call - Replace with actual API when ready
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetUOMListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          UOM_ID: 1,
          NOS: "10",
          KG: "5",
          GRAM: "500",
          LITER: "2",
          METER: "10",
          BOX: "1",
          PACKET: "5",
          PIECE: "10",
          DOZEN: "2",
          SET: "1",
        },
        {
          UOM_ID: 2,
          NOS: "20",
          KG: "10",
          GRAM: "1000",
          LITER: "4",
          METER: "20",
          BOX: "2",
          PACKET: "10",
          PIECE: "20",
          DOZEN: "4",
          SET: "2",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedUOMs = dummyData.map((uom) => [
          uom.NOS,
          uom.KG,
          uom.GRAM,
          uom.LITER,
          uom.METER,
          uom.BOX,
          uom.PACKET,
          uom.PIECE,
          uom.DOZEN,
          uom.SET,
          <div className="flex justify-center gap-2" key={uom.UOM_ID}>
            <button
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmUnitMeasureMaster?mode=2&uomId=${uom.UOM_ID}`
                )
              }
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(
                  uom.UOM_ID,
                  uom.NOS,
                  "A"
                )
              }
            >
              <Trash2 size={16} />
            </button>
          </div>,
        ]);

        setTableData(mappedUOMs);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching UOMs:", error);
      alert("Failed to fetch UOMs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId, navigate, setLoading]);

  useEffect(() => {
    fetchUOMs();
  }, [fetchUOMs]);

  const handleDelete = async (uomId, uomName, uomFlag) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this UOM?`
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
        in_uomId: uomId,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const { data } = await apiService.post("UOMIns", payload);
      
      const data = { errorCode: 9999, errorMessage: "Deleted Successfully" };

      if (data?.errorCode === 9999) {
        alert(data?.errorMessage || "Deleted Successfully");
        fetchUOMs();
      } else {
        alert(data?.errorMessage || "Failed to delete UOM.");
      }
    } catch (error) {
      console.error("Error deleting UOM:", error);
      alert("An error occurred while deleting the UOM.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ List columns with all 10 fields
  const headers = [
    "Nos", "Kg", "Gram", "Liter", "Meter", 
    "Box", "Packet", "Piece", "Dozen", "Set", 
    "Actions"
  ];

  return (
    <Layout
      title="Unit of Measure Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "UOM Master",
      }}
    >
      <Button
        type="button"
        className="hover:cursor-pointer"
        onClick={() => navigate("/Master/FrmUnitMeasureMaster")}
      >
        Add New
      </Button>

      <Table headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmUnitMeasureMasterList;