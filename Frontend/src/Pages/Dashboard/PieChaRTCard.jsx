import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";
import dayjs from "dayjs";

const PieChaRTCard = () => {
  const { user } = useAuth();
  const ulbId = user?.ulbId;
  const [filter, setFilter] = useState("monthly");
  const [chartData, setChartData] = useState([]);
  const initialValues = {
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
  };

  const getDateRange = (type) => {
    const today = dayjs();
    let fromDate, toDate;
    if (type === "monthly") {
      fromDate = today.startOf("month");
      toDate = today.endOf("month");
    } else if (type === "quarterly") {
      fromDate = today.subtract(3, "month").startOf("month");
      toDate = today.endOf("month");
    } else if (type === "yearly") {
      if (today.month() >= 3) {
        fromDate = dayjs().month(3).startOf("month");
        toDate = today.endOf("month");
      } else {
        fromDate = dayjs().subtract(1, "year").month(3).startOf("month");
        toDate = dayjs().month(2).endOf("month");
      }
    }
    return {
      fromDate: fromDate.format("DD/MM/YYYY"),
      toDate: toDate.format("DD/MM/YYYY"),
    };
  };

  const fetchChartData = async () => {
    const { fromDate, toDate } = getDateRange(filter);
    const payload = {
      ulbid: 5,
      fromDate: fromDate,
      toDate: toDate,
      diagnosisId: null,
    };
    apiService
      .post("diagnosisDisease", payload)
      .then((res) => {
        if (res?.data?.success) {
          const colors = [
            "#1E90FF",
            "#00BFFF",
            "#076b93ff",
            "#5DADE2",
            "#48C9B0",
            "#85C1E9",
          ];
          const data = res.data.data.topDiseases.map((item, index) => {
            return {
              title: item.DISEASE,
              value: item.TOTAL_CASES,
              color: colors[index % colors.length],
            };
          });

          setChartData(data);
        }
      })
      .catch((err) => console.error(err));
  };

  // useEffect(() => {
  //   if (ulbId) {
  //     fetchChartData();
  //   }
  // }, [ulbId, filter]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Top Diagnosed Diseases</h1>
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
      <div className="mx-auto mt-3">
        {chartData && chartData.length > 0 ? (
          <PieChart
            data={chartData}
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
            animate={true}
            labelStyle={{
              fontSize: "5px",
              fontFamily: "sans-serif",
            }}
            style={{ height: "220px", width: "220px" }}
          />
        ) : (
          <p className="mt-5 font-bold">No Data available</p>
        )}
      </div>
    </div>
  );
};

export default PieChaRTCard;
