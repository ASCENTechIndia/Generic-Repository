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

const FrmStoresMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const storeId = queryParams.get("storeId");

  const [initialValues, setInitialValues] = useState({
    storeCode: "",
    storeName: "",
    location: "",
    storeType: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStoreById = async () => {
      if (mode !== "1" && storeId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), storeId: Number(storeId) };
          // const { data } = await apiService.post("GetStoreById", payload);

          // Dummy data for now
          const data = {
            STORE_CODE: "STR001",
            STORE_NAME: "Central Store",
            LOCATION: "Mumbai",
            STORE_TYPE: "Main Store",
            STATUS: "A",
          };

          setInitialValues({
            storeCode: data.STORE_CODE || "",
            storeName: data.STORE_NAME || "",
            location: data.LOCATION || "",
            storeType: data.STORE_TYPE || "",
            status: data.STATUS || "A",
          });
        } catch (error) {
          console.error("Error fetching store by id:", error);
          alert("Failed to fetch store details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStoreById();
  }, [mode, storeId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_storeId: mode === "1" ? null : Number(storeId),
        in_storeCode: values.storeCode,
        in_storeName: values.storeName,
        in_location: values.location,
        in_storeType: values.storeType,
        in_status: values.status,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("StoreIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmStoresMasterList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving store:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Stores Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Stores Master",
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
            validationSchema={ValidationSchemas().FrmStoresMaster}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Store Code */}
                  <div>
                    <Label text="Store Code : " required />
                    <Field
                      name="storeCode"
                      placeholder="e.g. STR001"
                      component={InputField}
                      type="text"
                    />
                    {touched.storeCode && errors.storeCode && (
                      <div className="text-red-500 text-sm">
                        {errors.storeCode}
                      </div>
                    )}
                  </div>

                  {/* Store Name */}
                  <div>
                    <Label text="Store Name : " required />
                    <Field
                      name="storeName"
                      placeholder="e.g. Central Store"
                      component={InputField}
                      type="text"
                    />
                    {touched.storeName && errors.storeName && (
                      <div className="text-red-500 text-sm">
                        {errors.storeName}
                      </div>
                    )}
                  </div>

                  {/* Location (Text field as requested, can be changed to dropdown later) */}
                  <div>
                    <Label text="Location : " required />
                    <Field
                      name="location"
                      placeholder="e.g. Mumbai"
                      component={InputField}
                      type="text"
                    />
                    {touched.location && errors.location && (
                      <div className="text-red-500 text-sm">
                        {errors.location}
                      </div>
                    )}
                  </div>

                  {/* Store Type */}
                  <div>
                    <Label text="Store Type : " required />
                    <Field
                      name="storeType"
                      placeholder="e.g. Main Store"
                      component={InputField}
                      type="text"
                    />
                    {touched.storeType && errors.storeType && (
                      <div className="text-red-500 text-sm">
                        {errors.storeType}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() => navigate("FrmStoresMasterList")}
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

export default FrmStoresMaster;
