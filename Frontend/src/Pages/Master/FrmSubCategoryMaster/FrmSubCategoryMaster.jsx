import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Layout";
import HeaderLabel from "../../../Components/HeaderLabel";
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

const FrmSubCategoryMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const subcategoryId = queryParams.get("subcategoryId");

  const [initialValues, setInitialValues] = useState({
    subCategoryName: "",
    categoryId: "",
    flag: "",
  });

  const [loading, setLoading] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([
    { categoryId: "", categoryName: "" },
  ]);

  // Fetch category list for dropdown
  const getDropdownOptions = async () => {
    try {
      const payload = { ulbId: ulbId };
      const res = await apiService.post("GetCategoryActiveList", payload);
      if (res?.data?.length > 0) {
        const options = res.data.map((option) => ({
          categoryId: option.CATEGORY_ID,
          categoryName: option.CATEGORY_NAME,
        }));
        setDropdownOptions(options);
      }
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  // Autofill when editing
  useEffect(() => {
    const fetchSubCategoryById = async () => {
      if (mode !== "1" && subcategoryId) {
        try {
          setLoading(true);
          const payload = {
            ulbId: Number(ulbId),
            subcategoryId: Number(subcategoryId),
          };

          const { data } = await apiService.post("SubcategorybyID", payload);

          if (data) {
            setInitialValues({
              subCategoryName: data.VAR_SUBCATEGORY_NAME || "",
              categoryId: data.NUM_SUBCATEGORY_CATEGORYID || "",
              flag: data.VAR_SUBCATEGORY_ACTIVEFLAG || "",
            });
          }
        } catch (error) {
          console.error("Error fetching subcategory by id:", error);
          alert("Failed to fetch subcategory details.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (ulbId) {
      getDropdownOptions();
    }
    fetchSubCategoryById();
  }, [mode, subcategoryId, ulbId, user]);

  // Submit handler
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: Number(mode),
        in_ulbId: Number(ulbId),
        in_subcategoryId: mode === "1" ? null : Number(subcategoryId),
        in_categoryId: Number(values.categoryId),
        in_subcategoryName: values.subCategoryName,
        in_activeFlag: values.flag,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("SubcategoryIns", payload);

      if (res?.data.errorCode === 9999) {
        alert(res.data.message || "Saved successfully");
        resetForm();
        navigate("/Master/FrmSubCategoryList");
      } else {
        alert(res?.data.message || "Failed to save subcategory");
      }
    } catch (error) {
      console.error("Error while saving subcategory:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Sub Category Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Sub Category Master",
      }}
    >
      <div>
        {/* <HeaderLabel text="Sub Category Master" size="text-l" align="text-left" /> */}

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={ValidationSchemas().FrmSubCategoryMaster}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label text="Sub Category Name : " required />
                    <Field
                      name="subCategoryName"
                      placeholder="Sub Category Name"
                      component={InputField}
                      type="text"
                    />
                    {touched.subCategoryName && errors.subCategoryName && (
                      <div className="text-red-500 text-sm">
                        {errors.subCategoryName}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label text="Category : " required />
                    <Field
                      as="select"
                      name="categoryId"
                      className="form-input-box"
                    >
                      <option value="">Select Category</option>
                      {dropdownOptions.map((option) => (
                        <option
                          value={option.categoryId}
                          key={option.categoryId}
                        >
                          {option.categoryName}
                        </option>
                      ))}
                    </Field>
                    {touched.categoryId && errors.categoryId && (
                      <div className="text-red-500 text-sm">
                        {errors.categoryId}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label text="Flag : " required />
                    <Field
                      as="select"
                      name="flag"
                      className="form-input-box"
                    >
                      <option value="">Select flag</option>
                      <option value="A">Active</option>
                      <option value="I">In-Active</option>
                    </Field>
                    {touched.flag && errors.flag && (
                      <div className="text-red-500 text-sm">{errors.flag}</div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button type="button" onClick={() => navigate(-1)}>
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

export default FrmSubCategoryMaster;
