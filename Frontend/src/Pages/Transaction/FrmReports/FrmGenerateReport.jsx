import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Label from "../../../Components/Label";
import InputField from "../../../Components/InputField";
import TextArea from "../../../Components/TextArea";
import Button from "../../../Components/Button";
import Layout from "../../../Components/Layout";
import { useNavigate } from "react-router-dom";

const FrmGenerateReport = () => {
  const navigate = useNavigate();

  return (
    <Layout
      title="Generate Report"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Generate Report",
      }}
    >
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Generate New Report</h2>

        <Formik
          initialValues={{
            reportType: "",
            outputFormat: "",
            timePeriod: "",
            facility: "",
            reportParams: "",
            emailReport: true,
            email: "admin@medinventory.com",
          }}
        >
          {() => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Report Type */}
              <div>
                <Label text="Report Type" required />
                <Field
                  name="reportType"
                  component={InputField}
                  type="dropdown"
                  placeholder="Select Report Type"
                >
                  <option value="">Select Report Type</option>
                  <option value="stock">Stock Report</option>
                  <option value="expiry">Expiry Report</option>
                  <option value="maintenance">Maintenance Report</option>
                </Field>
                <ErrorMessage
                  name="reportType"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Output Format */}
              <div>
                <Label text="Output Format" required />
                <Field
                  name="outputFormat"
                  component={InputField}
                  type="dropdown"
                  placeholder="Select Format"
                >
                  <option value="">Select Format</option>
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </Field>
                <ErrorMessage
                  name="outputFormat"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Time Period */}
              <div>
                <Label text="Time Period" required />
                <Field
                  name="timePeriod"
                  component={InputField}
                  type="dropdown"
                  placeholder="Select Period"
                >
                  <option value="">Select Period</option>
                  <option value="today">Today</option>
                  <option value="weekly">Last 7 Days</option>
                  <option value="monthly">Last 30 Days</option>
                </Field>
                <ErrorMessage
                  name="timePeriod"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Facility */}
              <div>
                <Label text="Facility" required />
                <Field
                  name="facility"
                  component={InputField}
                  type="dropdown"
                  placeholder="Select Facility"
                >
                  <option value="">Select Facility</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="icu">ICU</option>
                  <option value="general">General Store</option>
                </Field>
                <ErrorMessage
                  name="facility"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Report Parameters (full width) */}
              <div className="md:col-span-2">
                <Label text="Report Parameters" />
                <Field
                  name="reportParams"
                  component={TextArea}
                  placeholder="Additional parameters or filters for the report..."
                  rows={3}
                />
              </div>

              {/* Email Report Checkbox */}
              <div className="md:col-span-2 flex items-center gap-2">
                <Field type="checkbox" name="emailReport" />
                <Label text="Email report when complete" />
              </div>

              {/* Email Address */}
              <div className="md:col-span-2">
                <Label text="Email Address" required />
                <Field
                  component={InputField}
                  type="text"
                  name="email"
                  placeholder="Enter email address"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                <Button
                  type="reset"
                  className="bg-gray-400 hover:bg-gray-500 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Generate Report
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmGenerateReport;
