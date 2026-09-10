import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../../Components/Layout";
import HeaderLabel from "../../../Components/HeaderLabel";
import InputField from "../../../Components/InputField";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import { Download } from "lucide-react";
import { Formik, Form, Field } from "formik";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PurchaseOrderPdf from "../../../Components/PDFButton/PurchaseOrderPdf";
import * as XLSX from "xlsx";
import Label from "../../../Components/Label";
import axios from "axios";
import "./style.css";
import { formatDatebyMonth, formatDateMonth } from "../../../utils/dateUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ExcelButton = ({ data, headers, fileName }) => {
  const exportToExcel = () => {
    const exportData = data.map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] =
          typeof row[index] === "string"
            ? row[index]
            : row[index].props?.children
                ?.map?.((p) => p.props?.children)
                .join(", ");
      });
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <Button
      type="button"
      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 hover:cursor-pointer"
      onClick={exportToExcel}
    >
      <Download className="w-4 h-4" /> Export to Excel
    </Button>
  );
};

const parsePOItems = (poItemsString) => {
  if (!poItemsString) return [];
  const items = poItemsString.split(" | ");
  return items.map((item) => {
    const match = item.match(/(.+) \((.+)\) - Qty: (\d+)/);
    if (match) {
      return {
        itemName: match[1].trim(),
        category: match[2].trim(),
        quantity: parseInt(match[3], 10),
      };
    }
    return { itemName: item.trim(), category: "-", quantity: 0 };
  });
};

function formatDateToYYYYMMDD(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("Invalid date object");
  }

  return date.toISOString().split("T")[0];
}

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const FrmReportsByDate = () => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const ulbId = user?.ulbId;

  const [approvedData, setApprovedData] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [initialDates, setInitialDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [logoUrl, setLogoUrl] = useState(null);
  const [ulbName, setUlbName] = useState("");

  const [pdfDates, setPdfDates] = useState({ startDate: "", endDate: "" });

  const headers = [
    "Purchase Order Number",
    "PO Date",
    "Approved By",
    "Purchase Order Items",
  ];

  const fetchLogoAndUlbName = useCallback(async () => {
    if (!ulbId) return;
    try {
      setLoading(true);
      const response = await  apiService.post(`textlogo`,{ulbId:ulbId});
      if (response.data?.success) {
        const { ULBLOGO, ABC_MUNICIPAL_TEXT } = response.data.data;
        setLogoUrl(ULBLOGO);
        setUlbName(ABC_MUNICIPAL_TEXT + " ");
      }
    } catch (error) {
      console.error("Error fetching logo and text:", error);
    } finally {
      setLoading(false);
    }
  }, [ulbId]);

  const fetchApprovedData = async (startDate, endDate) => {
    try {
      setLoading(true);
      const payload = {};
      if (startDate) payload.start_date = formatDateToYYYYMMDD(startDate);
      if (endDate) payload.end_date = formatDateToYYYYMMDD(endDate);
      const response = await axios.post(
        `${API_BASE_URL}/PoOrderReport`,
        payload
      );

      if (response?.data?.data) {
        const formattedTableData = response.data.data.map((row) => [
          row["Purchase Order Number"],
          formatDate(row["PO Date"]),
          row["Approved By"],
          <div className="flex flex-col gap-1">
            {parsePOItems(row["Purchase Order Items"]).map((item, idx) => (
              <div key={idx}>
                {item.itemName} ({item.category}) - Qty: {item.quantity}
              </div>
            ))}
          </div>,
        ]);
        setApprovedData(formattedTableData);

        const formattedPdfData = response.data.data.map((row) => [
          row["Purchase Order Number"],
          formatDate(row["PO Date"]),
          row["Approved By"],
          parsePOItems(row["Purchase Order Items"])
            .map(
              (item) =>
                `${item.itemName} (${item.category}) - Qty: ${item.quantity}`
            )
            .join("\n"),
        ]);
        setPdfData(formattedPdfData);
      }
    } catch (error) {
      console.error("Error fetching approved data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    setInitialDates({ startDate: today, endDate: today });
    setPdfDates({ startDate: today, endDate: today });
  }, []);

  useEffect(() => {
    fetchLogoAndUlbName();
  }, [fetchLogoAndUlbName]);

  return (
    <Layout
      title="Purchase Order Report"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Purchase Order Report",
      }}
    >
      <Formik
        initialValues={initialDates}
        enableReinitialize
        onSubmit={(values) => {
          fetchApprovedData(values.startDate, values.endDate);
          setPdfDates({ startDate: values.startDate, endDate: values.endDate });
        }}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            {/* <div className="flex justify-between items-center mb-6">
              <HeaderLabel text="Approved Records" size="text-xl" />
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-6 rounded-md report-by-date">
              <div className="flex flex-col">
                <Label text="Start Date" required />
                <Field
                  component={InputField}
                  type="calendar"
                  name="startDate"
                  value={values.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className="flex flex-col">
                <Label text="End Date" required />
                <Field
                  component={InputField}
                  type="calendar"
                  name="endDate"
                  value={values.endDate}
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

            {approvedData.length > 0 && (
              <div className="bg-white p-6 rounded-md">
                <div className="flex justify-end gap-2">
                  <ExcelButton
                    data={approvedData}
                    headers={headers}
                    fileName="Approved_Report"
                  />
                  <PDFDownloadLink
                    document={
                      <PurchaseOrderPdf
                        tableData={pdfData}
                        tableHeader={headers}
                        fileName="Approved_Report"
                        title="Approved Data Report"
                        logoUrl={logoUrl}
                        ulbName={ulbName}
                        startDate={pdfDates.startDate}
                        endDate={pdfDates.endDate}
                      />
                    }
                    fileName={`Approved_Purchase_Order_Report.pdf`}
                  >
                    {() => (
                      <Button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 hover:cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Export to PDF
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>

                <Table
                  headerlabel="Approved List"
                  headers={headers}
                  data={approvedData}
                  rowsPerPage={5}
                />
              </div>
            )}
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default FrmReportsByDate;
