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

const FrmUnitMeasureMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const uomId = queryParams.get("uomId");

  // ✅ 10 Text Fields as requested
  const [initialValues, setInitialValues] = useState({
    nos: "",
    kg: "",
    gram: "",
    liter: "",
    meter: "",
    box: "",
    packet: "",
    piece: "",
    dozen: "",
    set: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUOMById = async () => {
      if (mode !== "1" && uomId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), uomId: Number(uomId) };
          // const { data } = await apiService.post("GetUOMById", payload);

          // Dummy data for now
          const data = {
            NOS: "10",
            KG: "5",
            GRAM: "500",
            LITER: "2",
            METER: "10",
            BOX: "1",
            PACKET: "5",
            PIECE: "10",
            DOZEN: "2",
            SET: "1",
          };

          setInitialValues({
            nos: data.NOS || "",
            kg: data.KG || "",
            gram: data.GRAM || "",
            liter: data.LITER || "",
            meter: data.METER || "",
            box: data.BOX || "",
            packet: data.PACKET || "",
            piece: data.PIECE || "",
            dozen: data.DOZEN || "",
            set: data.SET || "",
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
  }, [mode, uomId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_uomId: mode === "1" ? null : Number(uomId),
        in_nos: values.nos,
        in_kg: values.kg,
        in_gram: values.gram,
        in_liter: values.liter,
        in_meter: values.meter,
        in_box: values.box,
        in_packet: values.packet,
        in_piece: values.piece,
        in_dozen: values.dozen,
        in_set: values.set,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("UOMIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmUnitMeasureMasterList");
      } else {
        alert(res?.data.errorMessage);
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
            validationSchema={ValidationSchemas().FrmUnitMeasureMaster}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Nos */}
                  <div>
                    <Label text="Nos : " required />
                    <Field
                      name="nos"
                      placeholder="Nos"
                      component={InputField}
                      type="text"
                    />
                    {touched.nos && errors.nos && (
                      <div className="text-red-500 text-sm">{errors.nos}</div>
                    )}
                  </div>

                  {/* Kg */}
                  <div>
                    <Label text="Kg : " required />
                    <Field
                      name="kg"
                      placeholder="Kg"
                      component={InputField}
                      type="text"
                    />
                    {touched.kg && errors.kg && (
                      <div className="text-red-500 text-sm">{errors.kg}</div>
                    )}
                  </div>

                  {/* Gram */}
                  <div>
                    <Label text="Gram : " required />
                    <Field
                      name="gram"
                      placeholder="Gram"
                      component={InputField}
                      type="text"
                    />
                    {touched.gram && errors.gram && (
                      <div className="text-red-500 text-sm">{errors.gram}</div>
                    )}
                  </div>

                  {/* Liter */}
                  <div>
                    <Label text="Liter : " required />
                    <Field
                      name="liter"
                      placeholder="Liter"
                      component={InputField}
                      type="text"
                    />
                    {touched.liter && errors.liter && (
                      <div className="text-red-500 text-sm">{errors.liter}</div>
                    )}
                  </div>

                  {/* Meter */}
                  <div>
                    <Label text="Meter : " required />
                    <Field
                      name="meter"
                      placeholder="Meter"
                      component={InputField}
                      type="text"
                    />
                    {touched.meter && errors.meter && (
                      <div className="text-red-500 text-sm">{errors.meter}</div>
                    )}
                  </div>

                  {/* Box */}
                  <div>
                    <Label text="Box : " required />
                    <Field
                      name="box"
                      placeholder="Box"
                      component={InputField}
                      type="text"
                    />
                    {touched.box && errors.box && (
                      <div className="text-red-500 text-sm">{errors.box}</div>
                    )}
                  </div>

                  {/* Packet */}
                  <div>
                    <Label text="Packet : " required />
                    <Field
                      name="packet"
                      placeholder="Packet"
                      component={InputField}
                      type="text"
                    />
                    {touched.packet && errors.packet && (
                      <div className="text-red-500 text-sm">
                        {errors.packet}
                      </div>
                    )}
                  </div>

                  {/* Piece */}
                  <div>
                    <Label text="Piece : " required />
                    <Field
                      name="piece"
                      placeholder="Piece"
                      component={InputField}
                      type="text"
                    />
                    {touched.piece && errors.piece && (
                      <div className="text-red-500 text-sm">{errors.piece}</div>
                    )}
                  </div>

                  {/* Dozen */}
                  <div>
                    <Label text="Dozen : " required />
                    <Field
                      name="dozen"
                      placeholder="Dozen"
                      component={InputField}
                      type="text"
                    />
                    {touched.dozen && errors.dozen && (
                      <div className="text-red-500 text-sm">{errors.dozen}</div>
                    )}
                  </div>

                  {/* Set */}
                  <div>
                    <Label text="Set : " required />
                    <Field
                      name="set"
                      placeholder="Set"
                      component={InputField}
                      type="text"
                    />
                    {touched.set && errors.set && (
                      <div className="text-red-500 text-sm">{errors.set}</div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() => navigate("/Master/FrmUnitMeasureMasterList")}
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
