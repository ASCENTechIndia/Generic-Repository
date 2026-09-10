import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Trash2 } from "lucide-react";
import Table from "../../../Components/Table";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import InputField from "../../../Components/InputField";
import Label from "../../../Components/Label";

const FrmEditOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const deptid = user?.deptId;
  const ulbid = user?.ulbId;

  const queryParams = new URLSearchParams(location.search);
  const purchaseOrderId = parseInt(queryParams.get("id"), 10);
  const [hospitalList, setHospitalList] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deptOptions, setDeptOptions] = useState([]);
  const [hospitalId, setHospitalId] = useState("");
  const [issueId, setIssueId] = useState(null);
  const [mode, setMode] = useState(1);

  // Utility function to format date as "DD-MMM-YYYY"
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (ulbid) {
      fetchDropdowns();
    }
  }, [ulbid]);

  useEffect(() => {
    const fetchHospitalList = async () => {
      try {
        const response = await apiService.post("hospitallist", {
          ulbId: Number(ulbid),
        });

        if (Array.isArray(response?.data)) {
          const activeHospitals = response.data.filter(
            (h) => h.VAR_HOSPITAL_ACTIVEFLAG === "A",
          );

          setHospitalList(activeHospitals);
        }
      } catch (error) {
        console.error("Hospital dropdown error:", error);
      }
    };

    if (ulbid) {
      fetchHospitalList();
    }
  }, [ulbid]);

  const fetchDropdowns = async () => {
    try {
      const payload = {
        ulbId: ulbid,
      };

      const results = await Promise.allSettled([
        apiService.post("getDepartmentddList", payload),
      ]);
      if (
        results[0].status === "fulfilled" &&
        results[0].value?.data?.length > 0
      ) {
        const options = results[0].value?.data.map((option) => {
          return {
            value: option.NUM_DEPT_ID,
            label: option.VAR_DEPT_NAME,
          };
        });
        setDeptOptions(options);
      }
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
    }
  };
  // Fetch PO data by ID
  useEffect(() => {
    const fetchPOData = async () => {
      if (isNaN(purchaseOrderId)) {
        setLoading(false);
        setError("Invalid purchase order ID.");
        return;
      }

      try {
        const res = await apiService.post("AoinGetOrderList", { ulbId: ulbid });
        if (res?.data?.success && Array.isArray(res.data.data)) {
          const poItems = res.data.data.filter(
            (row) =>
              Number(row.NUM_PURCHASEORDER_ID) === Number(purchaseOrderId),
          );

          if (poItems.length > 0) {
            const mappedItems = poItems.map((row, index) => ({
              itemId: row.NUM_PURCHASEORDER_ID + "-" + index,
              name: row.VAR_POITEM_NAME,
              categoryid: row.VAR_POITEM_CATEGORY,
              category: row.VAR_CATEGORY_NAME,
              quantity: Number(row.NUM_POITEM_QTY),
              attributeId: row.NUM_POITEM_ATTRIBUTEID,
              // propertydef_id: row.VAR_POITEM_CATEGORY === "EQUIPMENT" ? 56 : 18,
            }));

            setOrder({
              purchaseOrderNo: poItems[0].VAR_PURCHASEORDER_PONO,
              vendorName: poItems[0].VAR_VENDOR_NAME,
              items: mappedItems,
              status: poItems[0].VAR_PURCHASEORDER_STATUS,
            });

            // 🔹 Fetch Issue ID for the first item (or loop if needed)
            if (mappedItems.length > 0) {
              const firstAttrId = mappedItems[0].attributeId;
              try {
                const issueRes = await apiService.post("getIssueIdByAttrId", {
                  attributeid: firstAttrId,
                });
                if (issueRes?.data?.success && issueRes.data.data.length > 0) {
                  setIssueId(issueRes.data.data[0].ISSUEITEMISSUEID);
                  setMode(2);
                } else {
                  setIssueId(0); // fallback if not found
                  setMode(1);
                }
              } catch (error) {
                console.error("Error fetching issueId:", error);
                setIssueId(0);
              }
            }
          } else {
            setError("No items found for this purchase order ID.");
          }
        } else {
          setError("Failed to fetch order data.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching purchase order.");
      } finally {
        setLoading(false);
      }
    };

    fetchPOData();
  }, [purchaseOrderId]);

  // Update quantity
  const handleQuantityChange = (itemId, newQty) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.itemId === itemId
          ? {
              ...item,
              quantity: Number(newQty) || 0,
            }
          : item,
      ),
    }));
  };

  // Delete item
  const handleDelete = (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setOrder((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.itemId !== itemId),
    }));
  };

  // Handle approve and send data to API (without price/total)
  const handleApprove = async () => {
    if (!hospitalId) {
      alert("Please select a hospital");
      return;
    }

    if (!order || !user) return;

    const inStr = order.items
      .map(
        (item) =>
          // `${item.name}#${item.categoryID}#${item.quantity}#A#${item.attributeId}#${item.propertydef_id}`
          `${item.name}#${item.categoryid}#${item.quantity}#A#${item.attributeId}#${0}`,
      )
      .join("$");

    try {
      const ip = await GetIPAddress();
      const payload = {
        In_UserId: user.userId,
        In_Mode: mode,
        In_issueid: issueId || 0,
        In_requisitionid: purchaseOrderId,
        In_hospitalid: Number(hospitalId),
        In_issuedby: user.username,
        In_issuedate: formatDate(new Date()),
        In_remarks: "Issue by Issue page",
        In_ulbid: user.ulbId,
        In_pono: order.purchaseOrderNo,
        In_flag: "I",
        In_str: inStr,
        In_ipaddress: ip,
        In_source: config.source,
      };
      const res = await apiService.post("AoinIssueIns", payload);

      if (res.data?.ErrorCode === 9999) {
        alert(res.data.ErrorMessage);
        navigate("/Transaction/FrmIssueDispense");
      } else {
        alert(res.data.ErrorMessage);
      }
    } catch (err) {
      console.error(err);
      alert("Error issuing order");
    }
  };

  const headers = ["Item", "Category", "Quantity", "Action"];

  const tableData = useMemo(() => {
    if (!order) return [];
    return order.items.map((item) => [
      <div key={item.itemId}>{item.name}</div>,
      <div key={`cat-${item.itemId}`} className="text-xs text-gray-500">
        {item.category}
      </div>,
      <input
        key={`qty-${item.itemId}`}
        type="number"
        value={item.quantity}
        min="1"
        max={item.quantity}
        className="w-16 border rounded-md px-2 py-1 text-center border-gray-300"
        onChange={(e) => handleQuantityChange(item.itemId, e.target.value)}
      />,
      <button
        key={`del-${item.itemId}`}
        onClick={() => handleDelete(item.itemId)}
        className="text-red-600 hover:text-red-800"
        title="Delete this item"
      >
        <Trash2 size={18} />
      </button>,
    ]);
  }, [order]);

  if (loading) return <Layout title="Purchase Order">Loading...</Layout>;
  if (error)
    return (
      <Layout title="Purchase Order">
        <div className="text-red-600 p-6">{error}</div>
      </Layout>
    );

  return (
    <Layout
      title="Issue Order"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Edit Purchase Order",
      }}
    >
      <div>
        {/* <h2 className="text-xl font-semibold mb-6">Edit Purchase Order</h2> */}

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
          <div>
            <span className="font-semibold">PO Number:</span>{" "}
            {order.purchaseOrderNo}
          </div>
          <div>
            <span className="font-semibold">Vendor:</span> {order.vendorName}
          </div>
        </div>

        <Table headers={headers} data={tableData} headerlabel="Order Items" />
        <Formik initialValues={{ hospitalId: "" }} onSubmit={() => {}}>
          {({ setFieldValue, errors, touched }) => (
            <Form>
              {/* Commentout hospital field */}
              {/* <div className="mt-4">
                <Label text="Hospital :" required />

                <Field
                  as="select"
                  name="hospitalId"
                  className="form-input-box"
                  onChange={(e) => {
                    setHospitalId(e.target.value);
                    setFieldValue("hospitalId", e.target.value);
                  }}
                >
                  <option value="">Select Hospital</option>

                  {hospitalList.map((hospital) => (
                    <option
                      key={hospital.NUM_HOSPITAL_ID}
                      value={hospital.NUM_HOSPITAL_ID}
                    >
                      {hospital.VAR_HOSPITAL_NAME}
                    </option>
                  ))}
                </Field>
                {touched.hospitalId && errors.hospitalId && (
                  <div className="text-red-500 text-sm">
                    {errors.hospitalId}
                  </div>
                )}
              </div> */}
            </Form>
          )}
        </Formik>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve & Issue
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default FrmEditOrder;
