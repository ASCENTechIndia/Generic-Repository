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

const FrmLocationMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const locationId = queryParams.get("locationId");

  const [initialValues, setInitialValues] = useState({
    locationCode: "",
    locationName: "",
    locationType: "",
    address: "",
    contactPerson: "",
    status: "A",
    createdBy: "",
    createdDate: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocationById = async () => {
      if (mode !== "1" && locationId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), locationId: Number(locationId) };
          // const { data } = await apiService.post("GetLocationById", payload);

          // Dummy data for now
          const data = {
            LOCATION_CODE: "LOC001",
            LOCATION_NAME: "Central Warehouse",
            LOCATION_TYPE: "Warehouse",
            ADDRESS: "123 Main St",
            CONTACT_PERSON: "John Doe",
            STATUS: "A",
            CREATED_BY: "admin",
            CREATED_DATE: "2023-10-01",
          };

          setInitialValues({
            locationCode: data.LOCATION_CODE || "",
            locationName: data.LOCATION_NAME || "",
            locationType: data.LOCATION_TYPE || "",
            address: data.ADDRESS || "",
            contactPerson: data.CONTACT_PERSON || "",
            status: data.STATUS || "A",
            createdBy: data.CREATED_BY || "",
            createdDate: data.CREATED_DATE || "",
          });
        } catch (error) {
          console.error("Error fetching location by id:", error);
          alert("Failed to fetch location details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLocationById();
  }, [mode, locationId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_locationId: mode === "1" ? null : Number(locationId),
        in_locationCode: values.locationCode,
        in_locationName: values.locationName,
        in_locationType: values.locationType,
        in_address: values.address,
        in_contactPerson: values.contactPerson,
        in_status: values.status,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("LocationIns", payload);

      // Simulating success response
      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmLocationMasterList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving location:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Location Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Location Master",
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
            validationSchema={ValidationSchemas().FrmLocationMaster}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Location Code */}
                  <div>
                    <Label text="Location Code : " required />
                    <Field
                      name="locationCode"
                      placeholder="Location Code"
                      component={InputField}
                      type="text"
                    />
                    {touched.locationCode && errors.locationCode && (
                      <div className="text-red-500 text-sm">
                        {errors.locationCode}
                      </div>
                    )}
                  </div>

                  {/* Location Name */}
                  <div>
                    <Label text="Location Name : " required />
                    <Field
                      name="locationName"
                      placeholder="Location Name"
                      component={InputField}
                      type="text"
                    />
                    {touched.locationName && errors.locationName && (
                      <div className="text-red-500 text-sm">
                        {errors.locationName}
                      </div>
                    )}
                  </div>

                  {/* Location Type */}
                  <div>
                    <Label text="Location Type : " required />
                    <Field
                      name="locationType"
                      component={InputField}
                      type="dropdown"
                      options={[
                        { value: "Warehouse", label: "Warehouse" },
                        { value: "Hospital", label: "Hospital" },
                        { value: "Store", label: "Store" },
                        { value: "Event Venue", label: "Event Venue" },
                        { value: "Vendor Location", label: "Vendor Location" },
                      ]}
                    />
                    {touched.locationType && errors.locationType && (
                      <div className="text-red-500 text-sm">
                        {errors.locationType}
                      </div>
                    )}
                  </div>

                  {/* Contact Person */}
                  <div>
                    <Label text="Contact Person : " required />
                    <Field
                      name="contactPerson"
                      placeholder="Contact Person"
                      component={InputField}
                      type="text"
                    />
                    {touched.contactPerson && errors.contactPerson && (
                      <div className="text-red-500 text-sm">
                        {errors.contactPerson}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <Label text="Address : " required />
                    <Field
                      name="address"
                      placeholder="Address"
                      component={InputField}
                      type="text"
                    />
                    {touched.address && errors.address && (
                      <div className="text-red-500 text-sm">
                        {errors.address}
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

                  {/* Created By (Read Only) */}
                  <div>
                    <Label text="Created By : " />
                    <Field
                      name="createdBy"
                      placeholder="Created By"
                      component={InputField}
                      type="text"
                      disabled
                    />
                  </div>

                  {/* Created Date (Read Only) */}
                  <div>
                    <Label text="Created Date : " />
                    <Field
                      name="createdDate"
                      placeholder="Created Date"
                      component={InputField}
                      type="text"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() => navigate("/Master/FrmLocationMasterList")}
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

export default FrmLocationMaster;
