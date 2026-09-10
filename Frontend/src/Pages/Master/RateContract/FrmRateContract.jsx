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

const FrmRateContract = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const rateContractId = queryParams.get("rateContractId");

  const [initialValues, setInitialValues] = useState({
    rateContractNo: "",
    supplier: "",
    material: "",
    uom: "",
    rate: "",
    tax: "",
    effectiveFrom: "",
    effectiveTo: "",
    status: "A",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRateContractById = async () => {
      if (mode !== "1" && rateContractId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), rateContractId: Number(rateContractId) };
          // const { data } = await apiService.post("GetRateContractById", payload);

          // Dummy data for now
          const data = {
            RATE_CONTRACT_NO: "RC001",
            SUPPLIER: "MedPlus Distributors",
            MATERIAL: "Paracetamol 500mg",
            UOM: "Strip",
            RATE: "100",
            TAX: "12%",
            EFFECTIVE_FROM: "2023-10-01",
            EFFECTIVE_TO: "2024-10-01",
            STATUS: "A",
          };

          setInitialValues({
            rateContractNo: data.RATE_CONTRACT_NO || "",
            supplier: data.SUPPLIER || "",
            material: data.MATERIAL || "",
            uom: data.UOM || "",
            rate: data.RATE || "",
            tax: data.TAX || "",
            effectiveFrom: data.EFFECTIVE_FROM || "",
            effectiveTo: data.EFFECTIVE_TO || "",
            status: data.STATUS || "A",
          });
        } catch (error) {
          console.error("Error fetching rate contract by id:", error);
          alert("Failed to fetch rate contract details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRateContractById();
  }, [mode, rateContractId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_rateContractId: mode === "1" ? null : Number(rateContractId),
        in_rateContractNo: values.rateContractNo,
        in_supplier: values.supplier,
        in_material: values.material,
        in_uom: values.uom,
        in_rate: values.rate,
        in_tax: values.tax,
        in_effectiveFrom: values.effectiveFrom,
        in_effectiveTo: values.effectiveTo,
        in_status: values.status,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("RateContractIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmRateContractList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving rate contract:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Rate Contract"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Rate Contract",
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
            validationSchema={ValidationSchemas().FrmRateContract}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Rate Contract No */}
                  <div>
                    <Label text="Rate Contract No : " required />
                    <Field
                      name="rateContractNo"
                      placeholder="e.g. RC001"
                      component={InputField}
                      type="text"
                    />
                    {touched.rateContractNo && errors.rateContractNo && (
                      <div className="text-red-500 text-sm">
                        {errors.rateContractNo}
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

                  {/* UOM */}
                  <div>
                    <Label text="UOM : " required />
                    <Field
                      name="uom"
                      placeholder="e.g. Strip, Box"
                      component={InputField}
                      type="text"
                    />
                    {touched.uom && errors.uom && (
                      <div className="text-red-500 text-sm">{errors.uom}</div>
                    )}
                  </div>

                  {/* Rate */}
                  <div>
                    <Label text="Rate : " required />
                    <Field
                      name="rate"
                      placeholder="e.g. 100"
                      component={InputField}
                      type="text"
                    />
                    {touched.rate && errors.rate && (
                      <div className="text-red-500 text-sm">{errors.rate}</div>
                    )}
                  </div>

                  {/* Tax */}
                  <div>
                    <Label text="Tax : " required />
                    <Field
                      name="tax"
                      placeholder="e.g. 12%"
                      component={InputField}
                      type="text"
                    />
                    {touched.tax && errors.tax && (
                      <div className="text-red-500 text-sm">{errors.tax}</div>
                    )}
                  </div>

                  {/* Effective From */}
                  <div>
                    <Label text="Effective From : " required />
                    <Field
                      name="effectiveFrom"
                      placeholder="e.g. 2023-10-01"
                      component={InputField}
                      type="text"
                    />
                    {touched.effectiveFrom && errors.effectiveFrom && (
                      <div className="text-red-500 text-sm">
                        {errors.effectiveFrom}
                      </div>
                    )}
                  </div>

                  {/* Effective To */}
                  <div>
                    <Label text="Effective To : " required />
                    <Field
                      name="effectiveTo"
                      placeholder="e.g. 2024-10-01"
                      component={InputField}
                      type="text"
                    />
                    {touched.effectiveTo && errors.effectiveTo && (
                      <div className="text-red-500 text-sm">
                        {errors.effectiveTo}
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
                </div>

                <div className="flex justify-center gap-3">
                  {/* ✅ Back button points to the List page */}
                  <Button
                    type="button"
                    onClick={() => navigate("/Master/FrmRateContractList")}
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

export default FrmRateContract;
