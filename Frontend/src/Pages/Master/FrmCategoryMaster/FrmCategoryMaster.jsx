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

const FrmCategoryMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1";
  const categoryId = queryParams.get("categoryId");

  const [initialValues, setInitialValues] = useState({
    categoryName: "",
    flag: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryById = async () => {
      if (mode !== "1" && categoryId) {
        try {
          setLoading(true);
          const payload = {
            ulbId: Number(ulbId),
            categoryId: Number(categoryId),
          };

          const { data } = await apiService.post("GetCategoryById", payload);

          if (data) {
            setInitialValues({
              categoryName: data.CATEGORY_NAME || "",
              flag: data.CATEGORY_FLAG || "",
            });
          }
        } catch (error) {
          console.error("Error fetching category by id:", error);
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
        in_categoryName: values.categoryName,
        in_parentCatId: null,
        in_flag: values.flag,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("CategoryIns", payload);

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmCategoryList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving category:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Category Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Category Master",
      }}
    >
      <div>
        {/* <HeaderLabel text="Category Master" size="text-l" align="text-left" /> */}

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={ValidationSchemas().FrmCategoryMaster}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label text="Category Name : " required />
                    <Field
                      name="categoryName"
                      placeholder="Category Name"
                      component={InputField}
                      type="text"
                    />
                    {touched.categoryName && errors.categoryName && (
                      <div className="text-red-500 text-sm">
                        {errors.categoryName}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label text="Flag : " required />
                    <Field
                      name="flag"
                      component={InputField}
                      type="dropdown"
                      options={[
                        { value: "A", label: "Active" },
                        { value: "I", label: "In-Active" },
                      ]}
                    />
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

export default FrmCategoryMaster;
