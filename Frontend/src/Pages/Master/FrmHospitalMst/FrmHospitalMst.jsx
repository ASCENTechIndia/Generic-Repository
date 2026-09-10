import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Layout from "../../../Components/Layout";
import HeaderLabel from "../../../Components/HeaderLabel";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../../../../apiService";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { useAuth } from "../../../Context/AuthContext";

const FrmHospitalMst = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const hospitalId = queryParams.get("hospitalId");

  const [initialValues, setInitialValues] = useState({
    name: "",
    address: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  // Autofill when editing
  useEffect(() => {
    const fetchHospitalById = async () => {
      if (mode !== "1" && hospitalId) {
        try {
          setLoading(true);
          const payload = {
            ulbId: Number(ulbId),
            hospitalId: Number(hospitalId),
          };
          const { data } = await apiService.post("hospitalgetbyId", payload);

          if (data) {
            setInitialValues({
              name: data.VAR_HOSPITAL_NAME || "",
              address: data.VAR_HOSPITAL_LOCATION || "",
              status: data.VAR_HOSPITAL_ACTIVEFLAG || "",
            });
          }
        } catch (error) {
          console.error("Error fetching hospital by id:", error);
          alert("Failed to fetch hospital details.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (ulbId) {
      fetchHospitalById();
    }
  }, [mode, hospitalId, ulbId]);

  // Submit handler
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_ulbid: Number(ulbId),
        in_mode: Number(mode),
        in_hospitalId: mode === "1" ? null : Number(hospitalId),
        in_hospitalName: values.name,
        in_location: values.address,
        in_activeFlag: values.status,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("hospitalins", payload);

      if (res?.data.errorCode === 9999) {
        alert(res.data.message || "Saved successfully");
        resetForm();
        navigate("/Master/FrmHospitalList");
      } else {
        alert(res?.data.message || "Failed to save hospital");
      }
    } catch (error) {
      console.error("Error while saving hospital:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Hospital / Dispensary List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Hospital / Dispensary List",
      }}
    >
      <div>
        {/* <HeaderLabel
          text="Hospital / Dispensary List"
          size="text-l"
          align="text-left"
        /> */}

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
            {() => (
              <Form className="w-full space-y-6">
                <div>
                  <Label text="Hospital / Dispensary Name :" required />
                  <Field
                    name="name"
                    placeholder="Hospital Name"
                    className="form-input-box"
                  />
                </div>

                <div>
                  <Label text="Hospital / Dispensary Address :" required />
                  <Field
                    name="address"
                    placeholder="Hospital Address"
                    className="form-input-box"
                  />
                </div>

                <div>
                  <Label text="Status :" required />
                  <div className="flex gap-4">
                    <label>
                      <Field type="radio" name="status" value="A" />
                      Active
                    </label>
                    <label>
                      <Field type="radio" name="status" value="I" />
                      Inactive
                    </label>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button type="submit" className="bg-green-500 text-white">
                    {mode === "1" ? "Save" : "Update"}
                  </Button>
                  <Button
                    type="button"
                    className="bg-gray-400 text-white"
                    onClick={() => navigate("/Master/FrmHospitalList")}
                  >
                    Cancel
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

export default FrmHospitalMst;
