import React, { useState } from "react";
import {
  Eye,
  CheckCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Layout from "../../../Components/Layout";
import Table from "../../../Components/Table";
import Button from "../../../Components/Button";
import { useNavigate } from "react-router-dom";

// Helper component for the Maintenance Overview cards
const MaintenanceCard = ({ title, value, icon, color }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
    <div className={`text-3xl ${color} mb-2`}>{icon}</div>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
  </div>
);

// Helper component for the Maintenance Overview section
const MaintenanceOverview = ({ data }) => {
  const totalThisMonth = data.length;
  const overdueCount = data.filter((item) => item.status === "Overdue").length;
  const inProgressCount = data.filter(
    (item) => item.status === "In Progress"
  ).length;
  const completedCount = data.filter(
    (item) => item.status === "Completed"
  ).length;
  const scheduledCount = data.filter(
    (item) => item.status === "Scheduled"
  ).length;

  // Calculates percentage based on the total number of maintenance tasks
  const calculatePercentage = (count) =>
    totalThisMonth > 0 ? Math.round((count / totalThisMonth) * 100) : 0;

  const statusData = [
    {
      label: "Completed",
      value: calculatePercentage(completedCount),
      color: "bg-green-500",
    },
    {
      label: "In Progress",
      value: calculatePercentage(inProgressCount),
      color: "bg-yellow-500",
    },
    {
      label: "Scheduled",
      value: calculatePercentage(scheduledCount),
      color: "bg-blue-500",
    },
    {
      label: "Overdue",
      value: calculatePercentage(overdueCount),
      color: "bg-red-500",
    },
  ];

  const typeData = [
    {
      label: "Preventive",
      value: calculatePercentage(
        data.filter((item) => item.type === "Preventive").length
      ),
    },
    {
      label: "Corrective",
      value: calculatePercentage(
        data.filter((item) => item.type === "Corrective").length
      ),
    },
    {
      label: "Calibration",
      value: calculatePercentage(
        data.filter((item) => item.type === "Calibration").length
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex-1">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Maintenance Overview
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <MaintenanceCard
          title="Total this Month"
          value={totalThisMonth}
          color="text-blue-600"
        />
        <MaintenanceCard
          title="Overdue"
          value={overdueCount}
          color="text-red-600"
        />
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Maintenance Status
          </h4>
          <div className="space-y-2 text-sm">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="flex-1 text-gray-600">{item.label}</span>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${item.color} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-gray-600 font-medium w-10 text-right">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Maintenance Type
          </h4>
          <div className="space-y-2 text-sm">
            {typeData.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="flex-1 text-gray-600">{item.label}</span>
                <span className="ml-2 text-gray-600 font-medium">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for the upcoming maintenance list
const UpcomingMaintenanceList = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Upcoming Maintenance
        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {data.length}
        </span>
      </h3>
      <ul className="space-y-4">
        {data.length > 0 ? (
          data.map((item, index) => (
            <li
              key={index}
              className="flex flex-col border-b last:border-b-0 pb-4"
            >
              <p className="font-semibold text-gray-900">{item.equipment}</p>
              <p className="text-sm text-gray-500 mb-2">
                {item.type} •{" "}
                <span
                  className={
                    item.priority === "High"
                      ? "text-red-600 font-semibold"
                      : item.priority === "Medium"
                      ? "text-yellow-600 font-semibold"
                      : "text-blue-600 font-semibold"
                  }
                >
                  {item.priority} Priority
                </span>
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  className="bg-green-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Start
                </Button>
                <Button
                  type="button"
                  className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reschedule
                </Button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            No upcoming maintenance scheduled. 🎉
          </p>
        )}
      </ul>
    </div>
  );
};

// Simple Calendar Component
const SimpleCalendar = () => {
  const today = new Date();
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(today.getFullYear(), today.getMonth());
  const firstDay = getFirstDayOfMonth(today.getFullYear(), today.getMonth());
  const monthName = today.toLocaleString("default", { month: "long" });

  // Placeholder data matching the image
  const maintenanceData = [
    { day: 5, equipment: "ECG Machine", type: "Corrective" },
    { day: 8, equipment: "Ventilator", type: "Preventive" },
    { day: 10, equipment: "Defibrillator", type: "Corrective" },
    { day: 12, equipment: "Ventilator", type: "Preventive" },
    { day: 15, equipment: "Patient Monitor", type: "Calibration" },
    { day: 18, equipment: "Infusion Pump", type: "Preventive" },
    { day: 23, equipment: "Ultrasound", type: "Corrective" },
    { day: 26, equipment: "Anesthesia Machine", type: "Preventive" },
  ];

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "corrective":
        return "bg-pink-100 text-red-700 border-red-300";
      case "preventive":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "calibration":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex-1">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <CalendarDays size={20} className="text-gray-600" />
        Maintenance Calendar
      </h3>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-gray-700">
          {monthName} {today.getFullYear()}
        </span>
        <div className="flex gap-2">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            &lt;
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            &gt;
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-600">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day} className="py-2">
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="p-1 h-20"></div>
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const maintenanceToday = maintenanceData.filter((m) => m.day === day);
          return (
            <div
              key={day}
              className="p-1 border border-gray-200 h-20 flex flex-col items-start rounded-md transition-shadow hover:shadow-lg"
            >
              <span className="font-semibold text-gray-800">{day}</span>
              {maintenanceToday.map((m, idx) => (
                <div
                  key={idx}
                  className={`text-xs px-1 py-0.5 rounded-sm border ${getTypeColor(
                    m.type
                  )} mt-1`}
                >
                  {m.equipment}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FrmMaintananceManage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const maintenanceData = [
    // Expanded data for demonstration, so pagination will be visible.
    {
      id: "MNT-1024",
      equipment: "Ventilator V45 Pro",
      type: "Corrective",
      priority: "High",
      scheduleDate: "10/05/2023",
      dueDate: "12/05/2023",
      assignedTo: "Biomedical Engineer",
      status: "Overdue",
    },
    {
      id: "MNT-1025",
      equipment: "Defibrillator LifeLine DS",
      type: "Preventive",
      priority: "Medium",
      scheduleDate: "15/05/2023",
      dueDate: "15/05/2023",
      assignedTo: "Technician Roy",
      status: "In Progress",
    },
    {
      id: "MNT-1026",
      equipment: "Patient Monitor PM-100",
      type: "Calibration",
      priority: "Low",
      scheduleDate: "15/05/2023",
      dueDate: "18/05/2023",
      assignedTo: "Technician Sharma",
      status: "Scheduled",
    },
    {
      id: "MNT-1023",
      equipment: "ECG Machine Pro",
      type: "Corrective",
      priority: "High",
      scheduleDate: "05/05/2023",
      dueDate: "08/05/2023",
      assignedTo: "Biomedical Engineer",
      status: "Completed",
    },
    {
      id: "MNT-1022",
      equipment: "Infusion Pump IP-200",
      type: "Preventive",
      priority: "Medium",
      scheduleDate: "01/05/2023",
      dueDate: "05/05/2023",
      assignedTo: "Technician Mehta",
      status: "Completed",
    },
    {
      id: "MNT-1027",
      equipment: "Ultrasound System",
      type: "Preventive",
      priority: "High",
      scheduleDate: "20/05/2023",
      dueDate: "25/05/2023",
      assignedTo: "Biomedical Engineer",
      status: "Scheduled",
    },
    {
      id: "MNT-1028",
      equipment: "Anesthesia Machine",
      type: "Calibration",
      priority: "Low",
      scheduleDate: "22/05/2023",
      dueDate: "22/05/2023",
      assignedTo: "Technician Roy",
      status: "In Progress",
    },
    {
      id: "MNT-1029",
      equipment: "Surgical Lights",
      type: "Corrective",
      priority: "Medium",
      scheduleDate: "25/05/2023",
      dueDate: "27/05/2023",
      assignedTo: "Technician Sharma",
      status: "Scheduled",
    },
    {
      id: "MNT-1030",
      equipment: "X-Ray Machine",
      type: "Preventive",
      priority: "High",
      scheduleDate: "28/05/2023",
      dueDate: "28/05/2023",
      assignedTo: "Biomedical Engineer",
      status: "Overdue",
    },
    {
      id: "MNT-1031",
      equipment: "CT Scanner",
      type: "Calibration",
      priority: "Low",
      scheduleDate: "30/05/2023",
      dueDate: "30/05/2023",
      assignedTo: "Technician Mehta",
      status: "Completed",
    },
    {
      id: "MNT-1032",
      equipment: "MRI Machine",
      type: "Preventive",
      priority: "High",
      scheduleDate: "01/06/2023",
      dueDate: "05/06/2023",
      assignedTo: "Biomedical Engineer",
      status: "Scheduled",
    },
  ];

  const headers = [
    "Maintenance ID",
    "Equipment",
    "Type",
    "Priority",
    "Schedule Date",
    "Due Date",
    "Assigned To",
    "Status",
    "Actions",
  ];

  const getFilteredData = () => {
    if (activeTab === "all") {
      return maintenanceData;
    }
    return maintenanceData.filter(
      (item) => item.type.toLowerCase() === activeTab
    );
  };

  const formatDataForTable = (data) => {
    return data.map((item) => [
      item.id,
      item.equipment,
      item.type,
      <span
        className={
          item.priority === "High"
            ? "text-red-600"
            : item.priority === "Medium"
            ? "text-yellow-600"
            : "text-blue-600"
        }
      >
        {item.priority}
      </span>,
      item.scheduleDate,
      item.dueDate,
      item.assignedTo,
      <span
        className={
          item.status === "Overdue"
            ? "text-red-600 font-medium"
            : item.status === "In Progress"
            ? "text-yellow-600 font-medium"
            : item.status === "Scheduled"
            ? "text-blue-600 font-medium"
            : "text-green-600 font-medium"
        }
      >
        {item.status}
      </span>,
      <div className="flex justify-center gap-2">
        {/* View button */}
        <Button
          type="button"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => console.log("View", item.id)}
        >
          <Eye size={16} />
        </Button>

        {/* Mark Completed button */}
        {item.status !== "Completed" && (
          <Button
            type="button"
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => console.log("Mark Completed", item.id)}
          >
            <CheckCircle size={16} />
          </Button>
        )}
      </div>,
    ]);
  };

  // Get the data to display for the current page
  const filteredData = getFilteredData();
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const tableData = formatDataForTable(paginatedData);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const TabButton = ({ name, label }) => (
    <button
      className={`py-2 px-4 rounded-t-lg transition-colors duration-200 ${
        activeTab === name
          ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
          : "text-gray-600 hover:text-gray-800"
      }`}
      onClick={() => {
        setActiveTab(name);
        setCurrentPage(1); // Reset to the first page when changing tabs
      }}
    >
      {label}
    </button>
  );

  // Upcoming maintenance data (scheduled or in progress)
  const upcomingMaintenance = maintenanceData.filter(
    (item) => item.status === "Scheduled" || item.status === "In Progress"
  );

  return (
    <Layout
      title="Maintenance Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Maintenance Management",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Overdue</option>
            <option>In Progress</option>
            <option>Scheduled</option>
            <option>Completed</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            className="hover:cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
            onClick={() => navigate("/schedule-maintenance")}
          >
            Schedule Maintenance
          </Button>
          <Button
            type="button"
            className="hover:cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            onClick={() => navigate("/Transaction/FrmMaintainanceForm")}
          >
            New Request
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex border-b border-gray-200 mb-4">
          <TabButton name="all" label="All Maintenance" />
          <TabButton name="preventive" label="Preventive" />
          <TabButton name="corrective" label="Corrective" />
          <TabButton name="calibration" label="Calibration" />
        </div>
        <Table
          headerlabel="Maintenance Management"
          headers={headers}
          data={tableData}
        />
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, filteredData.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredData.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <Button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        <div className="lg:col-span-2">
          <SimpleCalendar />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <MaintenanceOverview data={maintenanceData} />
          <UpcomingMaintenanceList data={upcomingMaintenance} />
        </div>
      </div>
    </Layout>
  );
};

export default FrmMaintananceManage;
