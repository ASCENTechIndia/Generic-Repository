// import React, { useState } from "react";
// import Layout from "../../../Components/Layout";
// import Button from "../../../Components/Button";

// const FrmReports = () => {
//   const [activeTab, setActiveTab] = useState("all");
//   const [search, setSearch] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [timeFilter, setTimeFilter] = useState("all");

//   const tabs = ["all", "saved", "scheduled"];

//   // Sample Data
//   const reports = [
//     {
//       icon: "📦",
//       title: "Inventory Summary Report",
//       description:
//         "Comprehensive overview of inventory levels, stock values, and turnover rates.",
//       downloads: 142,
//       views: 258,
//       lastRun: "Today",
//     },
//     {
//       icon: "💰",
//       title: "Financial Summary Report",
//       description: "Revenue, expenses, and profitability analysis.",
//       downloads: 87,
//       views: 134,
//       lastRun: "Yesterday",
//     },
//     {
//       icon: "📊",
//       title: "Usage Analytics Report",
//       description:
//         "Medication and equipment usage patterns by department and time period.",
//       downloads: 76,
//       views: 112,
//       lastRun: "2 days ago",
//     },
//     {
//       icon: "✅",
//       title: "Compliance Report",
//       description: "Regulatory compliance status and audit readiness assessment.",
//       downloads: 53,
//       views: 89,
//       lastRun: "3 days ago",
//     },
//     {
//       icon: "📈",
//       title: "Performance Metrics",
//       description: "Key performance indicators and operational efficiency metrics.",
//       downloads: 94,
//       views: 156,
//       lastRun: "4 days ago",
//     },
//     {
//       icon: "⚠️",
//       title: "Expiry Alert Report",
//       description: "Items nearing expiration date and recommended actions.",
//       downloads: 68,
//       views: 102,
//       lastRun: "5 days ago",
//     },
//   ];

//   // Filtering logic
//   const filteredReports = reports.filter((report) =>
//     report.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Layout
//       title="Reports & Analytics"
//       breadcrumb={{
//         homeLink: "/dashboard",
//         homeText: "Home",
//         current: "Reports & Analytics",
//       }}
//     >
//       <div className="space-y-6">
//         {/* Tabs + Actions */}
//         <div className="flex items-center justify-between">
//           <div className="flex gap-6 border-b">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`pb-2 capitalize transition-colors ${
//                   activeTab === tab
//                     ? "border-b-2 border-blue-600 text-blue-600 font-medium"
//                     : "text-gray-600 hover:text-blue-500"
//                 }`}
//               >
//                 {tab === "all" && "All Reports"}
//                 {tab === "saved" && "Saved Reports"}
//                 {tab === "scheduled" && "Scheduled Reports"}
//               </button>
//             ))}
//           </div>
//           <div className="flex gap-2">
//             <Button className="bg-blue-100 text-blue-700 hover:bg-blue-200">
//               Schedule Report
//             </Button>
//             <Button className="bg-blue-600 text-white hover:bg-blue-700">
//               + Generate Report
//             </Button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-3">
//           <select
//             className="p-2 border border-gray-300 rounded-md"
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//           >
//             <option value="all">All Categories</option>
//             <option value="finance">Inventory Reports</option>
//             <option value="inventory">Financial Reports</option>
//             <option value="compliance">Usage Reports</option>
//             <option value="inventory">Compliance Reports</option>
//             <option value="inventory">Performance Reports</option>
//           </select>
//           <select
//             className="p-2 border border-gray-300 rounded-md"
//             value={timeFilter}
//             onChange={(e) => setTimeFilter(e.target.value)}
//           >
//             <option value="all">All Time</option>
//             <option value="today">Today</option>
//             <option value="week">This Week</option>
//             <option value="month">This Month</option>
//             <option value="month">This Quarter</option>
//             <option value="month">This Year</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Search reports..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border rounded px-2 py-1 flex-1"
//           />
//         </div>

//         {/* Report Cards */}
//         {activeTab === "all" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredReports.map((report, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between
//                            transform transition-all hover:scale-105 hover:shadow-2xl"
//               >
//                 <div className="flex justify-center text-4xl text-blue-600 mb-3">
//                   {report.icon}
//                 </div>
//                 <h3 className="text-lg font-semibold text-center mb-2">
//                   {report.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 text-center mb-4">
//                   {report.description}
//                 </p>
//                 <div className="flex justify-center gap-4 mb-3">
//                   <span className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded-md text-sm">
//                     ⬇️ {report.downloads}
//                   </span>
//                   <span className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded-md text-sm">
//                     👁️ {report.views}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500 text-center">
//                   Last run: {report.lastRun}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Saved Reports Message */}
//         {activeTab === "saved" && (
//           <div className="bg-white p-4 rounded shadow-sm text-center text-gray-500 py-10">
//             Your saved reports would be displayed here.
//           </div>
//         )}

//         {/* Scheduled Reports Message */}
//         {activeTab === "scheduled" && (
//           <div className="bg-white p-4 rounded shadow-sm text-center text-gray-500 py-10">
//             Your scheduled reports would be displayed here.
//           </div>
//         )}

//         {/* Pagination (only for All tab) */}
//         {activeTab === "all" && (
//           <div className="flex justify-center items-center gap-3 mt-6">
//             <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
//               Previous
//             </button>
//             <button className="px-3 py-1 border rounded-lg bg-blue-600 text-white">
//               1
//             </button>
//             <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
//               2
//             </button>
//             <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
//               3
//             </button>
//             <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default FrmReports;

import React, { useState } from "react";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import { useNavigate } from "react-router-dom";

const FrmReports = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const tabs = ["all", "saved", "scheduled"];

  // Sample Data
  const reports = [
    {
      icon: "📦",
      title: "Inventory Summary Report",
      description:
        "Comprehensive overview of inventory levels, stock values, and turnover rates.",
      downloads: 142,
      views: 258,
      lastRun: "Today",
    },
    {
      icon: "💰",
      title: "Financial Summary Report",
      description: "Revenue, expenses, and profitability analysis.",
      downloads: 87,
      views: 134,
      lastRun: "Yesterday",
    },
    {
      icon: "📊",
      title: "Usage Analytics Report",
      description:
        "Medication and equipment usage patterns by department and time period.",
      downloads: 76,
      views: 112,
      lastRun: "2 days ago",
    },
    {
      icon: "✅",
      title: "Compliance Report",
      description:
        "Regulatory compliance status and audit readiness assessment.",
      downloads: 53,
      views: 89,
      lastRun: "3 days ago",
    },
    {
      icon: "📈",
      title: "Performance Metrics",
      description:
        "Key performance indicators and operational efficiency metrics.",
      downloads: 94,
      views: 156,
      lastRun: "4 days ago",
    },
    {
      icon: "⚠️",
      title: "Expiry Alert Report",
      description: "Items nearing expiration date and recommended actions.",
      downloads: 68,
      views: 102,
      lastRun: "5 days ago",
    },
  ];

  // Filtering logic
  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout
      title="Reports & Analytics"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Reports & Analytics",
      }}
    >
      <div className="space-y-6">
        {/* Filters + Buttons */}
        <div className="flex gap-3 items-center">
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="finance">Inventory Reports</option>
            <option value="inventory">Financial Reports</option>
            <option value="compliance">Usage Reports</option>
            <option value="compliance">Compliance Reports</option>
            <option value="performance">Performance Reports</option>
          </select>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 w-64"
          />

          {/* 👇 Buttons moved here */}
          <div className="flex gap-2 ml-auto">
            <Button className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              Schedule Report
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => navigate("/Transaction/FrmGenerateReport")}
            >
              + Generate Report
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {tab === "all" && "All Reports"}
              {tab === "saved" && "Saved Reports"}
              {tab === "scheduled" && "Scheduled Reports"}
            </button>
          ))}
        </div>

        {/* Report Cards */}
        {activeTab === "all" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between 
                           transform transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex justify-center text-4xl text-blue-600 mb-3">
                  {report.icon}
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  {report.description}
                </p>
                <div className="flex justify-center gap-4 mb-3">
                  <span className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded-md text-sm">
                    ⬇️ {report.downloads}
                  </span>
                  <span className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded-md text-sm">
                    👁️ {report.views}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Last run: {report.lastRun}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Saved Reports Message */}
        {activeTab === "saved" && (
          <div className="bg-white p-4 rounded shadow-sm text-center text-gray-500 py-10">
            Your saved reports would be displayed here.
          </div>
        )}

        {/* Scheduled Reports Message */}
        {activeTab === "scheduled" && (
          <div className="bg-white p-4 rounded shadow-sm text-center text-gray-500 py-10">
            Your scheduled reports would be displayed here.
          </div>
        )}

        {/* Pagination (only for All tab) */}
        {activeTab === "all" && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1 border rounded-lg bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
              3
            </button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FrmReports;
