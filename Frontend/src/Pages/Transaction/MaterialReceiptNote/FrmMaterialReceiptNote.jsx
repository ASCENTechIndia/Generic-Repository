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

const FrmMaterialReceiptNote = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const mrnId = queryParams.get("mrnId");

  const [initialValues, setInitialValues] = useState({
    mrnNumber: "",
    poNumber: "",
    supplier: "",
    store: "",
    material: "",
    orderedQty: "",
    receivedQty: "",
    rejectedQty: "",
    acceptedQty: "",
    rate: "",
    batchLot: "",
    expiry: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMRNById = async () => {
      if (mode !== "1" && mrnId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), mrnId: Number(mrnId) };
          // const { data } = await apiService.post("GetMRNById", payload);

          // Dummy data for now
          const data = {
            MRN_NUMBER: "MRN001",
            PO_NUMBER: "PO001",
            SUPPLIER: "MedPlus Distributors",
            STORE: "Main Store",
            MATERIAL: "A4 Paper",
            ORDERED_QTY: "500",
            RECEIVED_QTY: "500",
            REJECTED_QTY: "10",
            ACCEPTED_QTY: "490",
            RATE: "250",
            BATCH_LOT: "BATCH001",
            EXPIRY: "2025-12-31",
            REMARKS: "Good condition",
          };

          setInitialValues({
            mrnNumber: data.MRN_NUMBER || "",
            poNumber: data.PO_NUMBER || "",
            supplier: data.SUPPLIER || "",
            store: data.STORE || "",
            material: data.MATERIAL || "",
            orderedQty: data.ORDERED_QTY || "",
            receivedQty: data.RECEIVED_QTY || "",
            rejectedQty: data.REJECTED_QTY || "",
            acceptedQty: data.ACCEPTED_QTY || "",
            rate: data.RATE || "",
            batchLot: data.BATCH_LOT || "",
            expiry: data.EXPIRY || "",
            remarks: data.REMARKS || "",
          });
        } catch (error) {
          console.error("Error fetching MRN by id:", error);
          alert("Failed to fetch MRN details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMRNById();
  }, [mode, mrnId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_mrnId: mode === "1" ? null : Number(mrnId),
        in_mrnNumber: values.mrnNumber,
        in_poNumber: values.poNumber,
        in_supplier: values.supplier,
        in_store: values.store,
        in_material: values.material,
        in_orderedQty: values.orderedQty,
        in_receivedQty: values.receivedQty,
        in_rejectedQty: values.rejectedQty,
        in_acceptedQty: values.acceptedQty,
        in_rate: values.rate,
        in_batchLot: values.batchLot,
        in_expiry: values.expiry,
        in_remarks: values.remarks,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("MRNIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmMaterialReceiptNoteList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving MRN:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Material Receipt Note"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Material Receipt Note",
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
            validationSchema={ValidationSchemas().FrmMaterialReceiptNote}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* MRN Number */}
                  <div>
                    <Label text="MRN Number : " required />
                    <Field
                      name="mrnNumber"
                      placeholder="e.g. MRN001"
                      component={InputField}
                      type="text"
                    />
                    {touched.mrnNumber && errors.mrnNumber && (
                      <div className="text-red-500 text-sm">
                        {errors.mrnNumber}
                      </div>
                    )}
                  </div>

                  {/* PO Number */}
                  <div>
                    <Label text="PO Number : " required />
                    <Field
                      name="poNumber"
                      placeholder="e.g. PO001"
                      component={InputField}
                      type="text"
                    />
                    {touched.poNumber && errors.poNumber && (
                      <div className="text-red-500 text-sm">
                        {errors.poNumber}
                      </div>
                    )}
                  </div>

                  {/* Supplier */}
                  <div>
                    <Label text="Supplier : " required />
                    <Field
                      name="supplier"
                      placeholder="e.g. MedPlus Distributors"
                      component={InputField}
                      type="text"
                    />
                    {touched.supplier && errors.supplier && (
                      <div className="text-red-500 text-sm">
                        {errors.supplier}
                      </div>
                    )}
                  </div>

                  {/* Store */}
                  <div>
                    <Label text="Store : " required />
                    <Field
                      name="store"
                      placeholder="e.g. Main Store"
                      component={InputField}
                      type="text"
                    />
                    {touched.store && errors.store && (
                      <div className="text-red-500 text-sm">{errors.store}</div>
                    )}
                  </div>

                  {/* Material */}
                  <div>
                    <Label text="Material : " required />
                    <Field
                      name="material"
                      placeholder="e.g. A4 Paper"
                      component={InputField}
                      type="text"
                    />
                    {touched.material && errors.material && (
                      <div className="text-red-500 text-sm">
                        {errors.material}
                      </div>
                    )}
                  </div>

                  {/* Ordered Qty */}
                  <div>
                    <Label text="Ordered Qty : " required />
                    <Field
                      name="orderedQty"
                      placeholder="e.g. 500"
                      component={InputField}
                      type="text"
                    />
                    {touched.orderedQty && errors.orderedQty && (
                      <div className="text-red-500 text-sm">
                        {errors.orderedQty}
                      </div>
                    )}
                  </div>

                  {/* Received Qty */}
                  <div>
                    <Label text="Received Qty : " required />
                    <Field
                      name="receivedQty"
                      placeholder="e.g. 500"
                      component={InputField}
                      type="text"
                    />
                    {touched.receivedQty && errors.receivedQty && (
                      <div className="text-red-500 text-sm">
                        {errors.receivedQty}
                      </div>
                    )}
                  </div>

                  {/* Rejected Qty */}
                  <div>
                    <Label text="Rejected Qty : " required />
                    <Field
                      name="rejectedQty"
                      placeholder="e.g. 10"
                      component={InputField}
                      type="text"
                    />
                    {touched.rejectedQty && errors.rejectedQty && (
                      <div className="text-red-500 text-sm">
                        {errors.rejectedQty}
                      </div>
                    )}
                  </div>

                  {/* Accepted Qty */}
                  <div>
                    <Label text="Accepted Qty : " required />
                    <Field
                      name="acceptedQty"
                      placeholder="e.g. 490"
                      component={InputField}
                      type="text"
                    />
                    {touched.acceptedQty && errors.acceptedQty && (
                      <div className="text-red-500 text-sm">
                        {errors.acceptedQty}
                      </div>
                    )}
                  </div>

                  {/* Rate */}
                  <div>
                    <Label text="Rate : " required />
                    <Field
                      name="rate"
                      placeholder="e.g. 250"
                      component={InputField}
                      type="text"
                    />
                    {touched.rate && errors.rate && (
                      <div className="text-red-500 text-sm">{errors.rate}</div>
                    )}
                  </div>

                  {/* Batch/Lot (Optional) */}
                  <div>
                    <Label text="Batch/Lot : " />
                    <Field
                      name="batchLot"
                      placeholder="e.g. BATCH001"
                      component={InputField}
                      type="text"
                    />
                    {touched.batchLot && errors.batchLot && (
                      <div className="text-red-500 text-sm">
                        {errors.batchLot}
                      </div>
                    )}
                  </div>

                  {/* Expiry (Optional) */}
                  <div>
                    <Label text="Expiry : " />
                    <Field
                      name="expiry"
                      placeholder="e.g. 2025-12-31"
                      component={InputField}
                      type="text"
                    />
                    {touched.expiry && errors.expiry && (
                      <div className="text-red-500 text-sm">
                        {errors.expiry}
                      </div>
                    )}
                  </div>

                  {/* Remarks */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label text="Remarks : " />
                    <Field
                      name="remarks"
                      placeholder="Remarks"
                      component={InputField}
                      type="text"
                    />
                    {touched.remarks && errors.remarks && (
                      <div className="text-red-500 text-sm">
                        {errors.remarks}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  {/* ✅ Back button points to the List page */}
                  <Button
                    type="button"
                    onClick={() =>
                      navigate("/Transaction/FrmMaterialReceiptNoteList")
                    }
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

export default FrmMaterialReceiptNote;
