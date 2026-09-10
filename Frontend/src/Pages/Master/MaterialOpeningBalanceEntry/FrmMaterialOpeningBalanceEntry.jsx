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

const FrmMaterialOpeningBalanceEntry = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const balanceId = queryParams.get("balanceId");

  const [initialValues, setInitialValues] = useState({
    material: "",
    store: "",
    bin: "",
    openingQty: "",
    rate: "",
    openingValue: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalanceById = async () => {
      if (mode !== "1" && balanceId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), balanceId: Number(balanceId) };
          // const { data } = await apiService.post("GetOpeningBalanceById", payload);

          // Dummy data for now
          const data = {
            MATERIAL: "A4 Paper",
            STORE: "Main Store",
            BIN: "A01",
            OPENING_QTY: "500",
            RATE: "250",
            OPENING_VALUE: "125000",
          };

          setInitialValues({
            material: data.MATERIAL || "",
            store: data.STORE || "",
            bin: data.BIN || "",
            openingQty: data.OPENING_QTY || "",
            rate: data.RATE || "",
            openingValue: data.OPENING_VALUE || "",
          });
        } catch (error) {
          console.error("Error fetching balance by id:", error);
          alert("Failed to fetch balance details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBalanceById();
  }, [mode, balanceId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_balanceId: mode === "1" ? null : Number(balanceId),
        in_material: values.material,
        in_store: values.store,
        in_bin: values.bin,
        in_openingQty: values.openingQty,
        in_rate: values.rate,
        in_openingValue: values.openingValue,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("OpeningBalanceIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmMaterialOpeningBalanceEntryList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving balance:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Material Opening Balance Entry"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Material Opening Balance Entry",
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
            validationSchema={
              ValidationSchemas().FrmMaterialOpeningBalanceEntry
            }
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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

                  {/* Bin */}
                  <div>
                    <Label text="Bin : " required />
                    <Field
                      name="bin"
                      placeholder="e.g. A01"
                      component={InputField}
                      type="text"
                    />
                    {touched.bin && errors.bin && (
                      <div className="text-red-500 text-sm">{errors.bin}</div>
                    )}
                  </div>

                  {/* Opening Qty */}
                  <div>
                    <Label text="Opening Qty : " required />
                    <Field
                      name="openingQty"
                      placeholder="e.g. 500"
                      component={InputField}
                      type="text"
                      onChange={(e) => {
                        const qty = e.target.value;
                        setFieldValue("openingQty", qty);
                        if (qty && values.rate) {
                          setFieldValue(
                            "openingValue",
                            (Number(qty) * Number(values.rate)).toString(),
                          );
                        }
                      }}
                    />
                    {touched.openingQty && errors.openingQty && (
                      <div className="text-red-500 text-sm">
                        {errors.openingQty}
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
                      onChange={(e) => {
                        const rate = e.target.value;
                        setFieldValue("rate", rate);
                        if (values.openingQty && rate) {
                          setFieldValue(
                            "openingValue",
                            (
                              Number(values.openingQty) * Number(rate)
                            ).toString(),
                          );
                        }
                      }}
                    />
                    {touched.rate && errors.rate && (
                      <div className="text-red-500 text-sm">{errors.rate}</div>
                    )}
                  </div>

                  {/* Opening Value (Auto-calculated) */}
                  <div>
                    <Label text="Opening Value : " required />
                    <Field
                      name="openingValue"
                      placeholder="e.g. 125000"
                      component={InputField}
                      type="text"
                      disabled
                    />
                    {touched.openingValue && errors.openingValue && (
                      <div className="text-red-500 text-sm">
                        {errors.openingValue}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  {/* ✅ Back button points to the List page */}
                  <Button
                    type="button"
                    onClick={() =>
                      navigate("/Master/FrmMaterialOpeningBalanceEntryList")
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

export default FrmMaterialOpeningBalanceEntry;
