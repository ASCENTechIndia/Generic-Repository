import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import InputField from "../../../Components/InputField";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import { formatDateYYYYMMDD, formatDateMonth } from "../../../utils/dateUtils";
import Table from "../../../Components/Table";
import * as XLSX from "xlsx";
import { pdf } from "@react-pdf/renderer";
import RptItemPDF from "../../../Components/PDFButton/RptItemPDF";
import { Download } from "lucide-react";

// 🔹 helper to convert image URL to base64
const urlToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const RptItem = () => {
  const { user } = useAuth();
  const ulbId = user?.ulbId;
  const { setLoading } = useLoader();

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState("");
  const [logoUrl, setLogoUrl] = useState(null);
  const [ulbName, setUlbName] = useState("");

  const initialValues = {
    startDate: new Date(),
    endDate: new Date(),
    categoryType: "",
    deptId: "",
  };

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const payload = { ulbId: ulbId };

      const res = await apiService.post("GetCategoryActiveList", payload);

      if (res?.data?.length > 0) {
        const options = res.data.map((item) => ({
          value: String(item.CATEGORY_ID),
          label: item.CATEGORY_NAME,
        }));

        setCategoryOptions(options);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Fetch department list
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const res = await apiService.post("GetDeptList", { in_ulbId: ulbId });
        setDepartments(res?.data || []);
      } catch (err) {
        console.error("Error fetching departments", err);
      } finally {
        setLoading(false);
      }
    };

    if (ulbId) {
      fetchDepartments();
      fetchCategory();
    }
  }, [ulbId, setLoading]);

  // 🔹 Fetch ULB Logo + Name
  useEffect(() => {
    const fetchLogoAndName = async () => {
      try {
        setLoading(true);
        const logoRes = await apiService.post(`textlogo`, { ulbId: ulbId });
        if (logoRes.data?.success) {
          const { ULBLOGO, ABC_MUNICIPAL_TEXT } = logoRes.data.data;

          // convert logo url to base64
          const base64Logo = await urlToBase64(ULBLOGO);

          setLogoUrl(base64Logo);
          setUlbName(ABC_MUNICIPAL_TEXT + " ");
        }
      } catch (error) {
        console.error("Error fetching ULB logo/name:", error);
      } finally {
        setLoading(false);
      }
    };

    if (ulbId) fetchLogoAndName();
  }, [ulbId, setLoading]);

  // 🔹 Handle Submit → Fetch Report
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        startDate: formatDateYYYYMMDD(values.startDate),
        endDate: formatDateYYYYMMDD(values.endDate), //yyyy-MM-DD
        ulbId: ulbId,
        categoryId: Number(values.categoryType) || null,
        deptId: values.deptId || null,
      };

      console.log(payload);
      // return;
      const res = await apiService.post("getUtilizationReport", payload);
      if (res?.data?.length <= 0) {
        alert("No data found");
      }
      setReportData(res?.data || []);

      // store readable date range for PDF
      setDateRange(
        `${formatDateMonth(values.startDate)} to ${formatDateMonth(
          values.endDate
        )}`
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "UtilizationReport.xlsx");
  };

  const exportPDF = async () => {
    const blob = await pdf(
      <RptItemPDF
        reportData={reportData}
        ulbName={ulbName}
        logoUrl={logoUrl}
        dateRange={dateRange}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "UtilizationReport.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout
      title="Item Report"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Item Report",
      }}
    >
      {/* 🔹 Filter Form */}
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {() => (
          <Form className="bg-white p-6 rounded-md shadow report">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Entity Type */}
              <div>
                <Label
                  text="Category Type (Optional)"
                  className="font-semibold text-gray-700"
                />
                <Field
                  name="categoryType"
                  component={InputField}
                  type="dropdown"
                  options={categoryOptions}
                />
              </div>

              {/* Department */}
              {/* <div>
                <Label
                  text="Department (Optional)"
                  className="font-semibold text-gray-700"
                />
                <Field
                  name="deptId"
                  component={InputField}
                  type="dropdown"
                  options={departments.map((dept) => ({
                    value: dept.NUM_DEPT_ID,
                    label: dept.VAR_DEPT_NAME,
                  }))}
                />
              </div> */}

              {/* From Date */}
              <div>
                <Label
                  text="From Date"
                  required
                  className="font-semibold text-gray-700"
                />
                <Field
                  type="calendar"
                  name="startDate"
                  component={InputField}
                />
              </div>

              {/* To Date */}
              <div>
                <Label
                  text="To Date"
                  required
                  className="font-semibold text-gray-700"
                />
                <Field type="calendar" name="endDate" component={InputField} />
              </div>
            </div>

            <div className="flex justify-center mt-2 gap-3">
              <Button type="submit" className="hover:cursor-pointer">
                Get Report
              </Button>
              {reportData.length > 0 && <></>}
            </div>
          </Form>
        )}
      </Formik>

      {reportData.length > 0 && (
        <div className="bg-white p-5 rounded-md mt-5">
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={exportExcel}
              className="bg-green-600 text-white flex items-center gap-2 hover:cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </Button>
            <Button
              type="button"
              onClick={exportPDF}
              className=" text-white flex items-center gap-2 hover:cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export to PDF
            </Button>
          </div>
          {/* 🔹 Table Display */}

          <Table
            headerlabel="Item Report"
            headers={[
              "Item Name",
              // "Department",
              "Category Type",
              "Times Used",
              "Qty Used",
            ]}
            data={reportData.map((r) => [
              r.ITEM_NAME,
              // r.DEPT_NAME,
              r.CATEGORY_NAME,
              r.TIMES_USED,
              r.QTY_USED,
            ])}
          />
        </div>
      )}
    </Layout>
  );
};

export default RptItem;
