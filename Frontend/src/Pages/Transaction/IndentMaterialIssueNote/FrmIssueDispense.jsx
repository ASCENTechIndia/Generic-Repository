import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../../Components/Layout";
import HeaderLabel from "../../../Components/HeaderLabel";
import InputField from "../../../Components/InputField";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Edit } from "lucide-react";
import { Formik, Form, Field } from "formik";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FrmIssueDispense = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;
  const [issueData, setIssueData] = useState([]);

  // 🟢 Handle Edit
  const handleEdit = (id) => {
    navigate(`/Transaction/FrmEditOrder?id=${id}`);
  };

  // 🔹 Normalize status for consistency
  const normalizeStatus = (status) => {
    if (!status) return "";
    const s = status.toString().toLowerCase();
    if (s === "a") return "Approved";
    if (s === "pending") return "Pending";
    if (s === "rejected" || s === "r") return "Rejected";
    return s;
  };

  // 🔹 Fetch & Group Issue Dispense Data
  const fetchIssueDispense = useCallback(async () => {
    try {
      setLoading(true);
      const payload = { ulbId: ulbId };

      // apiService giving old data
      // const { data } = await apiService.post("AoinGetAppStockList", payload);

      // Axios giving correct data
      const { data } = await axios.post(
        `${API_BASE_URL}/AoinGetAppStockList`,
        payload
      );
      console.log("DATA", data)
      if (data?.success && Array.isArray(data.data)) {
        // Group by PO Number
        const grouped = data.data.reduce((acc, item) => {
          const poNo = item.VAR_PURCHASEORDER_PONO ?? "-";
          if (!acc[poNo]) {
            acc[poNo] = {
              vendorId: item.NUM_PURCHASEORDER_VENDORID ?? null,
              vendor: item.VAR_VENDOR_NAME ?? "-",
              poDate: item.DAT_PURCHASEORDER_DATE
                ? new Date(item.DAT_PURCHASEORDER_DATE).toLocaleDateString()
                : "-",
              // status: normalizeStatus(item.VAR_PURCHASEORDER_STATUS),
              items: [],
            };
          }
          acc[poNo].items.push({
            itemName: item.VAR_POITEM_NAME ?? "-",
            category: item.VAR_CATEGORY_NAME ?? "-",
            qty: item.NUM_POITEM_QTY  ?? 0,
            id: item.NUM_PURCHASEORDER_ID,
          });
          return acc;
        }, {});
        
        // Flatten to table format
        const mappedData = Object.entries(grouped).map(
          ([poNo, details], index) => {
            return [
              poNo,
              details.items.map((i) => i.itemName).join(", "), // ✅ Combine item names
              details.vendor, // ✅ Show vendor name
              details.items.map((i) => i.category).join(", "), // Combine categories
              details.items.reduce((sum, i) => sum + i.qty, 0), // Total Qty
              details.poDate,
              // details.status,
              <div
                className="flex justify-center gap-2"
                key={`action-${index}`}
              >
                <button
                  className="p-1 border rounded hover:bg-blue-100 text-blue-600"
                  onClick={() => handleEdit(details.items[0].id)}
                >
                  <Edit size={16} />
                </button>
              </div>,
            ];
          }
        );
        const sortedMappedData = mappedData.sort((a, b) => {
          const numA = parseInt(a[0].split("-")[1]);
          const numB = parseInt(b[0].split("-")[1]);
          return numB - numA;
        });

        setIssueData(sortedMappedData);
        setLoading(false);
      } else {
        setIssueData([]);
      }
    } catch (error) {
      console.error("Error fetching Issue Dispense list:", error);
      alert("Failed to fetch Issue Dispense list. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [ulbId]);

  useEffect(() => {
    fetchIssueDispense();
  }, [fetchIssueDispense]);

  const headers = [
    "PO Number",
    "Item Names",
    "Vendor",
    "Categories",
    "Total Qty",
    "PO Date",
    // "Status",
    "Actions",
  ];

  return (
    <Layout
      title="Issue / Dispense Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Issue / Dispense",
      }}
    >
      <Formik
        initialValues={{ issueNo: "", issuedTo: "", date: "" }}
        onSubmit={(values) => {
          console.log("Filters submitted:", values);
        }}
      >
        {({ values, resetForm }) => (
          <Form>
            {/* Filters */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Field
                name="issueNo"
                type="text"
                className="bg-white"
                placeholder="Search PO Number"
                component={InputField}
              />
              <Field
                name="issuedTo"
                type="text"
                className="bg-white"
                placeholder="Search Item Name"
                component={InputField}
              />
              {/* <Field
                type="calendar"
                className="bg-white"
                name="date"
                component={InputField}
              /> 
            </div> */}

            {/* Table */}
            <Table
              // headerlabel="Issue / Dispense List"
              headers={headers}
              data={issueData.filter((row) => {
                const [poNo, itemNames, , , , date] = row;
                return (
                  poNo.toLowerCase().includes(values.issueNo.toLowerCase()) &&
                  itemNames
                    .toLowerCase()
                    .includes(values.issuedTo.toLowerCase()) &&
                  (values.date === "" || date === values.date)
                );
              })}
              rowsPerPage={6}
            />
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default FrmIssueDispense;
