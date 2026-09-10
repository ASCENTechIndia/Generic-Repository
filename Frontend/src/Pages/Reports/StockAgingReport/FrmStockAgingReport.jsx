import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Layout";
import InputField from "../../../Components/InputField";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import { Formik, Form, Field } from "formik";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import Label from "../../../Components/Label";

// ✅ Helper to format date to YYYY-MM-DD
function formatDateToYYYYMMDD(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return "";
  }
  return date.toISOString().split("T")[0];
}

const FrmStockAgingReport = () => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const ulbId = user?.ulbId;

  const [tableData, setTableData] = useState([]);

  const [initialDates, setInitialDates] = useState({
    fromDate: new Date(),
    toDate: new Date(),
  });

  // ✅ Table columns as per your requirement
  const headers = ["Material", "Store", "Qty", "Stock Value", "Aging"];

  // ✅ API function - Replace mock with actual API when ready
  const fetchStockAgingData = async (fromDate, toDate) => {
    try {
      setLoading(true);

      const payload = {
        ulbId: Number(ulbId),
        from_date: formatDateToYYYYMMDD(fromDate),
        to_date: formatDateToYYYYMMDD(toDate),
      };

      // ✅ Mock API call - Replace with actual API when ready
      // const response = await apiService.post("GetStockAgingReport", payload);

      // Dummy data for now
      const response = {
        data: {
          data: [
            {
              MATERIAL: "Laptop",
              STORE: "IT Store",
              QTY: "10",
              STOCK_VALUE: "₹500,000",
              AGING: "91-180",
            },
            {
              MATERIAL: "Paper",
              STORE: "Main Store",
              QTY: "500",
              STOCK_VALUE: "₹125,000",
              AGING: "31-60",
            },
            {
              MATERIAL: "Paracetamol 500mg",
              STORE: "Pharmacy Store",
              QTY: "1000",
              STOCK_VALUE: "₹10,000",
              AGING: "0-30",
            },
            {
              MATERIAL: "Old Furniture",
              STORE: "General Store",
              QTY: "5",
              STOCK_VALUE: "₹50,000",
              AGING: ">180",
            },
          ],
        },
      };

      if (response?.data?.data) {
        const formattedTableData = response.data.data.map((row) => [
          row.MATERIAL,
          row.STORE,
          row.QTY,
          row.STOCK_VALUE,
          row.AGING,
        ]);
        setTableData(formattedTableData);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching stock aging data:", error);
      alert("Failed to fetch stock aging data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    setInitialDates({ fromDate: today, toDate: today });
  }, []);

  return (
    <Layout
      title="Stock Aging Report"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Stock Aging Report",
      }}
    >
      <Formik
        initialValues={initialDates}
        enableReinitialize
        onSubmit={(values) => {
          fetchStockAgingData(values.fromDate, values.toDate);
        }}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            {/* ✅ Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-6 rounded-md">
              <div className="flex flex-col">
                <Label text="From Date" required />
                <Field
                  component={InputField}
                  type="calendar"
                  name="fromDate"
                  value={values.fromDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className="flex flex-col">
                <Label text="To Date" required />
                <Field
                  component={InputField}
                  type="calendar"
                  name="toDate"
                  value={values.toDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className="flex items-center">
                <Button
                  type="submit"
                  className="w-full md:w-auto mt-3 hover:cursor-pointer"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* ✅ Table Section */}
            {tableData.length > 0 && (
              <div className="bg-white p-6 rounded-md">
                <Table
                  headerlabel="Stock Aging List"
                  headers={headers}
                  data={tableData}
                  rowsPerPage={5}
                />
              </div>
            )}

            {tableData.length === 0 && (
              <div className="bg-white p-6 rounded-md text-center text-gray-500">
                No data available. Please click Search to load data.
              </div>
            )}
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default FrmStockAgingReport;
