import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import Label from "../../../Components/Label";
import InputField from "../../../Components/InputField";
import Button from "../../../Components/Button";
import TextArea from "../../../Components/TextArea";
import Layout from "../../../Components/Layout";
import { useNavigate } from "react-router-dom";

const FrmStockAdjust = () => {
  const navigate = useNavigate();

  return (
    <Layout
      title="Stock Adjustment"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Stock Adjustment",
      }}
    >
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Stocks Adjustment</h2>

        <Formik
          initialValues={{
            Item: "",
            fromFacility: "",
            toFacility: "",
            Quantity: "",
            Reason: "",
            Notes: "",
          }}
          //   validationSchema={ValidationSchemas.EquipmentForm}
          onSubmit={(values) => {
            console.log("Form Data:", values);
            alert("Equipment Added Successfully!");
            navigate("/Master/FrmEquipmentList");
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item */}
              <div>
                <Label text="Item" required />
                <Field
                  name="Item"
                  placeholder="Select item"
                  component={InputField}
                  type="dropdown"
                >
                  <option value="">Select Item</option>
                  <option value="ventilator">Ventilator</option>
                  <option value="monitor">Monitor</option>
                  <option value="scanner">Scanner</option>
                </Field>
                <ErrorMessage
                  name="Item"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Adjustment Type */}
              <div>
                <Label text="Adjustment Type" required />
                <Field
                  name="AdjustmentType"
                  placeholder="Select adjustment type"
                  component={InputField}
                  type="dropdown"
                >
                  <option value="">Select Adjustment Type</option>
                  <option value="increase">Increase</option>
                  <option value="decrease">Decrease</option>
                  <option value="damage">Damage</option>
                </Field>
                <ErrorMessage
                  name="AdjustmentType"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Quantity */}
              <div>
                <Label text="Quantity" required />
                <Field
                  component={InputField}
                  type="text"
                  name="Quantity"
                  placeholder="Enter quantity"
                  className="w-full border rounded px-3 py-2"
                />
                <ErrorMessage
                  name="Quantity"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Reason */}
              <div>
                <Label text="Reason" required />
                <Field
                  name="Reason"
                  type="text"
                  component={InputField}
                  placeholder="Enter reason"
                />
                <ErrorMessage
                  name="Reason"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <Label text="Notes" />
                <Field
                  name="notes"
                  component={TextArea}
                  placeholder="Enter notes"
                  rows={3}
                />
                <ErrorMessage
                  name="notes"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  onClick={() => navigate("/Transaction/FrmInventManage")}
                  className="bg-gray-400 hover:bg-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Adjustment
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmStockAdjust;
