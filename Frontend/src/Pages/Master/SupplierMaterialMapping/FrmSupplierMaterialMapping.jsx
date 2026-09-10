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

const FrmSupplierMaterialMapping = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const mappingId = queryParams.get("mappingId");

  const [initialValues, setInitialValues] = useState({
    supplierId: "",
    materialId: "",
    supplierMaterialCode: "",
    purchaseRate: "",
    minOrderQty: "",
    leadTime: "",
    effectiveFrom: "",
    effectiveTo: "",
    status: "A",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMappingById = async () => {
      if (mode !== "1" && mappingId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), mappingId: Number(mappingId) };
          // const { data } = await apiService.post("GetSupplierMaterialMappingById", payload);

          // Dummy data for now
          const data = {
            SUPPLIER_ID: "SUP001",
            MATERIAL_ID: "MAT001",
            SUPPLIER_MATERIAL_CODE: "SUPMAT001",
            PURCHASE_RATE: "100",
            MIN_ORDER_QTY: "50",
            LEAD_TIME: "7 Days",
            EFFECTIVE_FROM: "2023-10-01",
            EFFECTIVE_TO: "2024-10-01",
            STATUS: "A",
          };

          setInitialValues({
            supplierId: data.SUPPLIER_ID || "",
            materialId: data.MATERIAL_ID || "",
            supplierMaterialCode: data.SUPPLIER_MATERIAL_CODE || "",
            purchaseRate: data.PURCHASE_RATE || "",
            minOrderQty: data.MIN_ORDER_QTY || "",
            leadTime: data.LEAD_TIME || "",
            effectiveFrom: data.EFFECTIVE_FROM || "",
            effectiveTo: data.EFFECTIVE_TO || "",
            status: data.STATUS || "A",
          });
        } catch (error) {
          console.error("Error fetching mapping by id:", error);
          alert("Failed to fetch mapping details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMappingById();
  }, [mode, mappingId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_mappingId: mode === "1" ? null : Number(mappingId),
        in_supplierId: values.supplierId,
        in_materialId: values.materialId,
        in_supplierMaterialCode: values.supplierMaterialCode,
        in_purchaseRate: values.purchaseRate,
        in_minOrderQty: values.minOrderQty,
        in_leadTime: values.leadTime,
        in_effectiveFrom: values.effectiveFrom,
        in_effectiveTo: values.effectiveTo,
        in_status: values.status,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("SupplierMaterialMappingIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmSupplierMaterialMappingList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving mapping:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Supplier Material Mapping"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Supplier Material Mapping",
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
            validationSchema={ValidationSchemas().FrmSupplierMaterialMapping}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Supplier ID */}
                  <div>
                    <Label text="Supplier ID : " required />
                    <Field
                      name="supplierId"
                      placeholder="e.g. SUP001"
                      component={InputField}
                      type="text"
                    />
                    {touched.supplierId && errors.supplierId && (
                      <div className="text-red-500 text-sm">
                        {errors.supplierId}
                      </div>
                    )}
                  </div>

                  {/* Material ID */}
                  <div>
                    <Label text="Material ID : " required />
                    <Field
                      name="materialId"
                      placeholder="e.g. MAT001"
                      component={InputField}
                      type="text"
                    />
                    {touched.materialId && errors.materialId && (
                      <div className="text-red-500 text-sm">
                        {errors.materialId}
                      </div>
                    )}
                  </div>

                  {/* Supplier Material Code */}
                  <div>
                    <Label text="Supplier Material Code : " required />
                    <Field
                      name="supplierMaterialCode"
                      placeholder="e.g. SUPMAT001"
                      component={InputField}
                      type="text"
                    />
                    {touched.supplierMaterialCode &&
                      errors.supplierMaterialCode && (
                        <div className="text-red-500 text-sm">
                          {errors.supplierMaterialCode}
                        </div>
                      )}
                  </div>

                  {/* Purchase Rate */}
                  <div>
                    <Label text="Purchase Rate : " required />
                    <Field
                      name="purchaseRate"
                      placeholder="e.g. 100"
                      component={InputField}
                      type="text"
                    />
                    {touched.purchaseRate && errors.purchaseRate && (
                      <div className="text-red-500 text-sm">
                        {errors.purchaseRate}
                      </div>
                    )}
                  </div>

                  {/* Minimum Order Quantity */}
                  <div>
                    <Label text="Minimum Order Quantity : " required />
                    <Field
                      name="minOrderQty"
                      placeholder="e.g. 50"
                      component={InputField}
                      type="text"
                    />
                    {touched.minOrderQty && errors.minOrderQty && (
                      <div className="text-red-500 text-sm">
                        {errors.minOrderQty}
                      </div>
                    )}
                  </div>

                  {/* Lead Time */}
                  <div>
                    <Label text="Lead Time : " required />
                    <Field
                      name="leadTime"
                      placeholder="e.g. 7 Days"
                      component={InputField}
                      type="text"
                    />
                    {touched.leadTime && errors.leadTime && (
                      <div className="text-red-500 text-sm">
                        {errors.leadTime}
                      </div>
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
                    onClick={() =>
                      navigate("/Master/FrmSupplierMaterialMappingList")
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

export default FrmSupplierMaterialMapping;
