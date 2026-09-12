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

  const [initialValues, setInitialValues] = useState({
    materialTypeCode: "",
    materialTypeName: "",
    description: "",
    status: "A",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMaterialTypeById = async () => {
      if (mode !== "1" && materialTypeId) {
        try {
          setLoading(true);

          // Replace with actual API when ready
          // const payload = {
          //   ulbId: Number(ulbId),
          //   materialTypeId: Number(materialTypeId),
          // };
          // const { data } = await apiService.post(
          //   "GetMaterialTypeById",
          //   payload
          // );

          // Dummy data for edit testing
          const data = {
            MATERIAL_TYPE_CODE: "MT001",
            MATERIAL_TYPE_NAME: "Consumable",
            DESCRIPTION: "Materials consumed during normal operations",
            STATUS: "A",
            REMARKS: "General consumable materials",
          };

          setInitialValues({
            materialTypeCode: data.MATERIAL_TYPE_CODE || "",
            materialTypeName: data.MATERIAL_TYPE_NAME || "",
            description: data.DESCRIPTION || "",
            status: data.STATUS || "A",
            remarks: data.REMARKS || "",
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

        in_materialTypeCode: values.materialTypeCode,
        in_materialTypeName: values.materialTypeName,
        in_description: values.description,
        in_status: values.status,
        in_remarks: values.remarks,

        in_ipaddress: ip,
        in_source: config.source,
      };

      console.log("Material Type Payload:", payload);

      // Replace with actual API when ready
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

                  {/* Material Type Code */}
                  <div>
                    <Label text="Material Type Code : " required />
                    <Field
                      name="materialTypeCode"
                      placeholder="e.g. MT001"
                      component={InputField}
                      type="text"
                    />
                    {touched.materialTypeCode && errors.materialTypeCode && (
                      <div className="text-red-500 text-sm">
                        {errors.materialTypeCode}
                      </div>
                    )}
                  </div>

                  {/* Material Type Name */}
                  <div>
                    <Label text="Material Type Name : " required />
                    <Field
                      name="materialTypeName"
                      placeholder="e.g. Consumable"
                      component={InputField}
                      type="text"
                    />
                    {touched.materialTypeName && errors.materialTypeName && (
                      <div className="text-red-500 text-sm">
                        {errors.materialTypeName}
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

                  {/* Description */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label text="Description : " />
                    <Field
                      name="description"
                      placeholder="Enter material type description"
                      component={InputField}
                      type="text"
                    />
                    {touched.description && errors.description && (
                      <div className="text-red-500 text-sm">
                        {errors.description}
                      </div>
                    )}
                  </div>

                  {/* Remarks */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label text="Remarks : " />
                    <Field
                      name="remarks"
                      placeholder="Enter remarks"
                      component={InputField}
                      type="text"
                    />
                    {touched.remarks && errors.remarks && (
                      <div className="text-red-500 text-sm">
                        {errors.remarks}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() => navigate("/Master/FrmMaterialTypeMasterList")}
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
