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

const FrmDeadStockDisposal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const disposalId = queryParams.get("disposalId");

  const [initialValues, setInitialValues] = useState({
    disposalNo: "",
    date: "",
    material: "",
    batchNo: "",
    qty: "",
    reason: "",
    storeLocation: "",
    approvedBy: "",
    disposalMethod: "",
    disposalValue: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDisposalById = async () => {
      if (mode !== "1" && disposalId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), disposalId: Number(disposalId) };
          // const { data } = await apiService.post("GetDeadStockDisposalById", payload);

          // Dummy data for now
          const data = {
            DISPOSAL_NO: "DSP001",
            DATE: "2023-11-15",
            MATERIAL: "Expired Paracetamol 500mg",
            BATCH_NO: "BATCH001",
            QTY: "50",
            REASON: "Expired",
            STORE_LOCATION: "Pharmacy Store",
            APPROVED_BY: "Dr. Smith",
            DISPOSAL_METHOD: "Destroy",
            DISPOSAL_VALUE: "500",
            REMARKS: "Expired stock destroyed as per protocol",
          };

          setInitialValues({
            disposalNo: data.DISPOSAL_NO || "",
            date: data.DATE || "",
            material: data.MATERIAL || "",
            batchNo: data.BATCH_NO || "",
            qty: data.QTY || "",
            reason: data.REASON || "",
            storeLocation: data.STORE_LOCATION || "",
            approvedBy: data.APPROVED_BY || "",
            disposalMethod: data.DISPOSAL_METHOD || "",
            disposalValue: data.DISPOSAL_VALUE || "",
            remarks: data.REMARKS || "",
          });
        } catch (error) {
          console.error("Error fetching disposal by id:", error);
          alert("Failed to fetch disposal details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDisposalById();
  }, [mode, disposalId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_disposalId: mode === "1" ? null : Number(disposalId),
        in_disposalNo: values.disposalNo,
        in_date: values.date,
        in_material: values.material,
        in_batchNo: values.batchNo,
        in_qty: values.qty,
        in_reason: values.reason,
        in_storeLocation: values.storeLocation,
        in_approvedBy: values.approvedBy,
        in_disposalMethod: values.disposalMethod,
        in_disposalValue: values.disposalValue,
        in_remarks: values.remarks,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("DeadStockDisposalIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Transaction/FrmDeadStockDisposalList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving disposal:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Dead Stock Disposal"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Dead Stock Disposal",
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
            validationSchema={ValidationSchemas().FrmDeadStockDisposal}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Disposal No. */}
                  <div>
                    <Label text="Disposal No. : " required />
                    <Field
                      name="disposalNo"
                      placeholder="e.g. DSP001"
                      component={InputField}
                      type="text"
                    />
                    {touched.disposalNo && errors.disposalNo && (
                      <div className="text-red-500 text-sm">
                        {errors.disposalNo}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <Label text="Date : " required />
                    <Field
                      name="date"
                      placeholder="e.g. 2023-11-15"
                      component={InputField}
                      type="text"
                    />
                    {touched.date && errors.date && (
                      <div className="text-red-500 text-sm">{errors.date}</div>
                    )}
                  </div>

                  {/* Material */}
                  <div>
                    <Label text="Material : " required />
                    <Field
                      name="material"
                      placeholder="e.g. Expired Paracetamol 500mg"
                      component={InputField}
                      type="text"
                    />
                    {touched.material && errors.material && (
                      <div className="text-red-500 text-sm">
                        {errors.material}
                      </div>
                    )}
                  </div>

                  {/* Batch No. (Optional for generic materials) */}
                  <div>
                    <Label text="Batch No. : " />
                    <Field
                      name="batchNo"
                      placeholder="e.g. BATCH001"
                      component={InputField}
                      type="text"
                    />
                    {touched.batchNo && errors.batchNo && (
                      <div className="text-red-500 text-sm">
                        {errors.batchNo}
                      </div>
                    )}
                  </div>

                  {/* Qty */}
                  <div>
                    <Label text="Qty : " required />
                    <Field
                      name="qty"
                      placeholder="e.g. 50"
                      component={InputField}
                      type="text"
                    />
                    {touched.qty && errors.qty && (
                      <div className="text-red-500 text-sm">{errors.qty}</div>
                    )}
                  </div>

                  {/* Reason */}
                  <div>
                    <Label text="Reason : " required />
                    <Field
                      name="reason"
                      placeholder="Expired / Damaged / Obsolete"
                      component={InputField}
                      type="text"
                    />
                    {touched.reason && errors.reason && (
                      <div className="text-red-500 text-sm">
                        {errors.reason}
                      </div>
                    )}
                  </div>

                  {/* Store Location */}
                  <div>
                    <Label text="Store Location : " required />
                    <Field
                      name="storeLocation"
                      placeholder="e.g. Pharmacy Store"
                      component={InputField}
                      type="text"
                    />
                    {touched.storeLocation && errors.storeLocation && (
                      <div className="text-red-500 text-sm">
                        {errors.storeLocation}
                      </div>
                    )}
                  </div>

                  {/* Approved By */}
                  <div>
                    <Label text="Approved By : " required />
                    <Field
                      name="approvedBy"
                      placeholder="e.g. Dr. Smith"
                      component={InputField}
                      type="text"
                    />
                    {touched.approvedBy && errors.approvedBy && (
                      <div className="text-red-500 text-sm">
                        {errors.approvedBy}
                      </div>
                    )}
                  </div>

                  {/* Disposal Method */}
                  <div>
                    <Label text="Disposal Method : " required />
                    <Field
                      name="disposalMethod"
                      placeholder="Return to Vendor / Destroy / Write-off"
                      component={InputField}
                      type="text"
                    />
                    {touched.disposalMethod && errors.disposalMethod && (
                      <div className="text-red-500 text-sm">
                        {errors.disposalMethod}
                      </div>
                    )}
                  </div>

                  {/* Disposal Value */}
                  <div>
                    <Label text="Disposal Value : " required />
                    <Field
                      name="disposalValue"
                      placeholder="e.g. 500"
                      component={InputField}
                      type="text"
                    />
                    {touched.disposalValue && errors.disposalValue && (
                      <div className="text-red-500 text-sm">
                        {errors.disposalValue}
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
                  {/* ✅ Back button points to the List page using /Transaction/ */}
                  <Button
                    type="button"
                    onClick={() =>
                      navigate("/Transaction/FrmDeadStockDisposalList")
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

export default FrmDeadStockDisposal;
