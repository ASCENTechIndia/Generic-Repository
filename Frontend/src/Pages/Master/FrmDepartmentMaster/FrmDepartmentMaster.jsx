import React, { useState, useEffect } from "react";
import Layout from "../../../Components/Layout";
import HeaderLabel from "../../../Components/HeaderLabel";
import { Field, Form, Formik } from "formik";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import InputField from "../../../Components/InputField";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";

const FrmDepartmentMaster = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // ✅ FIXED: useNavigate instead of Navigate()

  const mode = searchParams.get("mode");
  const deptId = searchParams.get("deptId");

  const [initialValues, setInitialValues] = useState({
    facilityId: "",
    deptName: "",
    deptType: "",
    flag: "",
  });

  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuth();
  const [facilities, setFacilities] = useState([]);

  // ✅ Fetch Facility List
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await apiService.post("GetFacilityActiveList", {
          ulbId: user.ulbId,
        });
        if (res?.data) setFacilities(res.data);
      } catch (error) {
        console.error("Error fetching facility list:", error);
      }
    };
    if (user?.ulbId) fetchFacilities();
  }, [user?.ulbId]);

  // ✅ Fetch Department Data when editing
  useEffect(() => {
    const fetchDepartmentData = async () => {
      if (mode === "2" && deptId) {
        try {
          const payload = { deptId: parseInt(deptId) };
          const { data } = await apiService.post("GetListById", payload);

          if (data) {
            setInitialValues({
              facilityId:
                data.NUM_DEPT_FACILITYID &&
                !isNaN(Number(data.NUM_DEPT_FACILITYID))
                  ? String(data.NUM_DEPT_FACILITYID)
                  : "",
              deptName: data.VAR_DEPT_NAME ?? "",
              deptType: data.VAR_DEPT_TYPE ?? "",
              flag: data.VAR_DEPT_FLAG ?? "",
            });
          }
        } catch (error) {
          console.error("Error fetching department data:", error);
          setMessage("Failed to load department data.");
          setIsSuccess(false);
        }
      }
    };
    fetchDepartmentData();
  }, [mode, deptId]);

  // ✅ Handle Form Submit
  const handleSubmit = async (values, { resetForm }) => {
    setMessage(null);
    try {
      const apiMode = mode === "2" ? 2 : 1;
      const facilityIdValue = values.facilityId ? Number(values.facilityId) : 0;

      const payload = {
        in_userId: user.userId,
        in_mode: apiMode,
        in_ulbId: Number(user.ulbId),
        in_deptId: apiMode === 2 ? parseInt(deptId) : null,
        in_facilityId: facilityIdValue,
        in_deptName: values.deptName,
        in_deptType: values.deptType,
        in_flag: values.flag,
        in_ipaddress: window.location.hostname || "127.0.0.1",
        in_source: "WEB",
      };

      const res = await apiService.post("AoinDeptIns", payload);

      if (res?.data?.errorCode === 9999) {
        alert(
          res.data.errorMessage ||
            `${apiMode === 1 ? "Inserted" : "Updated"} Successfully`
        );
        setIsSuccess(true);
        if (apiMode === 1) resetForm();

        // ✅ Redirect to Department List after success
        navigate("/Master/FrmDepartmentList");
      } else {
        setMessage(res?.data?.errorMessage || "Something went wrong");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error, please try again later.");
      setIsSuccess(false);
    }
  };

  return (
    <Layout
      title="Department Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Department Master",
      }}
    >
      <div >
        {/* <HeaderLabel
          text={mode === "2" ? "Edit Department" : "Add Department"}
          size="text-xl"
          align="text-left"
        /> */}

        {/* ✅ Display API Message */}
        {message && (
          <div
            className={`my-3 p-3 rounded-md text-sm font-medium ${
              isSuccess
                ? "bg-green-50 border-l-4 border-green-400 text-green-800"
                : "bg-red-50 border-l-4 border-red-400 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={ValidationSchemas.FrmDepartmentMaster}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form className="w-full space-y-6">
              {/* Facility Dropdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label text="Facility Name" required />
                  <Field
                    as="select"
                    name="facilityId"
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Facility</option>
                    {facilities.map((facility) => (
                      <option
                        key={facility.FACILITY_ID}
                        value={facility.FACILITY_ID}
                      >
                        {facility.FACILITY_NAME}
                      </option>
                    ))}
                  </Field>
                  {touched.facilityId && errors.facilityId && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.facilityId}
                    </div>
                  )}
                </div>

                {/* Department Name */}
                <div>
                  <Label text="Department Name" required />
                  <Field
                    name="deptName"
                    placeholder="Department Name"
                    component={InputField}
                    type="text"
                  />
                  {touched.deptName && errors.deptName && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.deptName}
                    </div>
                  )}
                </div>

                {/* Department Type */}
                <div>
                  <Label text="Department Type" required />
                  <Field
                    name="deptType"
                    placeholder="Department Type"
                    component={InputField}
                    type="text"
                  />
                  {touched.deptType && errors.deptType && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.deptType}
                    </div>
                  )}
                </div>
              </div>

              {/* Flag Dropdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label text="Flag" required />
                  <Field
                    as="select"
                    name="flag"
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Flag</option>
                    <option value="A">Active</option>
                    <option value="I">Inactive</option>
                  </Field>
                  {touched.flag && errors.flag && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.flag}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center gap-3">
                <Button type="button" onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button type="submit" className="hover:cursor-pointer">
                  {mode === "2" ? "Update" : "Submit"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmDepartmentMaster;
