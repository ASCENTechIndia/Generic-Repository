import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import InputField from "../../../Components/InputField";
import Button from "../../../Components/Button";
import TextArea from "../../../Components/TextArea";
import Table from "../../../Components/Table";
import { useNavigate } from "react-router-dom";

const FrmNewIssue = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Dummy patient/department data
  const dummyData = [
    ["P001", "John Doe", "Patient"],
    ["P002", "Jane Smith", "Patient"],
    ["D001", "Cardiology", "Department"],
    ["D002", "Orthopedics", "Department"],
  ];

  return (
    <Layout
      title="New Issue / Dispense"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "New Issue",
      }}
    >
      <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Issue</h2>

        <Formik
          initialValues={{
            issueNo: "",
            item: "",
            issuedTo: "",
            quantity: "",
            remarks: "",
          }}
          onSubmit={(values) => {
            console.log("New Issue:", values);
            alert("Issue Created Successfully!");
            navigate("/Transaction/FrmIssueDispense");
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Issue No */}
              <div>
                <Label text="Issue No." />
                <Field
                  name="issueNo"
                  placeholder="Auto-generated / Enter"
                  component={InputField}
                />
                <ErrorMessage
                  name="issueNo"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Item */}
              <div>
                <Label text="Item" />
                <Field
                  name="item"
                  placeholder="Enter item name"
                  component={InputField}
                />
                <ErrorMessage
                  name="item"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Issued To with Modal */}
              <div className="md:col-span-2">
                <Label text="Issued To" />
                <div className="flex gap-2">
                  <Field
                    name="issuedTo"
                    placeholder="Select patient/department"
                    component={InputField}
                    readOnly
                  />
                  <Button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white h-10"
                  >
                    Select
                  </Button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <Label text="Quantity" />
                <Field
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  component={InputField}
                />
                <ErrorMessage
                  name="quantity"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Remarks */}
              <div className="md:col-span-2">
                <Label text="Remarks" />
                <Field
  name="remarks"
  component={TextArea}
  placeholder="Enter remarks if any"
  rows={3}
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
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Issue
                </Button>
              </div>

              {/* Selection Modal */}
              {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-3xl">
                    <h3 className="text-lg font-semibold mb-4">
                      Select Patient / Department
                    </h3>
                    <Table
                      headers={["Code", "Name", "Type", "Actions"]}
                      data={dummyData.map((row) => [
                        row[0],
                        row[1],
                        row[2],
                        <Button
                          key={row[0]}
                          type="button"
                          className="bg-blue-500 text-white"
                          onClick={() => {
                            setFieldValue("issuedTo", row[1] + " (" + row[2] + ")");
                            setShowModal(false);
                          }}
                        >
                          Select
                        </Button>,
                      ])}
                      headerlabel="Available Records"
                    />
                    <div className="flex justify-end mt-4">
                      <Button
                        type="button"
                        className="bg-gray-400 hover:bg-gray-500 text-white"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmNewIssue;
