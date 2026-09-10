import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import dayjs from "dayjs";

const TableComponent = () => {
  const [report, setReport] = useState([]);
  const [filter, setFilter] = useState("monthly"); // default
  const { user } = useAuth();
  const ulbId = user?.ulbId;

  // Utility function to get date range
const getDateRange = (type) => {
  const today = dayjs();
  let fromDate, toDate;

  if (type === "monthly") {
    // Whole current month
    fromDate = today.startOf("month");
    toDate = today.endOf("month");
  } else if (type === "quarterly") {
    // Past 4 months (including current month)
    fromDate = today.subtract(3, "month").startOf("month");
    toDate = today.endOf("month");
  } else if (type === "yearly") {
    // Current financial year (April -> today or March next year)
    if (today.month() >= 3) {
      // After April → April this year until today
      fromDate = dayjs().month(3).startOf("month"); // April this year
      toDate = today.endOf("month");                // Current month end
    } else {
      // Before April → last financial year (April last year → March this year)
      fromDate = dayjs().subtract(1, "year").month(3).startOf("month");
      toDate = dayjs().month(2).endOf("month");
    }
  }

  return {
    fromDate: fromDate.format("DD/MM/YYYY"),
    toDate: toDate.format("DD/MM/YYYY"),
  };
};


  // useEffect(() => {
  //   if (!ulbId) return;

  //   const { fromDate, toDate } = getDateRange(filter);

  //   apiService
  //     .post("appointmentReport", { ulbid: ulbId, fromDate, toDate })
  //     .then((res) => {
  //       if (res.data.success) {
  //         setReport(res.data.data);
  //       }
  //     })
  //     .catch((err) => console.error(err));
  // }, [ulbId, filter]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-full">
      {/* Header with dropdown on right */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Appointment Report</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="overflow-y-auto max-h-[350px] bg-white rounded-lg shadow-inner">
        <table className="w-full table-auto divide-y divide-gray-200">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Doctor</th>
              {/* <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Department</th> */}
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Scheduled</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Completed</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Missed</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {report.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Loading or No Data Available
                </td>
              </tr>
            ) : (
              <>
                {report.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{row.DOCTOR_NAME}</td>
                    {/* <td className="px-4 py-2 text-sm text-gray-700">{row.DEPARTMENT_NAME}</td> */}
                    <td className="px-4 py-2 text-sm text-gray-700">{row.TOTAL_SCHEDULED}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.TOTAL_COMPLETED}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.TOTAL_MISSED}</td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-blue-50 font-semibold">
                  <td className="px-4 py-2">Total</td>
                  {/* <td className="px-4 py-2"></td> */}
                  <td className="px-4 py-2">
                    {report.reduce((sum, row) => sum + (Number(row.TOTAL_SCHEDULED) || 0), 0)}
                  </td>
                  <td className="px-4 py-2">
                    {report.reduce((sum, row) => sum + (Number(row.TOTAL_COMPLETED) || 0), 0)}
                  </td>
                  <td className="px-4 py-2">
                    {report.reduce((sum, row) => sum + (Number(row.TOTAL_MISSED) || 0), 0)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
