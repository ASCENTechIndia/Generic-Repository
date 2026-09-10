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

const FrmBinMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const binId = queryParams.get("binId");

  const [initialValues, setInitialValues] = useState({
    binCode: "",
    binName: "",
    storeId: "",
    rackNumber: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBinById = async () => {
      if (mode !== "1" && binId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), binId: Number(binId) };
          // const { data } = await apiService.post("GetBinById", payload);

          // Dummy data for now
          const data = {
            BIN_CODE: "BIN001",
            BIN_NAME: "Rack A Bin 1",
            STORE_ID: "STR001",
            RACK_NUMBER: "A1",
            CAPACITY: "100",
          };

          setInitialValues({
            binCode: data.BIN_CODE || "",
            binName: data.BIN_NAME || "",
            storeId: data.STORE_ID || "",
            rackNumber: data.RACK_NUMBER || "",
            capacity: data.CAPACITY || "",
          });
        } catch (error) {
          console.error("Error fetching bin by id:", error);
          alert("Failed to fetch bin details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBinById();
  }, [mode, binId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_binId: mode === "1" ? null : Number(binId),
        in_binCode: values.binCode,
        in_binName: values.binName,
        in_storeId: values.storeId,
        in_rackNumber: values.rackNumber,
        in_capacity: values.capacity,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("BinIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmBinMasterList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving bin:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Bin Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Bin Master",
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
            validationSchema={ValidationSchemas().FrmBinMaster}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Bin Code */}
                  <div>
                    <Label text="Bin Code : " required />
                    <Field
                      name="binCode"
                      placeholder="e.g. BIN001"
                      component={InputField}
                      type="text"
                    />
                    {touched.binCode && errors.binCode && (
                      <div className="text-red-500 text-sm">
                        {errors.binCode}
                      </div>
                    )}
                  </div>

                  {/* Bin Name */}
                  <div>
                    <Label text="Bin Name : " required />
                    <Field
                      name="binName"
                      placeholder="e.g. Rack A Bin 1"
                      component={InputField}
                      type="text"
                    />
                    {touched.binName && errors.binName && (
                      <div className="text-red-500 text-sm">
                        {errors.binName}
                      </div>
                    )}
                  </div>

                  {/* Store ID */}
                  <div>
                    <Label text="Store ID : " required />
                    <Field
                      name="storeId"
                      placeholder="e.g. STR001"
                      component={InputField}
                      type="text"
                    />
                    {touched.storeId && errors.storeId && (
                      <div className="text-red-500 text-sm">
                        {errors.storeId}
                      </div>
                    )}
                  </div>

                  {/* Rack Number */}
                  <div>
                    <Label text="Rack Number : " required />
                    <Field
                      name="rackNumber"
                      placeholder="e.g. A1"
                      component={InputField}
                      type="text"
                    />
                    {touched.rackNumber && errors.rackNumber && (
                      <div className="text-red-500 text-sm">
                        {errors.rackNumber}
                      </div>
                    )}
                  </div>

                  {/* Capacity */}
                  <div>
                    <Label text="Capacity : " required />
                    <Field
                      name="capacity"
                      placeholder="e.g. 100"
                      component={InputField}
                      type="text"
                    />
                    {touched.capacity && errors.capacity && (
                      <div className="text-red-500 text-sm">
                        {errors.capacity}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() => navigate("FrmBinMasterList")}
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

export default FrmBinMaster;
