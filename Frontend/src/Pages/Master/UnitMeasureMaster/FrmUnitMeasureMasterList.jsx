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

      // Replace with actual API when ready:
      // const payload = { ulbId };
      // const { data } = await apiService.post("GetUOMListByUlb", payload);

      // Dummy data for now
      const dummyData = [
        {
          UOM_ID: 1,
          UOM_CODE: "NOS",
          UOM_NAME: "Number",
          UOM_SHORT_NAME: "Nos",
          UOM_CATEGORY_NAME: "Quantity",
          DECIMAL_ALLOWED: "N",
          DECIMAL_PLACES: 0,
          DESCRIPTION: "Used for countable items",
          STATUS: "A",
        },
        {
          UOM_ID: 2,
          UOM_CODE: "KG",
          UOM_NAME: "Kilogram",
          UOM_SHORT_NAME: "Kg",
          UOM_CATEGORY_NAME: "Weight",
          DECIMAL_ALLOWED: "Y",
          DECIMAL_PLACES: 3,
          DESCRIPTION: "Used for weight-based materials",
          STATUS: "A",
        },
        {
          UOM_ID: 3,
          UOM_CODE: "BOX",
          UOM_NAME: "Box",
          UOM_SHORT_NAME: "Box",
          UOM_CATEGORY_NAME: "Packaging",
          DECIMAL_ALLOWED: "N",
          DECIMAL_PLACES: 0,
          DESCRIPTION: "Used for boxed materials",
          STATUS: "A",
        },
      ];

      if (Array.isArray(dummyData)) {
        const mappedUOMs = dummyData.map((uom) => [
          uom.UOM_CODE,
          uom.UOM_NAME,
          uom.UOM_SHORT_NAME,
          uom.UOM_CATEGORY_NAME,
          uom.DECIMAL_ALLOWED === "Y" ? "Yes" : "No",
          uom.DECIMAL_ALLOWED === "Y" ? uom.DECIMAL_PLACES : "-",
          uom.DESCRIPTION || "-",
          uom.STATUS === "A" ? "Active" : "Inactive",

          <div className="flex justify-center gap-2" key={uom.UOM_ID}>
            <button
              type="button"
              className="p-1 border rounded hover:bg-gray-100 text-blue-600"
              onClick={() =>
                navigate(
                  `/Master/FrmUnitMeasureMaster?mode=2&uomId=${uom.UOM_ID}`
                )
              }
              title="Edit"
            >
              <Edit size={16} />
            </button>

            <button
              type="button"
              className="p-1 border rounded hover:bg-red-50 text-red-600"
              onClick={() =>
                handleDelete(
                  uom.UOM_ID,
                  uom.UOM_NAME
                )
              }
              title="Delete"
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

  const handleDelete = async (uomId, uomName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${uomName}"?`
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbId,
        in_uomId: uomId,
        in_ipaddress: ip,
        in_source: config.source,
      };

      console.log("Delete UOM Payload:", payload);

      // Replace with actual API when ready:
      // const { data } = await apiService.post("UOMIns", payload);

      // Mock API response for now
      const data = {
        errorCode: 9999,
        errorMessage: "Deleted Successfully",
      };

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

  const headers = [
    "UOM Code",
    "UOM Name",
    "Short Name",
    "UOM Category",
    "Decimal Allowed",
    "Decimal Places",
    "Description",
    "Status",
    "Actions",
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
