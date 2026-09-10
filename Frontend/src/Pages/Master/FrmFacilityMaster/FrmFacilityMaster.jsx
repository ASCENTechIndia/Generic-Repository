import React, { useState, useEffect } from "react";
import Layout from "../../../Components/Layout";
import HeaderLabel from "../../../Components/HeaderLabel";
import { Form, Formik, Field } from "formik";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import InputField from "../../../Components/InputField"; // ✅ Formik-compatible input
import { useLoader } from "../../../Context/LoaderContext";

const FrmFacilityMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1";
  const facilityId = queryParams.get("facilityId");

  const [initialValues, setInitialValues] = useState({
    facilityName: "",
    facilityType: "",
    facilityLoc: "",
    parentFacilityId: "",
    flag: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFacilityById = async () => {
      if (mode !== "1" && facilityId) {
        try {
          setLoading(true);
          const payload = {
            ulbId: Number(ulbId),
            facilityId: Number(facilityId),
          };

          const { data } = await apiService.post("GetFacilityById", payload);
          console.log("Facility API response:", data);

          // If API returns an array, take the first element
          const facility = Array.isArray(data) ? data[0] : data;

          if (facility) {
            setInitialValues({
              facilityName:
                facility.facilityName || facility.FACILITY_NAME || "",
              facilityType:
                facility.facilityType || facility.FACILITY_TYPE || "",
              facilityLoc:
                facility.facilityLoc ||
                facility.FACILITY_LOC ||
                facility.FACILITY_LOCATION ||
                "",
              parentFacilityId:
                facility.parentFacilityId || facility.PARENT_FACILITY_ID || "",
              flag: facility.flag || facility.FACILITY_FLAG || "",
            });
          }
        } catch (error) {
          console.error("Error fetching facility by id:", error);
          alert("Failed to fetch facility details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFacilityById();
  }, [mode, facilityId, ulbId]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();
      const payload = {
        in_userId: userId,
        in_mode: Number(mode),
        in_ulbId: Number(ulbId),
        in_facilityId: mode === "1" ? null : Number(facilityId),
        in_facilityName: values.facilityName,
        in_facilityType: values.facilityType,
        in_facilityLoc: values.facilityLoc,
        in_parentFacId: null, // parent facility not used for now
        in_flag: values.flag,
        in_ipaddress: ip,
        in_source: config.source || "WEB",
      };

      const res = await apiService.post("AoinFacitilyIns", payload);

      if (res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage || "Operation Successful");
        resetForm();
        navigate("/Master/FrmFacilityList");
      } else {
        alert(res?.data?.errorMessage || "Something went wrong");
      }
    } catch (error) {
      console.error("Error while saving facility:", error);
      alert("Server error, please try again later.");
    }
  };

  return (
    <Layout
      title="Facility Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Facility Master",
      }}
    >
      <div>
        {/* <HeaderLabel text="Facility Master" size="text-l" align="text-left" /> */}

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={ValidationSchemas().FrmFacilityMaster}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <Label text="Facility Name : " required />
                    <Field
                      name="facilityName"
                      placeholder="Facility Name"
                      component={InputField}
                      type="text"
                    />
                    {touched.facilityName && errors.facilityName && (
                      <div className="text-red-500 text-sm">
                        {errors.facilityName}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label text="Facility Type: " required />
                    <Field
                      name="facilityType"
                      placeholder="Facility Type"
                      component={InputField}
                      type="text"
                    />
                    {touched.facilityType && errors.facilityType && (
                      <div className="text-red-500 text-sm">
                        {errors.facilityType}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label text="Facility Location: " required />
                    <Field
                      name="facilityLoc"
                      placeholder="Facility Location"
                      component={InputField}
                      type="text"
                    />
                    {touched.facilityLoc && errors.facilityLoc && (
                      <div className="text-red-500 text-sm">
                        {errors.facilityLoc}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <Label text="Flag : " required />
                    <Field
                      name="flag"
                      component={InputField}
                      type="dropdown"
                      options={[
                        { value: "A", label: "Active" },
                        { value: "I", label: "In-Active" },
                      ]}
                    />
                    {touched.flag && errors.flag && (
                      <div className="text-red-500 text-sm">{errors.flag}</div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
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

export default FrmFacilityMaster;
