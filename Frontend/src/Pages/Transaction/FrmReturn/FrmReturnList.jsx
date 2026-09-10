import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, Check, X, Plus, Printer, Edit, Trash2 } from "lucide-react";
import Layout from "../../../Components/Layout";
import Table from "../../../Components/Table";
import Button from "../../../Components/Button";
import Pdf from "../../../Components/Pdf";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import {
  formatDate,
  formatDatebyMonthSmall,
  formatDateMonth,
} from "../../../utils/dateUtils";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { useLoader } from "../../../Context/LoaderContext";

const mockReturnTransactions = [
  {
    id: "RET-4521",
    type: "Patient Return",
    source: "Rajesh Kumar (MRN-12345)",
    items: "2 items",
    reason: "Adverse Reaction",
    returnedBy: "Pharmacist Mehta",
    date: "12/05/2023",
    status: "Pending",
    statusColorClass: "bg-yellow-100 text-yellow-800 border-yellow-500",
    actionNeeded: true,
  },
  {
    id: "RET-4520",
    type: "Department Return",
    source: "Emergency Department",
    items: "3 items",
    reason: "Overstock",
    returnedBy: "Nurse Sharma",
    date: "11/05/2023",
    status: "Completed",
    statusColorClass: "bg-green-100 text-green-800 border-green-500",
    actionNeeded: false,
  },
  {
    id: "RET-4519",
    type: "Supplier Return",
    source: "MediSupplies Ltd.",
    items: "5 items",
    reason: "Damaged",
    returnedBy: "Store Manager",
    date: "10/05/2023",
    status: "Completed",
    statusColorClass: "bg-green-100 text-green-800 border-green-500",
    actionNeeded: false,
  },
  {
    id: "RET-4518",
    type: "Expired Stock",
    source: "Pharmacy Store",
    items: "8 items",
    reason: "Expired",
    returnedBy: "Pharmacist Roy",
    date: "09/05/2023",
    status: "Completed",
    statusColorClass: "bg-green-100 text-green-800 border-green-500",
    actionNeeded: false,
  },
  {
    id: "RET-4517",
    type: "Damaged Goods",
    source: "Ward B",
    items: "1 item",
    reason: "Broken",
    returnedBy: "Nurse Patel",
    date: "08/05/2023",
    status: "Approved",
    statusColorClass: "bg-blue-100 text-blue-800 border-blue-500",
    actionNeeded: true,
  },
];

const FrmReturnList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [transactions, setTransactions] = useState(mockReturnTransactions);
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const [filters, setFilters] = useState({ type: "", status: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsToReturn, setItemsToReturn] = useState([
    { item: "", batch: "", quantity: 1, condition: "" },
  ]);
  const [tableData, setTableData] = useState([]);



  const validationSchema = Yup.object({
    returnType: Yup.string().required("Return Type is required"),
    reason: Yup.string().required("Reason is required"),
    source: Yup.string().required("Source is required"),
    notes: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      returnType: "",
      source: "",
      reason: "",
      notes: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const newReturn = {
        id: `RET-${Math.floor(Math.random() * 9000) + 1000}`,
        ...values,
        items: `${itemsToReturn.length} items`,
        returnedBy: "User ABC",
        date: new Date().toLocaleDateString("en-GB"),
        status: "Pending",
        statusColorClass: "bg-yellow-100 text-yellow-800 border-yellow-500",
        actionNeeded: true,
      };

      setTransactions((prevTransactions) => [newReturn, ...prevTransactions]);
      console.log("Submitting new return:", newReturn);
      alert("New return successfully submitted for approval!");
      resetForm();
      setItemsToReturn([{ item: "", batch: "", quantity: 1, condition: "" }]);
    },
  });

  useEffect(() => {
    let result = transactions;

    if (filters.type) {
      result = result.filter(
        (transaction) => transaction.type === filters.type
      );
    }
    if (filters.status) {
      result = result.filter(
        (transaction) => transaction.status === filters.status
      );
    }
    if (searchTerm) {
      result = result.filter((transaction) =>
        Object.values(transaction).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredTransactions(result);
  }, [filters, searchTerm, transactions]);

  const handleDelete = async (data) => {
    if (!userId || !ulbid) return;
    try {
      setLoading(true);
      const ip = await GetIPAddress();
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_UlbId: Number(ulbid),
        in_returnAdjId: Number(data.returnAdjId),
        in_itemid: Number(data.issueItemId),
        in_deptId: Number(data.deptId),
        in_Issueid: Number(data.issueId),
        in_type: data.adjType,
        in_quantity: Number(data.quantityReturn),
        in_adjDate: formatDateMonth(formatDate(data.adjDate)),
        in_reason: data.reason,
        in_remarks: data.remarks,
        in_ipaddress: ip,
        in_source: config.source,
      };
      const res = await apiService.post("aoin_ReturnAdjustment_ins", payload);
      if (res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        navigate(0);
      } else {
        alert(res?.data?.errorMessage);
      }
    } catch (err) {
      console.error("Error in Return Adjustment:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReturnList = async () => {
    try {
      setLoading(true);
      const payload = {
        ulbId: ulbid,
      };
      const res = await apiService.post("getReturnAdjustmentList", payload);
      if (res?.data?.length > 0) {
        const data = res.data.map((data) => {
          return [
            data.returnAdjId,
            data.adjType,
            data.itemName,
            data.quantityReturn,
            data.reason,
            formatDate(data.adjDate),
            data.deptName,
            data.issuedBy,
          ];
        });
        setTableData(data);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (ulbid) {
      fetchReturnList();
    }
  }, [ulbid]);

  const headers = [
    "Return ID",
    "Type",
    "Items",
    "Quantity",
    "Reason",
    "Date",
    "Departement",
    "Issued By",
  ];

  const data = filteredTransactions.map((transaction) => [
    transaction.id,
    transaction.type,
    transaction.source,
    transaction.items,
    transaction.reason,
    transaction.date,
    <span
      key={`status-${transaction.id}`}
      className={`px-3 py-1 text-xs font-semibold rounded-full border ${transaction.statusColorClass}`}
    >
      {transaction.status}
    </span>,
    <div
      key={`actions-${transaction.id}`}
      className="flex justify-center gap-2"
    >
      <Button
        type="button"
        className="bg-blue-600 text-white hover:bg-blue-700 px-2 py-1 rounded"
        onClick={() => console.log("View return:", transaction.id)}
      >
        <Eye size={16} />
      </Button>
      {transaction.actionNeeded ? (
        <>
          <Button
            type="button"
            className="bg-green-600 text-white hover:bg-green-700 px-2 py-1 rounded"
            onClick={() => {
              const updated = transactions.map((t) =>
                t.id === transaction.id
                  ? {
                      ...t,
                      status: "Completed",
                      actionNeeded: false,
                      statusColorClass:
                        "bg-green-100 text-green-800 border-green-500",
                    }
                  : t
              );
              setTransactions(updated);
            }}
          >
            <Check size={16} />
          </Button>
          <Button
            type="button"
            className="bg-red-600 text-white hover:bg-red-700 px-2 py-1 rounded"
            onClick={() => {
              // Logic to update the status to "Rejected"
              const updated = transactions.map((t) =>
                t.id === transaction.id
                  ? {
                      ...t,
                      status: "Rejected",
                      actionNeeded: false,
                      statusColorClass:
                        "bg-red-100 text-red-800 border-red-500",
                    }
                  : t
              );
              setTransactions(updated);
            }}
          >
            <X size={16} />
          </Button>
        </>
      ) : (
        <Pdf
          fileName={`Return-${transaction.id}.pdf`}
          buttonText={<Printer size={16} />}
          buttonClass="bg-gray-400 text-white hover:bg-gray-500 px-2 py-1 rounded"
          tableHeader={[
            "Return ID",
            "Type",
            "Source",
            "Items",
            "Reason",
            "Returned By",
            "Date",
            "Status",
          ]}
          tableData={[
            [
              transaction.id,
              transaction.type,
              transaction.source,
              transaction.items,
              transaction.reason,
              transaction.returnedBy,
              transaction.date,
              transaction.status,
            ],
          ]}
        />
      )}
    </div>,
  ]);

  return (
    <Layout
      title="Returns Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Returns",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
      </div>
      <Table
        // headerlabel="Return List"
        headers={headers}
        data={tableData}
      />
    </Layout>
  );
}

export default FrmReturnList
