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

const FrmUnitMeasureCategoryMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const categoryId = queryParams.get("categoryId");

  const [initialValues, setInitialValues] = useState({
    categoryCode: "",
    categoryName: "",
    description: "",
    status: "A",
    createdBy: "",
    createdDate: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryById = async () => {
      if (mode !== "1" && categoryId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), categoryId: Number(categoryId) };
          // const { data } = await apiService.post("GetUOMCategoryById", payload);

          // Dummy data for now
          const data = {
            CATEGORY_CODE: "UOMC001",
            CATEGORY_NAME: "Weight",
            DESCRIPTION: "Measuring weight in Kg, Gram, etc.",
            STATUS: "A",
            CREATED_BY: "admin",
            CREATED_DATE: "2023-10-01",
          };

          setInitialValues({
            categoryCode: data.CATEGORY_CODE || "",
            categoryName: data.CATEGORY_NAME || "",
            description: data.DESCRIPTION || "",
            status: data.STATUS || "A",
            createdBy: data.CREATED_BY || "",
            createdDate: data.CREATED_DATE || "",
          });
        } catch (error) {
          console.error("Error fetching UOM category by id:", error);
          alert("Failed to fetch category details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCategoryById();
  }, [mode, categoryId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_categoryId: mode === "1" ? null : Number(categoryId),
        in_categoryCode: values.categoryCode,
        in_categoryName: values.categoryName,
        in_description: values.description,
        in_status: values.status,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("UOMCategoryIns", payload);

      // Simulating success response
      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmUnitMeasureCategoryMasterList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving UOM category:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Unit of Measure Category Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "UOM Category Master",
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
            validationSchema={ValidationSchemas().FrmUnitMeasureCategoryMaster}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Category Code */}
                  <div>
                    <Label text="Category Code : " required />
                    <Field
                      name="categoryCode"
                      placeholder="Category Code"
                      component={InputField}
                      type="text"
                    />
                    {touched.categoryCode && errors.categoryCode && (
                      <div className="text-red-500 text-sm">
                        {errors.categoryCode}
                      </div>
                    )}
                  </div>

                  {/* Category Name (Dropdown with your provided values) */}
                  <div>
                    <Label text="Category Name : " required />
                    <Field
                      name="categoryName"
                      component={InputField}
                      type="dropdown"
                      options={[
                        { value: "Weight", label: "Weight" },
                        { value: "Length", label: "Length" },
                        { value: "Volume", label: "Volume" },
                        { value: "Quantity", label: "Quantity" },
                        { value: "Packaging", label: "Packaging" },
                      ]}
                    />
                    {touched.categoryName && errors.categoryName && (
                      <div className="text-red-500 text-sm">
                        {errors.categoryName}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <Label text="Description : " />
                    <Field
                      name="description"
                      placeholder="Description"
                      component={InputField}
                      type="text"
                    />
                    {touched.description && errors.description && (
                      <div className="text-red-500 text-sm">
                        {errors.description}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <Label text="Status : " required />
                    <Field
                      name="status"
                      component={InputField}
                      type="dropdown"
                      options={[
                        { value: "A", label: "Active" },
                        { value: "I", label: "In-Active" },
                      ]}
                    />
                    {touched.status && errors.status && (
                      <div className="text-red-500 text-sm">
                        {errors.status}
                      </div>
                    )}
                  </div>

                  {/* Created By (Read Only) */}
                  <div>
                    <Label text="Created By : " />
                    <Field
                      name="createdBy"
                      placeholder="Created By"
                      component={InputField}
                      type="text"
                      disabled
                    />
                  </div>

                  {/* Created Date (Read Only) */}
                  <div>
                    <Label text="Created Date : " />
                    <Field
                      name="createdDate"
                      placeholder="Created Date"
                      component={InputField}
                      type="text"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() =>
                      navigate("/Master/FrmUnitMeasureCategoryMasterList")
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

export default FrmUnitMeasureCategoryMaster;
