import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import Table from "../../../Components/Table";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { useLoader } from "../../../Context/LoaderContext";

const FrmItemMasterList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "Item Code/SKU",
    "Item Name",
    "Category",
    "Sub Category",
    "Item Unit",
    "Pack Size",
    "GST Applicable",
    "Applied GST Rate",
    "Minimum Order Quantity (MOQ)",
    "Vendor/Distributor",
    "Manufacturer",
    "Flag",
    "Actions",
  ];

  const handleDelete = async (item) => {
    try {
      setLoading(true);
      const ip = await GetIPAddress();
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_UlbId: ulbid,
        in_itemId: item["Item Id"],
        in_itemCode: item["Item Code/SKU"],
        in_itemName: item["Item Name"],
        in_itemCategory: item["Category"],
        in_itemUnit: item["Item Unit"],
        in_flag: item["Flag"],
        in_ipaddress: ip,
        in_source: config.source,
      };
      const res = await apiService.post("AoinItemIns", payload);
     
      if (res?.data?.errorCode === 9999) {
        alert(res?.data?.errorMessage);
        fetchItemMasterTableData();
      } else {
        alert(res?.data?.errorMessage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemMasterTableData = async () => {
    try {
      setLoading(true);
      const res = await apiService.post("GetItemList", {ulbId : ulbid});
       console.log("List",res)
      if (Array.isArray(res?.data) && res.data.length > 0) {
        const data = res.data.map((item) => [
          item["Item Code/SKU"] || "",
          item["Item Name"] || "",
          item["Category"] || "",
          item["Sub Category"] || "",
          item["Item Unit"] || "",
          item["Pack Size"] || "",
          item["GST Applicable"] || "",
          item["Applied GST Rate"] || "", 
          item["Minimum Order Quantity (MOQ)"] || "",
          item["Vendor"] || "",
          item["Manufacturer"] || "",
          item["Flag"] || "",
          <div className="flex justify-center gap-2" key={item["Item Id"]}>
            <Link
              to={`/Master/FrmItemMaster?mode=2&itemId=${item["Item Id"]}`}
              className="text-blue-600 border border-blue-500 p-1 rounded-md"
            >
              <Edit size={16} />
            </Link>
            <span
              className="hover:cursor-pointer border border-red-500 p-1 rounded-md"
              onClick={() => handleDelete(item)}
            >
              <Trash2 size={15} className="text-red-500" />
            </span>
          </div>,
        ]);
        setTableData(data);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching item list:", error);
      alert("Failed to fetch item list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && ulbid) {
      fetchItemMasterTableData();
    }
  }, [userId, ulbid]);

  return (
    <Layout
      title="Item List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Item List",
      }}
    >
      <div>
        <div className="ml-auto">
          <Link to={"/Master/FrmItemMaster?mode=1"}>
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

export default FrmItemMasterList;
