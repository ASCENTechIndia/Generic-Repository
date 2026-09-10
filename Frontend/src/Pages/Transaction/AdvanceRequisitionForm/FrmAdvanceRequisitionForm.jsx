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

const FrmAdvanceRequisitionForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const requisitionId = queryParams.get("requisitionId");

  const [initialValues, setInitialValues] = useState({
    requisitionNo: "",
    department: "",
    requiredDate: "",
    purpose: "",
    material: "",
    quantity: "",
    estimatedRate: "",
    estimatedAmount: "",
    remarks: "",
    approvalStatus: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequisitionById = async () => {
      if (mode !== "1" && requisitionId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), requisitionId: Number(requisitionId) };
          // const { data } = await apiService.post("GetAdvanceRequisitionById", payload);

          // Dummy data for now
          const data = {
            REQUISITION_NO: "REQ001",
            DEPARTMENT: "OPD Department",
            REQUIRED_DATE: "2023-11-01",
            PURPOSE: "Emergency Stock",
            MATERIAL: "Paracetamol 500mg",
            QUANTITY: "100",
            ESTIMATED_RATE: "10",
            ESTIMATED_AMOUNT: "1000",
            REMARKS: "Urgent requirement",
            APPROVAL_STATUS: "Pending",
          };

          setInitialValues({
            requisitionNo: data.REQUISITION_NO || "",
            department: data.DEPARTMENT || "",
            requiredDate: data.REQUIRED_DATE || "",
            purpose: data.PURPOSE || "",
            material: data.MATERIAL || "",
            quantity: data.QUANTITY || "",
            estimatedRate: data.ESTIMATED_RATE || "",
            estimatedAmount: data.ESTIMATED_AMOUNT || "",
            remarks: data.REMARKS || "",
            approvalStatus: data.APPROVAL_STATUS || "",
          });
        } catch (error) {
          console.error("Error fetching requisition by id:", error);
          alert("Failed to fetch requisition details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRequisitionById();
  }, [mode, requisitionId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_requisitionId: mode === "1" ? null : Number(requisitionId),
        in_requisitionNo: values.requisitionNo,
        in_department: values.department,
        in_requiredDate: values.requiredDate,
        in_purpose: values.purpose,
        in_material: values.material,
        in_quantity: values.quantity,
        in_estimatedRate: values.estimatedRate,
        in_estimatedAmount: values.estimatedAmount,
        in_remarks: values.remarks,
        in_approvalStatus: values.approvalStatus,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("AdvanceRequisitionIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Transaction/FrmAdvanceRequisitionFormList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving requisition:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Advance Requisition Form"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Advance Requisition Form",
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
            validationSchema={ValidationSchemas().FrmAdvanceRequisitionForm}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Requisition No */}
                  <div>
                    <Label text="Requisition No : " required />
                    <Field
                      name="requisitionNo"
                      placeholder="e.g. REQ001"
                      component={InputField}
                      type="text"
                    />
                    {touched.requisitionNo && errors.requisitionNo && (
                      <div className="text-red-500 text-sm">
                        {errors.requisitionNo}
                      </div>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <Label text="Department : " required />
                    <Field
                      name="department"
                      placeholder="e.g. OPD Department"
                      component={InputField}
                      type="text"
                    />
                    {touched.department && errors.department && (
                      <div className="text-red-500 text-sm">
                        {errors.department}
                      </div>
                    )}
                  </div>

                  {/* Required Date */}
                  <div>
                    <Label text="Required Date : " required />
                    <Field
                      name="requiredDate"
                      placeholder="e.g. 2023-11-01"
                      component={InputField}
                      type="text"
                    />
                    {touched.requiredDate && errors.requiredDate && (
                      <div className="text-red-500 text-sm">
                        {errors.requiredDate}
                      </div>
                    )}
                  </div>

                  {/* Purpose */}
                  <div>
                    <Label text="Purpose : " required />
                    <Field
                      name="purpose"
                      placeholder="e.g. Emergency Stock"
                      component={InputField}
                      type="text"
                    />
                    {touched.purpose && errors.purpose && (
                      <div className="text-red-500 text-sm">
                        {errors.purpose}
                      </div>
                    )}
                  </div>

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
                      onChange={(e) => {
                        const qty = e.target.value;
                        setFieldValue("quantity", qty);
                        if (qty && values.estimatedRate) {
                          setFieldValue(
                            "estimatedAmount",
                            (
                              Number(qty) * Number(values.estimatedRate)
                            ).toString(),
                          );
                        }
                      }}
                    />
                    {touched.quantity && errors.quantity && (
                      <div className="text-red-500 text-sm">
                        {errors.quantity}
                      </div>
                    )}
                  </div>

                  {/* Estimated Rate */}
                  <div>
                    <Label text="Estimated Rate : " required />
                    <Field
                      name="estimatedRate"
                      placeholder="e.g. 10"
                      component={InputField}
                      type="text"
                      onChange={(e) => {
                        const rate = e.target.value;
                        setFieldValue("estimatedRate", rate);
                        if (values.quantity && rate) {
                          setFieldValue(
                            "estimatedAmount",
                            (Number(values.quantity) * Number(rate)).toString(),
                          );
                        }
                      }}
                    />
                    {touched.estimatedRate && errors.estimatedRate && (
                      <div className="text-red-500 text-sm">
                        {errors.estimatedRate}
                      </div>
                    )}
                  </div>

                  {/* Estimated Amount (Auto-calculated) */}
                  <div>
                    <Label text="Estimated Amount : " required />
                    <Field
                      name="estimatedAmount"
                      placeholder="e.g. 1000"
                      component={InputField}
                      type="text"
                      disabled
                    />
                    {touched.estimatedAmount && errors.estimatedAmount && (
                      <div className="text-red-500 text-sm">
                        {errors.estimatedAmount}
                      </div>
                    )}
                  </div>

                  {/* Approval Status */}
                  <div>
                    <Label text="Approval Status : " required />
                    <Field
                      name="approvalStatus"
                      placeholder="e.g. Pending / Approved"
                      component={InputField}
                      type="text"
                    />
                    {touched.approvalStatus && errors.approvalStatus && (
                      <div className="text-red-500 text-sm">
                        {errors.approvalStatus}
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
                      navigate("/Transaction/FrmAdvanceRequisitionFormList")
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

export default FrmAdvanceRequisitionForm;
