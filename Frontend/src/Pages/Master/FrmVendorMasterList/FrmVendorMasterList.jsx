import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import Table from "../../../Components/Table";
import { Link, useNavigate } from "react-router-dom";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { Edit, Trash2 } from "lucide-react";
import { useLoader } from "../../../Context/LoaderContext";

const FrmVendorMasterList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "Vendor ID",
    "Vendor Name",
    "Vendor Person",
    "Vendor Phone",
    "Vendor Email",
    "GSTIN",
    "PAN No.",
    "Active",
    "Action",
  ];

  const handleDelete = async (vendor) => {
    try {
      setLoading(true);
      const ip = await GetIPAddress();
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbid,
        in_vendorId: vendor.VENDOR_ID,
        in_vendorCode: vendor.VENDOR_CODE,
        in_vendorName: vendor.VENDOR_NAME,
        in_vendorAddress: vendor.VENDOR_ADDRESS,
        in_contactPerson: vendor.CONTACT_PERSON,
        in_phone: vendor.PHONE,
        in_email: vendor.EMAIL,
        in_paymentTerms: vendor.PAYMENT_TERMS,
        in_creditLimit: vendor.CREDIT_LIMIT,
        in_rating: vendor.RATING,
        in_flag: vendor.FLAG,
        in_ipaddress: ip,
        in_source: config.source,
      };
      const res = await apiService.post("AoinVendorIns", payload);
      if (res?.data?.errorCode === 9999) {
        alert(res?.data?.errorMessage);
        fetchVendorMasterTableData();
      } else {
        alert("Vendor cannot be deleted, as it is associated with other records.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorMasterTableData = async () => {
    try {
      setLoading(true);
      const res = await apiService.post("vendorList", { ulbId: ulbid });
      if (Array.isArray(res?.data) && res.data.length > 0) {
        const data = res.data.map((vendor) => [
          vendor.VENDOR_ID,
          vendor.VENDOR_NAME,
          vendor.CONTACT_PERSON,
          vendor.PHONE,
          vendor.EMAIL,
          vendor.GSTIN,
          vendor.PANNO,
          vendor.FLAG === "A" ? "Active" : "Inactive",
          <div className="flex justify-center gap-2" key={vendor.VENDOR_ID}>
            <Link
              to={`/Master/FrmVendorMaster?mode=2&vendorId=${vendor.VENDOR_ID}`}
              className="text-blue-600 border border-blue-500 p-1 rounded-md"
            >
              <Edit size={16} />
            </Link>
            <span
              className="hover:cursor-pointer border border-red-500 p-1 rounded-md"
              onClick={() => handleDelete(vendor)}
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
      console.error("Error fetching vendor list:", error);
      alert("Failed to fetch vendor list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid) {
      fetchVendorMasterTableData();
    }
  }, [userId, ulbid]);

  return (
    <Layout
      title="Vendor List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Vendor List",
      }}
    >
      <div>
        <div className="ml-auto">
          <Link to={"/Master/FrmVendorMaster?mode=1"}>
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

export default FrmVendorMasterList;
