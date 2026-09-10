import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import Label from "../../../Components/Label";
import InputField from "../../../Components/InputField";
import Button from "../../../Components/Button";
import TextArea from "../../../Components/TextArea";
import { useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";

const FrmMaintenanceForm = () => {
  const navigate = useNavigate();

  return (
    <Layout
      title="Maintenance"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Maintenance",
      }}
    >
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Create New Maintenance Request</h2>

        <Formik
          initialValues={{
            equipment: "",
            maintenanceType: "",
            priority: "",
            assignedTo: "",
            scheduleDate: "",
            dueDate: "",
            description: "",
            notes: "",
          }}
          validationSchema={ValidationSchemas.MaintenanceForm}
          onSubmit={(values) => {
            console.log("Form Data:", values);
            alert("Maintenance Request Created!");
            navigate("/Transaction/FrmMaintananceManage");
          }}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Equipment */}
              <div>
                <Label text="Equipment " required />
                <Field
                  component={InputField}
                  type="dropdown"
                  name="equipment"
                >
                  <option value="">Select Equipment</option>
                  <option value="xray">X-Ray Machine</option>
                  <option value="ecg">ECG Monitor</option>
                  <option value="ventilator">Ventilator</option>
                </Field>
                <ErrorMessage
                  name="equipment"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Maintenance Type */}
              <div>
                <Label text="Maintenance Type " required />
                <Field
                  component={InputField}
                  type="dropdown"
                  name="maintenanceType"
                >
                  <option value="">Select Type</option>
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                  <option value="inspection">Inspection</option>
                </Field>
                <ErrorMessage
                  name="maintenanceType"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Priority */}
              <div>
                <Label text="Priority " required />
                <Field
                  component={InputField}
                  type="dropdown"
                  name="priority"
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Field>
                <ErrorMessage
                  name="priority"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Assigned To */}
              <div>
                <Label text="Assigned To " required />
                <Field
                  component={InputField}
                  type="dropdown"
                  name="assignedTo"
                >
                  <option value="">Select Technician</option>
                  <option value="tech1">Rahul Sharma</option>
                  <option value="tech2">Anita Singh</option>
                  <option value="tech3">Vikram Patel</option>
                </Field>
                <ErrorMessage
                  name="assignedTo"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Schedule Date */}
              <div>
                <Label text="Schedule Date " required />
                <Field
                  type="calendar"
                  name="scheduleDate"
                  component={InputField}
                />
                <ErrorMessage
                  name="scheduleDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Due Date */}
              <div>
                <Label text="Due Date " required />
                <Field
                  type="calendar"
                  name="dueDate"
                  component={InputField}
                />
                <ErrorMessage
                  name="dueDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              
              {/* Description */}
              <div className="md:col-span-2">
                <Label text="Description " required />
                <Field
                  name="description"
                  placeholder="Enter description"
                  component={TextArea}
                  rows={3}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <Label text="Notes" />
                <Field
                  name="notes"
                  placeholder="Additional notes"
                  component={TextArea}
                  rows={2}
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                <Button type="reset" className="bg-gray-400 hover:bg-gray-500">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Request
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmMaintenanceForm;