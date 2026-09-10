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

const FrmMaterialMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const materialId = queryParams.get("materialId");

  const [initialValues, setInitialValues] = useState({
    materialCode: "",
    materialName: "",
    materialType: "",
    category: "",
    subCategory: "",
    uom: "",
    manufacturer: "",
    brand: "",
    specification: "",
    description: "",
    hsnCode: "",
    reorderLevel: "",
    minimumStock: "",
    maximumStock: "",
    status: "A",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMaterialById = async () => {
      if (mode !== "1" && materialId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), materialId: Number(materialId) };
          // const { data } = await apiService.post("GetMaterialById", payload);

          // Dummy data for now
          const data = {
            MATERIAL_CODE: "MAT001",
            MATERIAL_NAME: "Paracetamol 500mg",
            MATERIAL_TYPE: "Medical",
            CATEGORY: "Tablets",
            SUB_CATEGORY: "Painkiller",
            UOM: "Strip",
            MANUFACTURER: "Cipla",
            BRAND: "Cipla",
            SPECIFICATION: "500mg",
            DESCRIPTION: "Pain relief tablet",
            HSN_CODE: "30049099",
            REORDER_LEVEL: "100",
            MINIMUM_STOCK: "50",
            MAXIMUM_STOCK: "500",
            STATUS: "A",
          };

          setInitialValues({
            materialCode: data.MATERIAL_CODE || "",
            materialName: data.MATERIAL_NAME || "",
            materialType: data.MATERIAL_TYPE || "",
            category: data.CATEGORY || "",
            subCategory: data.SUB_CATEGORY || "",
            uom: data.UOM || "",
            manufacturer: data.MANUFACTURER || "",
            brand: data.BRAND || "",
            specification: data.SPECIFICATION || "",
            description: data.DESCRIPTION || "",
            hsnCode: data.HSN_CODE || "",
            reorderLevel: data.REORDER_LEVEL || "",
            minimumStock: data.MINIMUM_STOCK || "",
            maximumStock: data.MAXIMUM_STOCK || "",
            status: data.STATUS || "A",
          });
        } catch (error) {
          console.error("Error fetching material by id:", error);
          alert("Failed to fetch material details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMaterialById();
  }, [mode, materialId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_materialId: mode === "1" ? null : Number(materialId),
        in_materialCode: values.materialCode,
        in_materialName: values.materialName,
        in_materialType: values.materialType,
        in_category: values.category,
        in_subCategory: values.subCategory,
        in_uom: values.uom,
        in_manufacturer: values.manufacturer,
        in_brand: values.brand,
        in_specification: values.specification,
        in_description: values.description,
        in_hsnCode: values.hsnCode,
        in_reorderLevel: values.reorderLevel,
        in_minimumStock: values.minimumStock,
        in_maximumStock: values.maximumStock,
        in_status: values.status,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("MaterialIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmMaterialMasterList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving material:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Material Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Material Master",
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
            validationSchema={ValidationSchemas().FrmMaterialMaster}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Material Code */}
                  <div>
                    <Label text="Material Code : " required />
                    <Field
                      name="materialCode"
                      placeholder="e.g. MAT001"
                      component={InputField}
                      type="text"
                    />
                    {touched.materialCode && errors.materialCode && (
                      <div className="text-red-500 text-sm">
                        {errors.materialCode}
                      </div>
                    )}
                  </div>

                  {/* Material Name */}
                  <div>
                    <Label text="Material Name : " required />
                    <Field
                      name="materialName"
                      placeholder="e.g. Paracetamol 500mg"
                      component={InputField}
                      type="text"
                    />
                    {touched.materialName && errors.materialName && (
                      <div className="text-red-500 text-sm">
                        {errors.materialName}
                      </div>
                    )}
                  </div>

                  {/* Material Type */}
                  <div>
                    <Label text="Material Type : " required />
                    <Field
                      name="materialType"
                      placeholder="e.g. Medical, General, Event"
                      component={InputField}
                      type="text"
                    />
                    {touched.materialType && errors.materialType && (
                      <div className="text-red-500 text-sm">
                        {errors.materialType}
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <Label text="Category : " required />
                    <Field
                      name="category"
                      placeholder="e.g. Tablets"
                      component={InputField}
                      type="text"
                    />
                    {touched.category && errors.category && (
                      <div className="text-red-500 text-sm">
                        {errors.category}
                      </div>
                    )}
                  </div>

                  {/* Sub Category */}
                  <div>
                    <Label text="Sub Category : " required />
                    <Field
                      name="subCategory"
                      placeholder="e.g. Painkiller"
                      component={InputField}
                      type="text"
                    />
                    {touched.subCategory && errors.subCategory && (
                      <div className="text-red-500 text-sm">
                        {errors.subCategory}
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

                  {/* Manufacturer */}
                  <div>
                    <Label text="Manufacturer : " required />
                    <Field
                      name="manufacturer"
                      placeholder="e.g. Cipla"
                      component={InputField}
                      type="text"
                    />
                    {touched.manufacturer && errors.manufacturer && (
                      <div className="text-red-500 text-sm">
                        {errors.manufacturer}
                      </div>
                    )}
                  </div>

                  {/* Brand */}
                  <div>
                    <Label text="Brand : " required />
                    <Field
                      name="brand"
                      placeholder="e.g. Cipla"
                      component={InputField}
                      type="text"
                    />
                    {touched.brand && errors.brand && (
                      <div className="text-red-500 text-sm">{errors.brand}</div>
                    )}
                  </div>

                  {/* Specification */}
                  <div>
                    <Label text="Specification : " required />
                    <Field
                      name="specification"
                      placeholder="e.g. 500mg"
                      component={InputField}
                      type="text"
                    />
                    {touched.specification && errors.specification && (
                      <div className="text-red-500 text-sm">
                        {errors.specification}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <Label text="Description : " required />
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

                  {/* HSN Code */}
                  <div>
                    <Label text="HSN Code : " required />
                    <Field
                      name="hsnCode"
                      placeholder="e.g. 30049099"
                      component={InputField}
                      type="text"
                    />
                    {touched.hsnCode && errors.hsnCode && (
                      <div className="text-red-500 text-sm">
                        {errors.hsnCode}
                      </div>
                    )}
                  </div>

                  {/* Reorder Level */}
                  <div>
                    <Label text="Reorder Level : " required />
                    <Field
                      name="reorderLevel"
                      placeholder="e.g. 100"
                      component={InputField}
                      type="text"
                    />
                    {touched.reorderLevel && errors.reorderLevel && (
                      <div className="text-red-500 text-sm">
                        {errors.reorderLevel}
                      </div>
                    )}
                  </div>

                  {/* Minimum Stock */}
                  <div>
                    <Label text="Minimum Stock : " required />
                    <Field
                      name="minimumStock"
                      placeholder="e.g. 50"
                      component={InputField}
                      type="text"
                    />
                    {touched.minimumStock && errors.minimumStock && (
                      <div className="text-red-500 text-sm">
                        {errors.minimumStock}
                      </div>
                    )}
                  </div>

                  {/* Maximum Stock */}
                  <div>
                    <Label text="Maximum Stock : " required />
                    <Field
                      name="maximumStock"
                      placeholder="e.g. 500"
                      component={InputField}
                      type="text"
                    />
                    {touched.maximumStock && errors.maximumStock && (
                      <div className="text-red-500 text-sm">
                        {errors.maximumStock}
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
                  <Button
                    type="button"
                    onClick={() => navigate("/Master/FrmMaterialMasterlist")}
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

export default FrmMaterialMaster;
