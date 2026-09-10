import React, { useState } from "react";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import {
  FaExchangeAlt,
  FaTruckLoading,
  FaEdit,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FrmInventManage = () => {
  const [activeTab, setActiveTab] = useState("all");
    const navigate = useNavigate();
  

  // 🔹 Dummy data
  const inventoryItems = [
    [
      "MED-00125",
      "Paracetamol 500mg",
      "Medicine",
      "1,250 tablets",
      500,
      5000,
      "₹8,750",
      <span className="px-2 py-1 text-xs text-white rounded bg-green-500">
        In Stock
      </span>,
      <div className="flex gap-2 justify-center">
        <button className="p-1 border rounded hover:bg-blue-100">
          <FaEdit />
        </button>
        <button className="p-1 border rounded hover:bg-blue-100">
          <FaEye />
        </button>
        <button className="p-1 border rounded hover:bg-blue-100">
          <FaExchangeAlt />
        </button>
      </div>,
    ],
    [
      "MED-00342",
      "Amoxicillin 250mg",
      "Medicine",
      "350 capsules",
      500,
      2500,
      "₹5,250",
      <span className="px-2 py-1 text-xs text-white rounded bg-yellow-500">
        Low Stock
      </span>,
      <div className="flex gap-2 justify-center">
        <button className="p-1 border rounded hover:bg-blue-100">
          <FaEdit />
        </button>
        <button className="p-1 border rounded hover:bg-blue-100">
          <FaEye />
        </button>
        <button className="p-1 border rounded hover:bg-blue-100">
          <FaExchangeAlt />
        </button>
      </div>,
    ],
    [
      "EQ-01024",
      "Ventilator V45 Pro",
      "Equipment",
      "5 units",
      2,
      10,
      "₹1,250,000",
      <span className="px-2 py-1 text-xs text-white rounded bg-green-500">
        In Stock
      </span>,
      <div className="flex gap-2 justify-center">
        <button className="p-1 border rounded hover:bg-blue-100">
          <FaEdit />
        </button>
        <button className="p-1 border rounded hover:bg-blue-100">
          <FaEye />
        </button>
        <button className="p-1 border rounded hover:bg-blue-100">
          <FaExchangeAlt />
        </button>
      </div>,
    ],
  ];

  // 🔹 Table headers
  const headers = [
    "Item Code",
    "Name",
    "Category",
    "Stock",
    "Min",
    "Max",
    "Value",
    "Status",
    "Actions",
  ];

  return (
    <Layout
      title="Inventory Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Inventory Management",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        {/* <h2 className="text-xl font-semibold">Inventory Management</h2> */}
        <div className="flex gap-2">
          <Button
            type="button" onClick={() => navigate("/Transaction/FrmStockAdjust")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <FaExchangeAlt className="inline mr-1" /> Stock Adjustment
          </Button>
          <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/Transaction/FrmStockTransfer")}>
            <FaTruckLoading className="inline mr-1" /> Transfer Stock
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-4 flex gap-6">
        {["all", "medicine", "equipment", "lowstock", "batch"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-600"
            }`}
          >
            {tab === "all" && "All Items"}
            {tab === "medicine" && "Medicines"}
            {tab === "equipment" && "Equipment"}
            {tab === "lowstock" && "Low Stock"}
            {tab === "batch" && "Batch Tracking"}
          </button>
        ))}
      </div>

      {/* Table */}
      {activeTab === "all" && (
        <Table
          headerlabel="Inventory List"
          headers={headers}
          data={inventoryItems}
        />
      )}
    </Layout>
  );
};

export default FrmInventManage;
