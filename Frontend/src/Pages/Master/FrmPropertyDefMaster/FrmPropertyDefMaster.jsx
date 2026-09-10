
import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Layout";
import HeaderLabel from "../../../Components/HeaderLabel";
import { Form, Formik, Field } from "formik";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import InputField from "../../../Components/InputField";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const FrmPropertyDefMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  // read query params (mode + id)
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const propertyDefId = queryParams.get("propertyDefId");

  // initial form values
  const [initialValues, setInitialValues] = useState({
    entityType: "",
    propertyName: "",
    displayLabel: "",
    dataType: "",
    required: "N",
    flag: "Y", // ✅ default "Y"
  });

  const [loading, setLoading] = useState(false);

  // fetch existing property if editing
  useEffect(() => {
    const fetchPropertyById = async () => {
      if (mode !== "1" && propertyDefId) {
        try {
          setLoading(true);
          const payload = {
            ulbId: Number(ulbId),
            propertyDefId: Number(propertyDefId),
          };

          const { data } = await apiService.post("GetPropertyDefById", payload);

          if (data) {
            setInitialValues({
              entityType: data.ENTITY_TYPE || "",
              propertyName: data.PROPERTY_NAME || "",
              displayLabel: data.DISPLAY_LABEL || "",
              dataType: data.DATA_TYPE || "",
              required: data.REQUIRED || "N",
              flag: data.FLAG || "Y", // ✅ use "Y/N"
            });
          }
        } catch (error) {
          console.error("Error fetching property def by id:", error);
          alert("Failed to fetch property definition details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPropertyById();
  }, [mode, propertyDefId, ulbId, user]);

  // handle submit
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: Number(mode),
        in_ulbId: Number(ulbId),
        in_propertyDefId: mode === "1" ? null : Number(propertyDefId),
        in_entityType: values.entityType,
        in_propertyName: values.propertyName,
        in_displayLabel: values.displayLabel,
        in_dataType: values.dataType.toUpperCase(),
        in_allowedValues: null,
        in_required: values.required,
        in_sortOrder: 1, // ✅ default
        in_flag: values.flag, // ✅ Y/N
        in_ipaddress: ip,
        in_source: config.source || "WEB",
      };

      console.log("Submitting property definition:", payload);

      const res = await apiService.post("AoinPropertyIns", payload);

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        // navigate("/Master/FrmPropertyDefList"); // redirect to list
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving property:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Property Definition Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Property Definition Master",
      }}
    >
      <div>
        {/* <HeaderLabel
          text="Property Definition Master"
          size="text-l"
          align="text-left"
        /> */}

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
            {() => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Entity Type */}
                  <div>
                    <Label text="Entity Type :" required />
                    <Field
                      name="entityType"
                      placeholder="Enter entity type"
                      component={InputField}
                      type="text"
                    />
                  </div>

                  {/* Property Name */}
                  <div>
                    <Label text="Property Name :" required />
                    <Field
                      name="propertyName"
                      placeholder="Enter property name"
                      component={InputField}
                      type="text"
                    />
                  </div>

                  {/* Display Label */}
                  <div>
                    <Label text="Display Label :" required />
                    <Field
                      name="displayLabel"
                      placeholder="Enter display label"
                      component={InputField}
                      type="text"
                    />
                  </div>

                  {/* Data Type */}
                  <div>
                    <Label text="Data Type :" required />
                    <Field
                      name="dataType"
                      component={InputField}
                      type="dropdown"
                      options={[
                        { value: "STRING", label: "String" },
                        { value: "NUMBER", label: "Number" },
                        { value: "DATE", label: "Date" },
                        { value: "BOOLEAN", label: "Boolean" },
                      ]}
                    />
                  </div>

                  {/* Required */}
                  <div>
                    <Label text="Required :" required />
                    <Field
                      name="required"
                      component={InputField}
                      type="dropdown"
                      options={[
                        { value: "Y", label: "Yes" },
                        { value: "N", label: "No" },
                      ]}
                    />
                  </div>

                  {/* Flag */}
                  <div>
                    <Label text="Flag :" required />
                    <Field
                      name="flag"
                      component={InputField}
                      type="dropdown"
                      options={[
                        { value: "Y", label: "Active" },
                        { value: "N", label: "Inactive" },
                      ]}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
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

export default FrmPropertyDefMaster;
