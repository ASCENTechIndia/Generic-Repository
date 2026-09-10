import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  Filter,
  X,
  Truck,
  Star,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  Printer,
  Send,
} from "lucide-react";

import HeaderLabel from "../../../Components/HeaderLabel";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import { useNavigate } from "react-router-dom";

const FrmProcureManage = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("procurement");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPODetail, setShowPODetail] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [createPOModal, setCreatePOModal] = useState(false);
  const [addItemModal, setAddItemModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [poItems, setPoItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  // Sample data
  const purchaseOrders = [
    {
      id: "PO-2023-00124",
      supplier: "PharmaCorp Inc.",
      created: "12/05/2023",
      items: 8,
      totalValue: "₹42,800",
      status: "Pending Approval",
      statusClass: "bg-yellow-100 text-yellow-800",
      details: {
        supplierContact:
          "Mr. Rajesh Kumar\n+91 98765 43210\nrajesh@pharmacorp.com",
        deliveryAddress:
          "Central Medical Store, Main Hospital Building, 1st Floor",
        expectedDelivery: "20/05/2023",
        priority: "High",
        priorityClass: "bg-blue-100 text-blue-800",
        items: [
          {
            code: "M-0425",
            name: "Paracetamol 500mg Tablets",
            quantity: 5000,
            unitPrice: "₹0.80",
            total: "₹4,000",
            status: "Not Received",
          },
          {
            code: "M-0781",
            name: "Amoxicillin 250mg Capsules",
            quantity: 2000,
            unitPrice: "₹1.50",
            total: "₹3,000",
            status: "Not Received",
          },
          {
            code: "M-1032",
            name: "Insulin Glargine 100IU/ml",
            quantity: 100,
            unitPrice: "₹280",
            total: "₹28,000",
            status: "Not Received",
          },
          {
            code: "M-1125",
            name: "Salbutamol Inhaler 100mcg",
            quantity: 50,
            unitPrice: "₹155",
            total: "₹7,750",
            status: "Not Received",
          },
        ],
        subtotal: "₹42,800",
        tax: "₹5,136",
        total: "₹47,936",
      },
    },
    {
      id: "PO-2023-00123",
      supplier: "MediSupplies Ltd.",
      created: "11/05/2023",
      items: 12,
      totalValue: "₹87,500",
      status: "Approved",
      statusClass: "bg-green-100 text-green-800",
    },
    {
      id: "PO-2023-00122",
      supplier: "Global Health Solutions",
      created: "10/05/2023",
      items: 5,
      totalValue: "₹23,400",
      status: "Ordered",
      statusClass: "bg-blue-100 text-blue-800",
    },
    {
      id: "PO-2023-00121",
      supplier: "Surgical Equipment Co.",
      created: "08/05/2023",
      items: 3,
      totalValue: "₹152,000",
      status: "Partially Received",
      statusClass: "bg-indigo-100 text-indigo-800",
    },
    {
      id: "PO-2023-00120",
      supplier: "PharmaCorp Inc.",
      created: "05/05/2023",
      items: 7,
      totalValue: "₹18,900",
      status: "Completed",
      statusClass: "bg-gray-100 text-gray-800",
    },
  ];

  const suppliers = [
    {
      id: 1,
      name: "PharmaCorp Inc.",
      category: "Medical supplies & medicines",
      rating: 4.5,
    },
    {
      id: 2,
      name: "MediSupplies Ltd.",
      category: "Medical equipment & devices",
      rating: 4.0,
    },
    {
      id: 3,
      name: "Global Health Solutions",
      category: "Pharmaceuticals",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Surgical Equipment Co.",
      category: "Surgical instruments",
      rating: 4.5,
    },
  ];

  const items = [
    {
      id: "M-0425",
      name: "Paracetamol 500mg Tablets",
      category: "Medicine",
      stock: 1250,
      stockStatus: "text-red-500",
      unit: "Tablets",
      price: 0.8,
    },
    {
      id: "M-0781",
      name: "Amoxicillin 250mg Capsules",
      category: "Medicine",
      stock: 350,
      stockStatus: "text-yellow-500",
      unit: "Capsules",
      price: 1.5,
    },
    {
      id: "M-1032",
      name: "Insulin Glargine 100IU/ml",
      category: "Medicine",
      stock: 42,
      stockStatus: "text-green-500",
      unit: "Vials",
      price: 280,
    },
    {
      id: "M-1125",
      name: "Salbutamol Inhaler 100mcg",
      category: "Medicine",
      stock: 85,
      stockStatus: "text-green-500",
      unit: "Inhalers",
      price: 155,
    },
    {
      id: "E-2025",
      name: "Ventilator V45 Pro",
      category: "Equipment",
      stock: 2,
      stockStatus: "text-red-500",
      unit: "Units",
      price: 125000,
    },
  ];

  const pendingApprovals = [
    {
      id: "PO-2023-00124",
      amount: "₹42,800",
      supplier: "PharmaCorp Inc.",
      items: 8,
      status: "Waiting for pharmacy approval",
    },
    {
      id: "PO-2023-00119",
      amount: "₹67,300",
      supplier: "MediSupplies Ltd.",
      items: 14,
      status: "Waiting for medical superintendent approval",
    },
    {
      id: "PO-2023-00118",
      amount: "₹124,500",
      supplier: "Surgical Equipment Co.",
      items: 3,
      status: "Waiting for finance approval",
    },
  ];

  const supplierPerformance = [
    { name: "PharmaCorp Inc.", percentage: 94, color: "bg-green-500" },
    { name: "MediSupplies Ltd.", percentage: 87, color: "bg-green-500" },
    { name: "Global Health Solutions", percentage: 79, color: "bg-yellow-500" },
    { name: "Surgical Equipment Co.", percentage: 92, color: "bg-green-500" },
  ];

  const handleViewPO = (po) => {
    setSelectedPO(po);
    setShowPODetail(true);
  };

  const handleAddItem = (item) => {
    const existingItem = poItems.find((i) => i.id === item.id);

    if (existingItem) {
      setPoItems(
        poItems.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + 1,
                total: (i.quantity + 1) * i.price,
              }
            : i
        )
      );
    } else {
      setPoItems([
        ...poItems,
        {
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: 1,
          total: item.price,
        },
      ]);
    }
    setAddItemModal(false);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setPoItems(
      poItems.map((item) =>
        item.id === id
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setPoItems(poItems.filter((item) => item.id !== id));
  };

  const calculateTotals = () => {
    const subtotal = poItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key={fullStars}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={fullStars + i + (hasHalfStar ? 1 : 0)}
          className="w-4 h-4 text-yellow-400"
        />
      );
    }

    return stars;
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <Layout
      title="Procurement Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Procurement Management",
      }}
    >
      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <Button
            className="mt-4 md:mt-0"
            onClick={() => setCreatePOModal(true)}
          >
            Create Purchase Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { number: "24", label: "Pending PO" },
            { number: "18", label: "Approval Needed" },
            { number: "42", label: "Items to Order" },
            { number: "₹284,500", label: "Pending Budget" },
            { number: "7", label: "Delayed Orders" },
            { number: "92%", label: "Procurement Rate" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 text-center"
            >
              <div className="text-2xl font-bold text-blue-700">
                {stat.number}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search PO, supplier..."
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="ordered">Ordered</option>
              <option value="partial">Partially Received</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
            >
              <option value="">All Suppliers</option>
              <option value="1">PharmaCorp Inc.</option>
              <option value="2">MediSupplies Ltd.</option>
              <option value="3">Global Health Solutions</option>
              <option value="4">Surgical Equipment Co.</option>
            </select>
            <input
              type="date"
              className="p-2 border border-gray-300 rounded-md"
              placeholder="From Date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
            />
            <button className="bg-blue-600 text-white p-2 rounded-md flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Purchase Orders Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <span className="font-semibold">Purchase Orders</span>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                        PO Number
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Supplier
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Created
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Items
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Value
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {purchaseOrders.map((po, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => handleViewPO(po)}
                          >
                            {po.id}
                          </button>
                        </td>
                        <td className="p-3">{po.supplier}</td>
                        <td className="p-3">{po.created}</td>
                        <td className="p-3">{po.items}</td>
                        <td className="p-3">{po.totalValue}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${po.statusClass}`}
                          >
                            {po.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded border border-gray-200"
                              onClick={() => handleViewPO(po)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:bg-gray-100 rounded border border-gray-200">
                              <Edit className="w-4 h-4" />
                            </button>
                            {po.status === "Ordered" ||
                            po.status === "Partially Received" ? (
                              <button className="p-1 text-green-600 hover:bg-green-50 rounded border border-gray-200">
                                <Truck className="w-4 h-4" />
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="p-1 text-gray-500 rounded-md border border-gray-300 disabled:opacity-50">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="w-8 h-8 text-white bg-blue-600 rounded-md text-sm font-medium">
                    1
                  </button>
                  <button className="w-8 h-8 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100">
                    2
                  </button>
                  <button className="w-8 h-8 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100">
                    3
                  </button>
                  <button className="p-1 text-gray-500 rounded-md border border-gray-300">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Procurement Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="font-semibold mb-4">Procurement Timeline</div>
              <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {[
                  {
                    title: "Requisition Created",
                    date: "12/05/2023 10:24 AM",
                    by: "By: Dr. Sharma",
                    status: "completed",
                  },
                  {
                    title: "Approved by HOD",
                    date: "12/05/2023 2:45 PM",
                    by: "By: Dr. Patel",
                    status: "completed",
                  },
                  {
                    title: "Pending Pharmacy Approval",
                    date: "Expected: 13/05/2023",
                    status: "active",
                  },
                  { title: "PO Generation", status: "upcoming" },
                  { title: "Supplier Confirmation", status: "upcoming" },
                  { title: "Delivery", status: "upcoming" },
                ].map((step, index) => (
                  <div key={index} className="relative mb-6 last:mb-0">
                    <div
                      className={`absolute -left-7 top-1 w-3 h-3 rounded-full border-2 border-white ${
                        step.status === "completed"
                          ? "bg-green-500"
                          : step.status === "active"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`${
                        step.status === "active" ? "font-medium" : ""
                      }`}
                    >
                      {step.title}
                    </div>
                    {step.date && (
                      <div className="text-sm text-gray-500">{step.date}</div>
                    )}
                    {step.by && (
                      <div className="text-sm text-gray-500">{step.by}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <span className="font-semibold">Pending Approvals</span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  3
                </span>
              </div>
              <div className="p-4 space-y-4">
                {pendingApprovals.map((approval, index) => (
                  <div
                    key={index}
                    className="bg-yellow-50 p-3 rounded-md border border-yellow-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{approval.id}</span>
                      <span className="font-semibold">{approval.amount}</span>
                    </div>
                    <div className="text-sm mb-2">
                      {approval.supplier} • {approval.items} items
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      {approval.status}
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-md">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supplier Performance */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <span className="font-semibold">Supplier Performance</span>
              </div>
              <div className="p-4 space-y-4">
                {supplierPerformance.map((supplier, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{supplier.name}</span>
                      <span className="text-sm">{supplier.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${supplier.color} h-2 rounded-full`}
                        style={{ width: `${supplier.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PO Detail View */}
        {showPODetail && selectedPO && (
          <div className="bg-white rounded-lg shadow-sm mt-6">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">
                Purchase Order Details: {selectedPO.id}
              </h3>
              <button
                className="p-1 text-gray-500 hover:bg-gray-100 rounded-md"
                onClick={() => setShowPODetail(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="font-medium mb-3">Order Information</div>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-1 text-gray-500 font-medium">
                          PO Number
                        </td>
                        <td className="py-1">{selectedPO.id}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-500 font-medium">
                          Created Date
                        </td>
                        <td className="py-1">{selectedPO.created}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-500 font-medium">
                          Supplier
                        </td>
                        <td className="py-1">{selectedPO.supplier}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-500 font-medium">
                          Supplier Contact
                        </td>
                        <td className="py-1 whitespace-pre-line">
                          {selectedPO.details.supplierContact}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-500 font-medium">
                          Delivery Address
                        </td>
                        <td className="py-1">
                          {selectedPO.details.deliveryAddress}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="font-medium mb-3">Order Status</div>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-1 text-gray-500 font-medium">
                          Current Status
                        </td>
                        <td className="py-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${selectedPO.statusClass}`}
                          >
                            {selectedPO.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-500 font-medium">
                          Expected Delivery
                        </td>
                        <td className="py-1">
                          {selectedPO.details.expectedDelivery}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-500 font-medium">
                          Total Items
                        </td>
                        <td className="py-1">{selectedPO.items}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-500 font-medium">
                          Total Value
                        </td>
                        <td className="py-1">{selectedPO.totalValue}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-500 font-medium">
                          Priority
                        </td>
                        <td className="py-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${selectedPO.details.priorityClass}`}
                          >
                            {selectedPO.details.priority}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="font-medium mb-3">Order Items</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 text-left text-gray-500 font-medium">
                          Item Code
                        </th>
                        <th className="py-2 text-left text-gray-500 font-medium">
                          Item Name
                        </th>
                        <th className="py-2 text-left text-gray-500 font-medium">
                          Quantity
                        </th>
                        <th className="py-2 text-left text-gray-500 font-medium">
                          Unit Price
                        </th>
                        <th className="py-2 text-left text-gray-500 font-medium">
                          Total
                        </th>
                        <th className="py-2 text-left text-gray-500 font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPO.details.items.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 last:border-b-0"
                        >
                          <td className="py-3">{item.code}</td>
                          <td className="py-3">{item.name}</td>
                          <td className="py-3">
                            {item.quantity.toLocaleString()}
                          </td>
                          <td className="py-3">{item.unitPrice}</td>
                          <td className="py-3">{item.total}</td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="py-2 text-right font-medium">
                          Subtotal:
                        </td>
                        <td className="py-2 font-medium">
                          {selectedPO.details.subtotal}
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="py-2 text-right font-medium">
                          Tax (12%):
                        </td>
                        <td className="py-2 font-medium">
                          {selectedPO.details.tax}
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="py-2 text-right font-medium">
                          Total:
                        </td>
                        <td className="py-2 font-medium">
                          {selectedPO.details.total}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                  <Printer className="w-4 h-4 mr-2" />
                  Print PO
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  Send to Supplier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create PO Modal */}
      {createPOModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">Create New Purchase Order</h3>
              <button
                className="p-1 text-gray-500 hover:bg-gray-100 rounded-md"
                onClick={() => setCreatePOModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 ${
                    currentTab === 1
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => setCurrentTab(1)}
                >
                  1. Select Supplier
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 ${
                    currentTab === 2
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => setCurrentTab(2)}
                  disabled={!selectedSupplier}
                >
                  2. Add Items
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 ${
                    currentTab === 3
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => setCurrentTab(3)}
                  disabled={poItems.length === 0}
                >
                  3. Review & Submit
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Tab 1: Select Supplier */}
              {currentTab === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">
                      Select from existing suppliers:
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {suppliers.map((supplier) => (
                        <div
                          key={supplier.id}
                          className={`border rounded-lg p-4 cursor-pointer ${
                            selectedSupplier?.id === supplier.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setSelectedSupplier(supplier)}
                        >
                          <div className="text-center">
                            <h5 className="font-medium">{supplier.name}</h5>
                            <p className="text-sm text-gray-500 mb-2">
                              {supplier.category}
                            </p>
                            <div className="flex justify-center items-center mb-2">
                              {renderStars(supplier.rating)}
                              <span className="ml-1 text-sm">
                                {supplier.rating}
                              </span>
                            </div>
                            <button className="text-sm text-blue-600 font-medium">
                              Select
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Or add a new supplier:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Supplier Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Add Supplier
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Add Items */}
              {currentTab === 2 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Add Items from Inventory</h4>
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm flex items-center"
                      onClick={() => setAddItemModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </button>
                  </div>

                  {poItems.length > 0 ? (
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Item
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Category
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Quantity
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Unit Price
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Total
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {poItems.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-200 last:border-b-0"
                            >
                              <td className="py-3">
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {item.id}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3">{item.category}</td>
                              <td className="py-3">
                                <div className="flex items-center border border-gray-300 rounded-md w-fit">
                                  <button
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                  >
                                    -
                                  </button>
                                  <span className="px-2 py-1">
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="py-3">₹{item.price.toFixed(2)}</td>
                              <td className="py-3">₹{item.total.toFixed(2)}</td>
                              <td className="py-3">
                                <button
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center mb-6">
                      <div className="text-gray-400 mb-2">
                        No items added yet
                      </div>
                      <button
                        className="text-blue-600 font-medium"
                        onClick={() => setAddItemModal(true)}
                      >
                        Add your first item
                      </button>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium mb-3">Order Summary</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Subtotal:</div>
                      <div className="text-right">₹{subtotal.toFixed(2)}</div>
                      <div>Tax (12%):</div>
                      <div className="text-right">₹{tax.toFixed(2)}</div>
                      <div className="font-medium">Total:</div>
                      <div className="font-medium text-right">
                        ₹{total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Review & Submit */}
              {currentTab === 3 && (
                <div>
                  <h4 className="font-medium mb-4">Review Purchase Order</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h5 className="font-medium mb-3">Supplier Information</h5>
                      <div className="text-sm">
                        <div className="font-medium">
                          {selectedSupplier.name}
                        </div>
                        <div className="text-gray-500">
                          {selectedSupplier.category}
                        </div>
                        <div className="flex items-center mt-1">
                          {renderStars(selectedSupplier.rating)}
                          <span className="ml-1 text-sm">
                            {selectedSupplier.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <h5 className="font-medium mb-3">Delivery Information</h5>
                      <div className="text-sm">
                        <div className="mb-2">
                          <label className="block text-gray-500 mb-1">
                            Delivery Address
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            defaultValue="Central Medical Store, Main Hospital Building, 1st Floor"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-gray-500 mb-1">
                            Expected Delivery Date
                          </label>
                          <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Order Items</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Item
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Quantity
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Unit Price
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {poItems.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-200 last:border-b-0"
                            >
                              <td className="py-3">
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {item.id}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3">{item.quantity}</td>
                              <td className="py-3">₹{item.price.toFixed(2)}</td>
                              <td className="py-3">₹{item.total.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td
                              colSpan="3"
                              className="py-2 text-right font-medium"
                            >
                              Subtotal:
                            </td>
                            <td className="py-2 font-medium">
                              ₹{subtotal.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan="3"
                              className="py-2 text-right font-medium"
                            >
                              Tax (12%):
                            </td>
                            <td className="py-2 font-medium">
                              ₹{tax.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan="3"
                              className="py-2 text-right font-medium"
                            >
                              Total:
                            </td>
                            <td className="py-2 font-medium">
                              ₹{total.toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h5 className="font-medium mb-3">Additional Notes</h5>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="3"
                      placeholder="Add any special instructions or notes for this order..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={() => setCurrentTab(2)}
                    >
                      Back
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Submit Purchase Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between">
              {currentTab > 1 ? (
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setCurrentTab(currentTab - 1)}
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {currentTab < 3 ? (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => setCurrentTab(currentTab + 1)}
                  disabled={
                    (currentTab === 1 && !selectedSupplier) ||
                    (currentTab === 2 && poItems.length === 0)
                  }
                >
                  Next
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {addItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">Add Items from Inventory</h3>
              <button
                className="p-1 text-gray-500 hover:bg-gray-100 rounded-md"
                onClick={() => setAddItemModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 text-left text-gray-500 font-medium">
                        Item Code
                      </th>
                      <th className="py-2 text-left text-gray-500 font-medium">
                        Item Name
                      </th>
                      <th className="py-2 text-left text-gray-500 font-medium">
                        Category
                      </th>
                      <th className="py-2 text-left text-gray-500 font-medium">
                        Current Stock
                      </th>
                      <th className="py-2 text-left text-gray-500 font-medium">
                        Unit Price
                      </th>
                      <th className="py-2 text-left text-gray-500 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="py-3">{item.id}</td>
                        <td className="py-3">{item.name}</td>
                        <td className="py-3">{item.category}</td>
                        <td className="py-3">
                          <span className={item.stockStatus}>{item.stock}</span>
                        </td>
                        <td className="py-3">₹{item.price.toFixed(2)}</td>
                        <td className="py-3">
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                            onClick={() => handleAddItem(item)}
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FrmProcureManage;
