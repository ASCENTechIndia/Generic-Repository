import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Layout";
import { Form, Formik, Field } from "formik";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import InputField from "../../../Components/InputField";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const FrmUnitMeasureMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const uomId = queryParams.get("uomId");

  // Generic Inventory - Unit of Measure Master
  const [initialValues, setInitialValues] = useState({
    uomCode: "",
    uomName: "",
    uomShortName: "",
    uomCategoryId: "",
    decimalAllowed: "N",
    decimalPlaces: "0",
    description: "",
    status: "A",
  });

  const [loading, setLoading] = useState(false);

  // Temporary category list.
  // Replace this with your UOM Category Master API when that API is ready.
  const uomCategoryOptions = [
    { id: "1", name: "Quantity" },
    { id: "2", name: "Weight" },
    { id: "3", name: "Volume" },
    { id: "4", name: "Length" },
    { id: "5", name: "Area" },
    { id: "6", name: "Packaging" },
  ];

  useEffect(() => {
    const fetchUOMById = async () => {
      if (mode !== "1" && uomId) {
        try {
          setLoading(true);

          // Replace with actual API when ready:
          // const payload = {
          //   ulbId: Number(ulbId),
          //   uomId: Number(uomId),
          // };
          // const { data } = await apiService.post("GetUOMById", payload);

          // Dummy data for now
          const data = {
            UOM_ID: uomId,
            UOM_CODE: "KG",
            UOM_NAME: "Kilogram",
            UOM_SHORT_NAME: "Kg",
            UOM_CATEGORY_ID: "2",
            DECIMAL_ALLOWED: "Y",
            DECIMAL_PLACES: "3",
            DESCRIPTION: "Weight measurement unit",
            STATUS: "A",
          };

          setInitialValues({
            uomCode: data.UOM_CODE || "",
            uomName: data.UOM_NAME || "",
            uomShortName: data.UOM_SHORT_NAME || "",
            uomCategoryId: data.UOM_CATEGORY_ID || "",
            decimalAllowed: data.DECIMAL_ALLOWED || "N",
            decimalPlaces: data.DECIMAL_PLACES ?? "0",
            description: data.DESCRIPTION || "",
            status: data.STATUS || "A",
          });
        } catch (error) {
          console.error("Error fetching UOM by id:", error);
          alert("Failed to fetch UOM details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUOMById();
  }, [mode, uomId, ulbId]);

  const validate = (values) => {
    const errors = {};

    if (!values.uomCode?.trim()) {
      errors.uomCode = "UOM Code is required";
    }

    if (!values.uomName?.trim()) {
      errors.uomName = "UOM Name is required";
    }

    if (!values.uomShortName?.trim()) {
      errors.uomShortName = "UOM Short Name is required";
    }

    if (!values.uomCategoryId) {
      errors.uomCategoryId = "UOM Category is required";
    }

    if (!values.decimalAllowed) {
      errors.decimalAllowed = "Decimal Allowed is required";
    }

    if (
      values.decimalAllowed === "Y" &&
      (values.decimalPlaces === "" ||
        values.decimalPlaces === null ||
        Number(values.decimalPlaces) < 1)
    ) {
      errors.decimalPlaces = "Decimal Places is required when decimal is allowed";
    }

    if (Number(values.decimalPlaces) < 0) {
      errors.decimalPlaces = "Decimal Places cannot be negative";
    }

    if (!values.status) {
      errors.status = "Status is required";
    }

    return errors;
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_uomId: mode === "1" ? null : Number(uomId),

        in_uomCode: values.uomCode.trim(),
        in_uomName: values.uomName.trim(),
        in_uomShortName: values.uomShortName.trim(),
        in_uomCategoryId: Number(values.uomCategoryId),
        in_decimalAllowed: values.decimalAllowed,
        in_decimalPlaces:
          values.decimalAllowed === "Y"
            ? Number(values.decimalPlaces)
            : 0,
        in_description: values.description?.trim() || null,
        in_status: values.status,

        in_ipaddress: ip,
        in_source: config.source,
      };

      // Replace with actual API when ready:
      // const res = await apiService.post("UOMIns", payload);

      // Mock API response for now
      const res = {
        data: {
          errorCode: 9999,
          errorMessage:
            mode === "1"
              ? "UOM saved successfully"
              : "UOM updated successfully",
        },
      };

      console.log("UOM Payload:", payload);

      if (res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmUnitMeasureMasterList");
      } else {
        alert(res?.data?.errorMessage || "Unable to save UOM.");
      }
    } catch (error) {
      console.error("Error while saving UOM:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Unit of Measure Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "UOM Master",
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
            validate={validate}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

                  {/* UOM Code */}
                  <div>
                    <Label text="UOM Code : " required />
                    <Field
                      name="uomCode"
                      placeholder="Example: KG, NOS, BOX"
                      component={InputField}
                      type="text"
                    />
                    {touched.uomCode && errors.uomCode && (
                      <div className="text-red-500 text-sm">
                        {errors.uomCode}
                      </div>
                    )}
                  </div>

                  {/* UOM Name */}
                  <div>
                    <Label text="UOM Name : " required />
                    <Field
                      name="uomName"
                      placeholder="Example: Kilogram"
                      component={InputField}
                      type="text"
                    />
                    {touched.uomName && errors.uomName && (
                      <div className="text-red-500 text-sm">
                        {errors.uomName}
                      </div>
                    )}
                  </div>

                  {/* UOM Short Name */}
                  <div>
                    <Label text="UOM Short Name : " required />
                    <Field
                      name="uomShortName"
                      placeholder="Example: Kg"
                      component={InputField}
                      type="text"
                    />
                    {touched.uomShortName && errors.uomShortName && (
                      <div className="text-red-500 text-sm">
                        {errors.uomShortName}
                      </div>
                    )}
                  </div>

                  {/* UOM Category */}
                  <div>
                    <Label text="UOM Category : " required />
                    <Field
                      as="select"
                      name="uomCategoryId"
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select UOM Category</option>
                      {uomCategoryOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Field>
                    {touched.uomCategoryId && errors.uomCategoryId && (
                      <div className="text-red-500 text-sm">
                        {errors.uomCategoryId}
                      </div>
                    )}
                  </div>

                  {/* Decimal Allowed */}
                  <div>
                    <Label text="Decimal Allowed : " required />
                    <Field
                      as="select"
                      name="decimalAllowed"
                      className="w-full border rounded px-3 py-2"
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue("decimalAllowed", value);

                        if (value === "N") {
                          setFieldValue("decimalPlaces", "0");
                        } else if (
                          !values.decimalPlaces ||
                          Number(values.decimalPlaces) === 0
                        ) {
                          setFieldValue("decimalPlaces", "2");
                        }
                      }}
                    >
                      <option value="Y">Yes</option>
                      <option value="N">No</option>
                    </Field>
                    {touched.decimalAllowed && errors.decimalAllowed && (
                      <div className="text-red-500 text-sm">
                        {errors.decimalAllowed}
                      </div>
                    )}
                  </div>

                  {/* Decimal Places */}
                  <div>
                    <Label
                      text="Decimal Places : "
                      required={values.decimalAllowed === "Y"}
                    />
                    <Field
                      name="decimalPlaces"
                      placeholder="Example: 2"
                      component={InputField}
                      type="number"
                      min="0"
                      max="6"
                      disabled={values.decimalAllowed !== "Y"}
                    />
                    {touched.decimalPlaces && errors.decimalPlaces && (
                      <div className="text-red-500 text-sm">
                        {errors.decimalPlaces}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 lg:col-span-2">
                    <Label text="Description : " />
                    <Field
                      name="description"
                      placeholder="Enter description"
                      component={InputField}
                      type="text"
                    />
                    {touched.description && errors.description && (
                      <div className="text-red-500 text-sm">
                        {errors.description}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <Label text="Status : " required />
                    <Field
                      as="select"
                      name="status"
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="A">Active</option>
                      <option value="I">Inactive</option>
                    </Field>
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
                    onClick={() =>
                      navigate("/Master/FrmUnitMeasureMasterList")
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

export default FrmUnitMeasureMaster;
