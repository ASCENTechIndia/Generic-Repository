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

const FrmRequisitionList = () => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const ulbId = Number(user?.ulbId);
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

  const fetchRequisitionList = useCallback(async () => {
    try {
      if (!ulbId || isNaN(ulbId)) return;

      setLoading(true);

      const response = await apiService.post("RequisitionList", {
        ulbId: ulbId,
      });

      console.log("POST API RESPONSE:", response);

      const list = Array.isArray(response.data)
        ? response.data
        : response.data?.data;

      if (Array.isArray(list)) {
        const mappedData = list.map((req) => [
          req.REQUISITION_NO || "-",
          req.REQUISITION_DATE || "-",
          req.STATUS || "-",
          req.CREATED_BY || "-",
          req.LAST_ISSUE_DATE || "-",
          req.ITEM_COUNT ?? 0,
          <div className="flex justify-center gap-2" key={req.REQUISITION_ID}>
            <Link
              to={`/Transaction/FrmRequisitionMst?mode=2&reqId=${req.REQUISITION_ID}`}
              className="text-blue-600 border border-blue-500 p-1 rounded-md"
            >
              <Edit size={16} />
            </Link>

            <span
              className="hover:cursor-pointer border border-red-500 p-1 rounded-md"
              onClick={() => handleDelete(req.REQUISITION_ID, req.ITEM_STRING)}
            >
              <Trash2 size={15} className="text-red-500" />
            </span>
          </div>,
        ]);

        setTableData(mappedData);
      } else {
        console.log("No array received from POST API");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching requisition list:", error);
    } finally {
      setLoading(false);
    }
  }, [ulbId, setLoading]);

  useEffect(() => {
    if (ulbId) {
      fetchRequisitionList();
    }
  }, [fetchRequisitionList, ulbId]);

  const handleDelete = async (requisitionId , itemString) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this requisition?",
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      debugger;

      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_UlbId: ulbId, 
        in_requisitionItemId: requisitionId, 
        in_itemstr: itemString,
        in_ipaddress: ipAddress,
        in_source: config.source,
      };

      const { data } = await apiService.post("RequisitionIns", payload);

      if (data?.ErrorCode === 9999) {
        alert("Deleted successfully");
        fetchRequisitionList();
      } else {
        alert(data?.ErrorMessage || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const tableHeader = [
    "Requisition No",
    "Requisition Date",
    "Status",
    "Created By",
    "Last Issue Date",
    "Item Count",
    "Action",
  ];

  return (
    <Layout
      title="Material Indent Note"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Material Indent Note",
      }}
    >
      <div className="">
        <div className="ml-auto">
          <Link to="/Transaction/FrmRequisitionMst?mode=1">
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

export default FrmRequisitionList;