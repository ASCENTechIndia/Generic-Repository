import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Layout";
import { Form, Formik, Field } from "formik";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import InputField from "../../../Components/InputField";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const FrmSupplierBill = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const billId = queryParams.get("billId");

  const [initialValues, setInitialValues] = useState({
    material: "",
    quantity: "",
    rate: "",
    receivedQuantity: "",
    acceptedQuantity: "",
    billingQuantity: "",
    billingRate: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBillById = async () => {
      if (mode !== "1" && billId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), billId: Number(billId) };
          // const { data } = await apiService.post("GetSupplierBillById", payload);

          // Dummy data for now
          const data = {
            MATERIAL: "Paracetamol 500mg",
            QUANTITY: "100",
            RATE: "10",
            RECEIVED_QUANTITY: "100",
            ACCEPTED_QUANTITY: "95",
            BILLING_QUANTITY: "95",
            BILLING_RATE: "10",
          };

          setInitialValues({
            material: data.MATERIAL || "",
            quantity: data.QUANTITY || "",
            rate: data.RATE || "",
            receivedQuantity: data.RECEIVED_QUANTITY || "",
            acceptedQuantity: data.ACCEPTED_QUANTITY || "",
            billingQuantity: data.BILLING_QUANTITY || "",
            billingRate: data.BILLING_RATE || "",
          });
        } catch (error) {
          console.error("Error fetching bill by id:", error);
          alert("Failed to fetch bill details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBillById();
  }, [mode, billId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_billId: mode === "1" ? null : Number(billId),
        in_material: values.material,
        in_quantity: values.quantity,
        in_rate: values.rate,
        in_receivedQuantity: values.receivedQuantity,
        in_acceptedQuantity: values.acceptedQuantity,
        in_billingQuantity: values.billingQuantity,
        in_billingRate: values.billingRate,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("SupplierBillIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Transaction/FrmSupplierBillList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving bill:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Supplier Bill"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Supplier Bill",
      }}
    >
      <div>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={ValidationSchemas().FrmSupplierBill}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                {/* ✅ Group 1: PO Details */}
                <div className="border border-gray-200 rounded p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                    PO Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Material */}
                    <div>
                      <Label text="Material : " required />
                      <Field
                        name="material"
                        placeholder="e.g. Paracetamol 500mg"
                        component={InputField}
                        type="text"
                      />
                      {touched.material && errors.material && (
                        <div className="text-red-500 text-sm">
                          {errors.material}
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div>
                      <Label text="Quantity : " required />
                      <Field
                        name="quantity"
                        placeholder="e.g. 100"
                        component={InputField}
                        type="text"
                      />
                      {touched.quantity && errors.quantity && (
                        <div className="text-red-500 text-sm">
                          {errors.quantity}
                        </div>
                      )}
                    </div>

                    {/* Rate */}
                    <div>
                      <Label text="Rate : " required />
                      <Field
                        name="rate"
                        placeholder="e.g. 10"
                        component={InputField}
                        type="text"
                      />
                      {touched.rate && errors.rate && (
                        <div className="text-red-500 text-sm">
                          {errors.rate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ✅ Group 2: GRN Details */}
                <div className="border border-gray-200 rounded p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                    GRN Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Received Quantity */}
                    <div>
                      <Label text="Received Quantity : " required />
                      <Field
                        name="receivedQuantity"
                        placeholder="e.g. 100"
                        component={InputField}
                        type="text"
                      />
                      {touched.receivedQuantity && errors.receivedQuantity && (
                        <div className="text-red-500 text-sm">
                          {errors.receivedQuantity}
                        </div>
                      )}
                    </div>

                    {/* Accepted Quantity */}
                    <div>
                      <Label text="Accepted Quantity : " required />
                      <Field
                        name="acceptedQuantity"
                        placeholder="e.g. 95"
                        component={InputField}
                        type="text"
                      />
                      {touched.acceptedQuantity && errors.acceptedQuantity && (
                        <div className="text-red-500 text-sm">
                          {errors.acceptedQuantity}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ✅ Group 3: Supplier Bill Details */}
                <div className="border border-gray-200 rounded p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                    Supplier Bill Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Billing Quantity */}
                    <div>
                      <Label text="Billing Quantity : " required />
                      <Field
                        name="billingQuantity"
                        placeholder="e.g. 95"
                        component={InputField}
                        type="text"
                      />
                      {touched.billingQuantity && errors.billingQuantity && (
                        <div className="text-red-500 text-sm">
                          {errors.billingQuantity}
                        </div>
                      )}
                    </div>

                    {/* Billing Rate */}
                    <div>
                      <Label text="Billing Rate : " required />
                      <Field
                        name="billingRate"
                        placeholder="e.g. 10"
                        component={InputField}
                        type="text"
                      />
                      {touched.billingRate && errors.billingRate && (
                        <div className="text-red-500 text-sm">
                          {errors.billingRate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  {/* ✅ Back button points to the List page using /Transaction/ */}
                  <Button
                    type="button"
                    onClick={() => navigate("/Transaction/FrmSupplierBillList")}
                  >
                    Back
                  </Button>

                  <Button type="submit" className="hover:cursor-pointer">
                    {mode === "1" ? "Submit" : "Update"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </Layout>
  );
};

export default FrmSupplierBill;
