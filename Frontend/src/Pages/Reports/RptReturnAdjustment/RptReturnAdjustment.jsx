import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Layout from "../../../Components/Layout";
import Table from "../../../Components/Table";
import Button from "../../../Components/Button";
import Pdf from "../../../Components/PDF/Pdf";
import Excel from "../../../Components/Excel/Excel";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { formatDate, formatDateMonth } from "../../../utils/dateUtils";
import { useLoader } from "../../../Context/LoaderContext";
import Label from "../../../Components/Label";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import InputField from "../../../Components/InputField";

const RptReturnAdjustment = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [tableData, setTableData] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [ulbName, setUlbName] = useState("");
  const [tableHeader, setTableHeader] = useState([
    "Adjustment Date",
    "Department Name",
    "Item Name",
    "Quantity",
    "Reason",
    "Remark",
    "Type",
  ]);
  const [initialValues, setInitialValues] = useState({
    type: "",
    from: new Date(),
    to: new Date(),
  });
  const urlToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };
  useEffect(() => {
    const fetchLogoAndName = async () => {
      try {
        setLoading(true);
        const logoRes = await  apiService.post(`textlogo`,{ulbId:ulbid});
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

    if (ulbid) fetchLogoAndName();
  }, [ulbid, setLoading]);

  const handleSubmit = async (values) => {
    if (!ulbid) return;
    try {
      setLoading(true);
      const payload = {
        ulbId: ulbid,
        startDate: formatDateMonth(values.from),
        endDate: formatDateMonth(values.to),
        Type: values.type || "",
      };

      const res = await apiService.post("getReturnAdjReport", payload);
      if (res?.data?.length > 0) {
        const data = res.data.map((data) => {
          return [
            formatDate(data.DAT_RETURNADJUSTMENT_ADJDATE),
            data.VAR_DEPT_NAME,
            data.VAR_ISSUEITEM_NAME,
            data.NUM_RETURNADJUSTMENT_QUANTITY,
            data.VAR_RETURNADJUSTMENT_REASON,
            data.VAR_RETURNADJUSTMENT_REMARKS,
            data.VAR_RETURNADJUSTMENT_TYPE,
          ];
        });
        setTableData(data);
      } else {
        alert("No Data Found");
        setTableData([]);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Report Adjustment"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Report Adjustment",
      }}
    >
      <Formik
        initialValues={initialValues}
        // validationSchema={ValidationSchemas().RptReturnAdjustment}
        onSubmit={handleSubmit}
      >
        {() => {
          return (
            <Form className="bg-white p-6 rounded-md shadow report">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label
                    text="Enter Return Type"
                    className="font-semibold text-gray-700"
                  />
                  <Field
                    name="type"
                    placeholder="Enter Return Type"
                    component={InputField}
                    type="dropdown"
                    options={[
                      { value: "Damage Stocks", label: "Damage Stocks" },
                      { value: "Extra Stocks", label: "Extra Stocks" },
                      { value: "Expired Stocks", label: "Expired Stocks" },
                    ]}
                  />
                  {/* <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-500 text-sm"
                  /> */}
                </div>
                <div>
                  <Label
                    text="From Date"
                    className="font-semibold text-gray-700"
                    required
                  />
                  <Field
                    type="calendar"
                    name="from"
                    component={InputField}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label
                    text="To Date"
                    required
                    className="font-semibold text-gray-700"
                  />
                  <Field type="calendar" name="to" component={InputField} />
                </div>
              </div>
              <div className="flex justify-center">
                <Button type="submit" className="hover:cursor-pointer">
                  Get Report
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {tableData.length > 0 && (
        <div className="p-6 bg-white rounded-md mt-6">
          <div className="flex justify-end gap-3">
            <Excel
              tableHeader={tableHeader}
              tableData={tableData}
              fileName="ReturnAdjustmentReport.xlsx"
            />
            <Pdf
              tableHeader={tableHeader}
              tableData={tableData}
              ulbName={ulbName}
              logoUrl={logoUrl}
              fileName="ReturnAdjustmentReport.pdf"
            />
          </div>
          <div>
            <Table headers={tableHeader} data={tableData} />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default RptReturnAdjustment;
