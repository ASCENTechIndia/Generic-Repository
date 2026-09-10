import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Label from "../../../Components/Label";
import InputField from "../../../Components/InputField";
import TextArea from "../../../Components/TextArea";
import Button from "../../../Components/Button";
import Layout from "../../../Components/Layout";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const FrmCreateAlert = () => {
  const navigate = useNavigate();

  return (
    <Layout
      title="Create Custom Alert"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Create Custom Alert",
      }}
    >
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Custom Alert</h2>
          <button
            onClick={() => navigate("/Alerts")}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <Formik
          initialValues={{
            alertTitle: "",
            alertType: "",
            priority: "",
            targetAudience: "",
            description: "",
            triggerConditions: "e.g., Stock level < 50",
            startDate: "",
            endDate: "",
            activateImmediately: false,
          }}
          onSubmit={(values) => {
            console.log("Alert Submitted:", values);
          }}
        >
          {() => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Alert Title */}
              <div>
                <Label text="Alert Title" required />
                <Field
                  name="alertTitle"
                  component={InputField}
                  type="text"
                  placeholder="Enter alert title"
                />
                <ErrorMessage
                  name="alertTitle"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Alert Type */}
              <div>
                <Label text="Alert Type" required />
                <Field
                  name="alertType"
                  as="select"
                  className="w-full pr-8 pl-2 py-[5px] border border-gray-300 rounded text-sm h-9 box-border bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Type</option>
                  <option value="stock">Stock</option>
                  <option value="expiry">Expiry</option>
                  <option value="maintenance">Maintenance</option>
                </Field>
                <ErrorMessage
                  name="alertType"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Priority */}
              <div>
                <Label text="Priority" required />
                <Field
                  name="priority"
                  as="select"
                  className="w-full pr-8 pl-2 py-[5px] border border-gray-300 rounded text-sm h-9 box-border bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Priority</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Field>
                <ErrorMessage
                  name="priority"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Target Audience */}
              <div>
                <Label text="Target Audience" required />
                <Field
                  name="targetAudience"
                  as="select"
                  className="w-full pr-8 pl-2 py-[5px] border border-gray-300 rounded text-sm h-9 box-border bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Audience</option>
                  <option value="all">All Users</option>
                  <option value="admins">Admins</option>
                  <option value="pharmacists">Pharmacists</option>
                </Field>
                <ErrorMessage
                  name="targetAudience"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Description (full width) */}
              <div className="md:col-span-2">
                <Label text="Description" required />
                <Field
                  name="description"
                  component={TextArea}
                  placeholder="Enter description"
                  rows={3}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Trigger Conditions (full width) */}
              <div className="md:col-span-2">
                <Label text="Trigger Conditions" required />
                <Field
                  name="triggerConditions"
                  component={TextArea}
                  placeholder="e.g., Stock level < 50"
                  rows={2}
                />
                <ErrorMessage
                  name="triggerConditions"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Start Date */}
              <div>
                <Label text="Start Date" required />
                <Field
                  type="calendar"
                  name="startDate"
                  component={InputField}
                  className="bg-white"
                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* End Date */}
              <div>
                <Label text="End Date" />
                <Field
                  type="calendar"
                  name="endDate"
                  component={InputField}
                  className="bg-white"
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Activate Immediately Checkbox (full width) */}
              <div className="md:col-span-2 flex items-center gap-2">
                <Field type="checkbox" name="activateImmediately" />
                <Label text="Activate alert immediately" />
              </div>

              {/* Buttons (full width) */}
              <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                <Button
                  type="reset"
                  className="bg-gray-400 hover:bg-gray-500 text-white"
                  onClick={() => navigate("/Transaction/FrmAlerts")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Alert
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmCreateAlert;
