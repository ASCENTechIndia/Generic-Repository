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

const FrmNonIndentMaterialIssueNote = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const issueId = queryParams.get("issueId");

  const [initialValues, setInitialValues] = useState({
    storeOperator: "",
    createDirectIssue: "",
    departmentUser: "",
    material: "",
    quantity: "",
    issue: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIssueById = async () => {
      if (mode !== "1" && issueId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), issueId: Number(issueId) };
          // const { data } = await apiService.post("GetNonIndentIssueById", payload);

          // Dummy data for now
          const data = {
            STORE_OPERATOR: "John Doe",
            CREATE_DIRECT_ISSUE: "Yes",
            DEPARTMENT_USER: "OPD Department",
            MATERIAL: "Paracetamol 500mg",
            QUANTITY: "100",
            ISSUE: "Emergency Issue",
          };

          setInitialValues({
            storeOperator: data.STORE_OPERATOR || "",
            createDirectIssue: data.CREATE_DIRECT_ISSUE || "",
            departmentUser: data.DEPARTMENT_USER || "",
            material: data.MATERIAL || "",
            quantity: data.QUANTITY || "",
            issue: data.ISSUE || "",
          });
        } catch (error) {
          console.error("Error fetching issue by id:", error);
          alert("Failed to fetch issue details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchIssueById();
  }, [mode, issueId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_issueId: mode === "1" ? null : Number(issueId),
        in_storeOperator: values.storeOperator,
        in_createDirectIssue: values.createDirectIssue,
        in_departmentUser: values.departmentUser,
        in_material: values.material,
        in_quantity: values.quantity,
        in_issue: values.issue,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("NonIndentIssueIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Transaction/FrmNonIndentMaterialIssueNoteList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving issue:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Non-Indent Material Issue Note"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Non-Indent Material Issue Note",
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
            validationSchema={ValidationSchemas().FrmNonIndentMaterialIssueNote}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Store Operator */}
                  <div>
                    <Label text="Store Operator : " required />
                    <Field
                      name="storeOperator"
                      placeholder="e.g. John Doe"
                      component={InputField}
                      type="text"
                    />
                    {touched.storeOperator && errors.storeOperator && (
                      <div className="text-red-500 text-sm">
                        {errors.storeOperator}
                      </div>
                    )}
                  </div>

                  {/* Create Direct Issue */}
                  <div>
                    <Label text="Create Direct Issue : " required />
                    <Field
                      name="createDirectIssue"
                      placeholder="e.g. Yes / No"
                      component={InputField}
                      type="text"
                    />
                    {touched.createDirectIssue && errors.createDirectIssue && (
                      <div className="text-red-500 text-sm">
                        {errors.createDirectIssue}
                      </div>
                    )}
                  </div>

                  {/* Select Department/User */}
                  <div>
                    <Label text="Select Department/User : " required />
                    <Field
                      name="departmentUser"
                      placeholder="e.g. OPD Department"
                      component={InputField}
                      type="text"
                    />
                    {touched.departmentUser && errors.departmentUser && (
                      <div className="text-red-500 text-sm">
                        {errors.departmentUser}
                      </div>
                    )}
                  </div>

                  {/* Select Material */}
                  <div>
                    <Label text="Select Material : " required />
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

                  {/* Issue */}
                  <div>
                    <Label text="Issue : " required />
                    <Field
                      name="issue"
                      placeholder="e.g. Emergency Issue"
                      component={InputField}
                      type="text"
                    />
                    {touched.issue && errors.issue && (
                      <div className="text-red-500 text-sm">{errors.issue}</div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  {/* ✅ Updated Back button to point to the List page using /Transaction/ */}
                  <Button
                    type="button"
                    onClick={() =>
                      navigate("/Transaction/FrmNonIndentMaterialIssueNoteList")
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

export default FrmNonIndentMaterialIssueNote;
