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

const FrmMaterialTypeMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const materialTypeId = queryParams.get("materialTypeId");

  // ✅ All 10 text fields as requested
  const [initialValues, setInitialValues] = useState({
    consumable: "",
    stationery: "",
    electrical: "",
    hardware: "",
    furniture: "",
    itEquipment: "",
    cleaningMaterial: "",
    rawMaterial: "",
    finishedGoods: "",
    mappedStore: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMaterialTypeById = async () => {
      if (mode !== "1" && materialTypeId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), materialTypeId: Number(materialTypeId) };
          // const { data } = await apiService.post("GetMaterialTypeById", payload);

          // Dummy data for now
          const data = {
            CONSUMABLE: "Consumable",
            STATIONERY: "Stationery",
            ELECTRICAL: "Electrical",
            HARDWARE: "Hardware",
            FURNITURE: "Furniture",
            IT_EQUIPMENT: "IT Equipment",
            CLEANING_MATERIAL: "Cleaning Material",
            RAW_MATERIAL: "Raw Material",
            FINISHED_GOODS: "Finished Goods",
            MAPPED_STORE: "Electrical Store",
          };

          setInitialValues({
            consumable: data.CONSUMABLE || "",
            stationery: data.STATIONERY || "",
            electrical: data.ELECTRICAL || "",
            hardware: data.HARDWARE || "",
            furniture: data.FURNITURE || "",
            itEquipment: data.IT_EQUIPMENT || "",
            cleaningMaterial: data.CLEANING_MATERIAL || "",
            rawMaterial: data.RAW_MATERIAL || "",
            finishedGoods: data.FINISHED_GOODS || "",
            mappedStore: data.MAPPED_STORE || "",
          });
        } catch (error) {
          console.error("Error fetching material type by id:", error);
          alert("Failed to fetch material type details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMaterialTypeById();
  }, [mode, materialTypeId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_materialTypeId: mode === "1" ? null : Number(materialTypeId),
        in_consumable: values.consumable,
        in_stationery: values.stationery,
        in_electrical: values.electrical,
        in_hardware: values.hardware,
        in_furniture: values.furniture,
        in_itEquipment: values.itEquipment,
        in_cleaningMaterial: values.cleaningMaterial,
        in_rawMaterial: values.rawMaterial,
        in_finishedGoods: values.finishedGoods,
        in_mappedStore: values.mappedStore,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("MaterialTypeIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmMaterialTypeMasterList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving material type:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Material Type Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Material Type Master",
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
            validationSchema={ValidationSchemas().FrmMaterialTypeMaster}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Consumable */}
                  <div>
                    <Label text="Consumable : " required />
                    <Field
                      name="consumable"
                      placeholder="Consumable"
                      component={InputField}
                      type="text"
                    />
                    {touched.consumable && errors.consumable && (
                      <div className="text-red-500 text-sm">
                        {errors.consumable}
                      </div>
                    )}
                  </div>

                  {/* Stationery */}
                  <div>
                    <Label text="Stationery : " required />
                    <Field
                      name="stationery"
                      placeholder="Stationery"
                      component={InputField}
                      type="text"
                    />
                    {touched.stationery && errors.stationery && (
                      <div className="text-red-500 text-sm">
                        {errors.stationery}
                      </div>
                    )}
                  </div>

                  {/* Electrical */}
                  <div>
                    <Label text="Electrical : " required />
                    <Field
                      name="electrical"
                      placeholder="Electrical"
                      component={InputField}
                      type="text"
                    />
                    {touched.electrical && errors.electrical && (
                      <div className="text-red-500 text-sm">
                        {errors.electrical}
                      </div>
                    )}
                  </div>

                  {/* Hardware */}
                  <div>
                    <Label text="Hardware : " required />
                    <Field
                      name="hardware"
                      placeholder="Hardware"
                      component={InputField}
                      type="text"
                    />
                    {touched.hardware && errors.hardware && (
                      <div className="text-red-500 text-sm">
                        {errors.hardware}
                      </div>
                    )}
                  </div>

                  {/* Furniture */}
                  <div>
                    <Label text="Furniture : " required />
                    <Field
                      name="furniture"
                      placeholder="Furniture"
                      component={InputField}
                      type="text"
                    />
                    {touched.furniture && errors.furniture && (
                      <div className="text-red-500 text-sm">
                        {errors.furniture}
                      </div>
                    )}
                  </div>

                  {/* IT Equipment */}
                  <div>
                    <Label text="IT Equipment : " required />
                    <Field
                      name="itEquipment"
                      placeholder="IT Equipment"
                      component={InputField}
                      type="text"
                    />
                    {touched.itEquipment && errors.itEquipment && (
                      <div className="text-red-500 text-sm">
                        {errors.itEquipment}
                      </div>
                    )}
                  </div>

                  {/* Cleaning Material */}
                  <div>
                    <Label text="Cleaning Material : " required />
                    <Field
                      name="cleaningMaterial"
                      placeholder="Cleaning Material"
                      component={InputField}
                      type="text"
                    />
                    {touched.cleaningMaterial && errors.cleaningMaterial && (
                      <div className="text-red-500 text-sm">
                        {errors.cleaningMaterial}
                      </div>
                    )}
                  </div>

                  {/* Raw Material */}
                  <div>
                    <Label text="Raw Material : " required />
                    <Field
                      name="rawMaterial"
                      placeholder="Raw Material"
                      component={InputField}
                      type="text"
                    />
                    {touched.rawMaterial && errors.rawMaterial && (
                      <div className="text-red-500 text-sm">
                        {errors.rawMaterial}
                      </div>
                    )}
                  </div>

                  {/* Finished Goods */}
                  <div>
                    <Label text="Finished Goods : " required />
                    <Field
                      name="finishedGoods"
                      placeholder="Finished Goods"
                      component={InputField}
                      type="text"
                    />
                    {touched.finishedGoods && errors.finishedGoods && (
                      <div className="text-red-500 text-sm">
                        {errors.finishedGoods}
                      </div>
                    )}
                  </div>

                  {/* Mapped Store */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label text="Mapped Store : " required />
                    <Field
                      name="mappedStore"
                      placeholder="e.g. Electrical Store, General Store"
                      component={InputField}
                      type="text"
                    />
                    {touched.mappedStore && errors.mappedStore && (
                      <div className="text-red-500 text-sm">
                        {errors.mappedStore}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() => navigate("FrmMaterialTypeMasterList")}
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

export default FrmMaterialTypeMaster;
