import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../HOC/Navbar/Navbar";
import HeaderLabel from "../../../Components/HeaderLabel";
import Header from "../../../HOC/Header/Header";
import { Formik, Form, Field, ErrorMessage } from "formik";
import InputField from "../../../Components/InputField";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import TextArea from "../../../Components/TextArea";
import Table from "../../../Components/Table";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import { useAuth } from "../../../Context/AuthContext";
import config from "../../../utils/config";
import GetIPAddress from "../../../utils/ipHelper";
import { formatDatebyMonth } from "../../../utils/dateUtils";
import apiService from "../../../../apiService";
import { inputHandlers } from "../../../HOC/Validation/InputValidations";
import SidebarItem from "../../../Components/SidebarItem";
import { useLoader } from "../../../Context/LoaderContext";
import axios from "axios";
import GeneratePDF from "../../../Components/PDFButton/PrescriptionPDF";
import { pdf } from "@react-pdf/renderer";

const FrmPrescription = () => {
  const navigate = useNavigate();
  const updateSectionRef = useRef(null);
  const { setLoading } = useLoader();
  const formikRef = useRef();

  const { user } = useAuth();
  const userId = user?.userId;
  const ulbId = user?.ulbId;
  const corporation = user?.corporation;
  console.log("User ID:", userId);
  console.log("ULB ID:", ulbId);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionsTable, setPrescriptionsTable] = useState([]);
  const [consultId, setconsultId] = useState(null);

  const handleSelect = (item, setFieldValue) => {
    setSelectedPrescription(item);
    // setconsultId(res.data.NUM_PRESCRIPTION_CONSULTATIONID);
    fetchPrescriptionDetails(
      item.NUM_PRESCRIPTION_CONSULTATIONID,
      setFieldValue,
    );
    setTimeout(() => {
      if (updateSectionRef.current) {
        updateSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100); // small delay to ensure section is rendered
  };
  useEffect(() => {
    if (!ulbId) {
      return;
    }
    setLoading(true);
    apiService
      .post("getPrescriptionList", { ulbid: Number(ulbId) })
      .then((res) => {
        console.log("API Response:", res.data);
        const list = Array.isArray(res.data) ? res.data : [];
        setPrescriptionsTable(list);
      })
      .catch((err) => {
        console.error("Error fetching prescription list:", err);
        setPrescriptionsTable([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ulbId]);

  const addMedicine = (values, setFieldValue) => {
    setFieldValue("medicines", [
      ...values.medicines,
      {
        medicine: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };
  const removeMedicine = (index, values, setFieldValue) => {
    setFieldValue(
      "medicines",
      values.medicines.filter((_, i) => i !== index),
    );
  };

  const formatMedicines = (medicines) => {
    return medicines
      .map((med, index) => {
        return `${index + 1}#${med.medicine}#${med.dosage}#${med.frequency}#${med.duration}#${med.instructions}`;
      })
      .join("$"); // Join all with $
  };
  const fetchPrescriptionDetails = async (consultId, setFieldValue) => {
    try {
      setLoading(true);
      const res = await apiService.post("getPrescriptionDetails", {
        ulbid: ulbId,
        consultId: consultId,
      });
      const data = res.data;
      console.log("medi", res.data);
      if (Array.isArray(data)) {
        const meds = data.map((item) => ({
          medicine: item.VAR_PRESCRIPTION_MEDICINENAME || "",
          dosage: item.VAR_PRESCRIPTION_DOSAGE || "",
          frequency: item.VAR_PRESCRIPTION_FREQUENCY || "",
          duration: item.NUM_PRESCRIPTION_DURATIONDAYS?.toString() || "",
          instructions: item.VAR_PRESCRIPTION_INSTRUCTIONS || "",
        }));

        setFieldValue("medicines", meds);
      }
    } catch (error) {
      console.error("Error fetching prescription details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!userId) {
      alert("User ID not set");
      setSubmitting(false);
      return;
    }

    try {
      setLoading(true);
      const medicineStr = formatMedicines(values.medicines);
      const ip = await GetIPAddress();

   const payload = {
        In_userid: userId,
        In_prescriptionid: selectedPrescription?.NUM_PRESCRIPTION_ID || null,
        In_consultationid:
          selectedPrescription?.NUM_PRESCRIPTION_CONSULTATIONID,
        In_patientid: Number(values.patient),
        In_opdid: selectedPrescription?.NUM_PRESCRIPTION_OPDID,
        In_doctorid: selectedPrescription?.NUM_PRESCRIPTION_DOCTORID,
        In_prescrdate: formatDatebyMonth(values.date),
        In_language: values.language,
        In_status: values.status,
        In_str: medicineStr,
        In_ulbid: Number(ulbId),
        In_mode: selectedPrescription ? 2 : 1,
        in_priscflag: "N",
        In_ipaddress: ip,
        In_source: config.source,
      };

      console.log("Payload to send:", payload);
      const response = await apiService.post("aopd_prescription_ins", payload);

      const message =
        response.data?.errorMessage || "Patient registered successfully!";
      alert(message);
      await handleDownload(
        selectedPrescription?.NUM_PRESCRIPTION_CONSULTATIONID,
        ulbId,
      );
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Something went wrong! Please try again.");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleDownload = async (consultId, ulbId) => {
    try {
      setLoading(true);
      const { data } = await apiService.post("getPrescriptionDetails", {
        ulbid: ulbId,
        consultId: consultId,
      });

      const blob = await pdf(
        <GeneratePDF
          title="Prescription"
          headers={[
            "Medicine Name",
            "Dosage",
            "Frequency",
            "Duration (days)",
            "Instructions",
          ]}
          data={data}
          companyName={corporation}
          logo="/logo.png"
          receiptName="Patient Prescription"
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "prescription.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Prescription"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Prescription",
      }}
    >
      <div>
        <Formik
          // innerRef={formikRef}
          initialValues={{
            patient: "",
            date: new Date(),
            medicines: [
              {
                medicine: "",
                dosage: "",
                frequency: "",
                duration: "",
                instructions: "",
              },
            ],
            status: "",
            language: "",
          }}
          validationSchema={ValidationSchemas().prescription}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => {
            useEffect(() => {
              if (selectedPrescription) {
                setFieldValue(
                  "patient",
                  selectedPrescription.NUM_PRESCRIPTION_PATIENTID,
                );
                const rawDate =
                  selectedPrescription.DAT_PRESCRIPTION_PRESCRDATE;
                let parsedDate = null;

                if (rawDate) {
                  // If format is DD-MM-YYYY, convert to YYYY-MM-DD
                  if (/^\d{2}-\d{2}-\d{4}$/.test(rawDate)) {
                    const [day, month, year] = rawDate.split("-");
                    parsedDate = new Date(`${year}-${month}-${day}`);
                  } else {
                    parsedDate = new Date(rawDate);
                  }

                  if (!isNaN(parsedDate)) {
                    setFieldValue("date", parsedDate); // Date object for DatePicker
                  } else {
                    console.error("Invalid date format from API:", rawDate);
                    setFieldValue("date", null);
                  }
                } else {
                  setFieldValue("date", null);
                }
                setFieldValue(
                  "status",
                  selectedPrescription.VAR_PRESCRIPTION_STATUS,
                );
                setFieldValue(
                  "language",
                  selectedPrescription.VAR_PRESCRIPTION_LANGUAGE,
                );
                // fill other fields
              }
            }, [selectedPrescription, setFieldValue]);

            return (
              <Form className="space-y-6">
                {/* Table */}

                <div className="mb-6">
                  {/* <HeaderLabel text="Update Prescription" size="text-xl" align="text-left" /> */}

                  <Table
                    headers={[
                      "Date",
                      "Patient ID",
                      "Consultation ID",
                      "Patient name",
                      "OPD Name & Code",
                      "Doctor Name",
                      "Status",
                      "Action",
                    ]}
                    data={prescriptionsTable.map((item) => [
                      new Date(
                        item.DAT_PRESCRIPTION_PRESCRDATE,
                      ).toLocaleDateString("en-GB"),
                      item.NUM_PRESCRIPTION_PATIENTID,
                      item.NUM_PRESCRIPTION_CONSULTATIONID,
                      item.VAR_PATIENT_ENAME,
                      `${item.VAR_OPD_NAME || ""} (${item.VAR_OPD_CODE || ""})`,
                      item.VAR_DOC_ENAME || "N/A",
                      item.VAR_PRESCRIPTION_STATUS || "N/A",
                      <button
                        className="text-blue-600 underline"
                        onClick={() => handleSelect(item, setFieldValue)}
                        type="button"
                      >
                        Select
                      </button>,
                    ])}
                  />
                </div>

                {/* Update Section */}
                {selectedPrescription && (
                  <section
                    ref={updateSectionRef}
                    className="bg-white shadow-md rounded-lg p-4 sm:p-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label text="Patient Id" />
                        <Field
                          name="patient"
                          component={InputField}
                          type="text"
                          placeholder="Patient"
                        />
                        <ErrorMessage
                          name="patient"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <Label text="Prescription Date" />
                        <Field
                          name="date"
                          component={InputField}
                          type="calendar"
                        />
                        <ErrorMessage
                          name="date"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Medicines */}
                    {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-6">
                      <HeaderLabel
                        text="Medicines"
                        size="text-xl"
                        align="text-left"
                      />
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => addMedicine(values, setFieldValue)}
                      >
                        Add Medicine
                      </Button>
                    </div> */}

                    {values.medicines.map((_, index) => (
                      <div key={index} className="border p-4 rounded-lg mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                          {/* Medicine Name */}
                          <div>
                            <Label text="Medicine Name" />
                            <Field
                              name={`medicines[${index}].medicine`}
                              component={InputField}
                              type="text"
                              placeholder="Medicine Name"
                              disabled
                            />
                            <ErrorMessage
                              name={`medicines[${index}].medicine`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>

                          {/* Dosage */}
                          <div>
                            <Label text="Dosage" />
                            <Field
                              name={`medicines[${index}].dosage`}
                              component={InputField}
                              type="text"
                              placeholder="500mg"
                            />
                            <ErrorMessage
                              name={`medicines[${index}].dosage`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>

                          {/* Frequency */}
                          <div>
                            <Label text="Frequency" />
                            <Field
                              name={`medicines[${index}].frequency`}
                              component={InputField}
                              type="text"
                              placeholder="1-0-1"
                              disabled
                            />
                            <ErrorMessage
                              name={`medicines[${index}].frequency`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>

                          {/* Duration */}
                          <div>
                            <Label text="Duration" />
                            <Field
                              name={`medicines[${index}].duration`}
                              component={InputField}
                              type="text"
                              placeholder="5"
                              disabled
                            />
                            <ErrorMessage
                              name={`medicines[${index}].duration`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>

                          {/* Remove Button */}
                          <div className="flex justify-center pb-4">
                            {/* <Button
                            type="button"
                            variant="danger"
                            onClick={() =>
                              removeMedicine(index, values, setFieldValue)
                            }
                          >
                            Remove
                          </Button> */}
                          </div>
                        </div>

                        {/* Instructions */}
                        <div>
                          <Label text="Instructions" />
                          <Field
                            name={`medicines[${index}].instructions`}
                            component={InputField}
                            type="text"
                            placeholder="After food, with water, etc."
                          />
                          <ErrorMessage
                            name={`medicines[${index}].instructions`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Status & Language */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <Label text="Status" />
                        <Field
                          name="status"
                          component={InputField}
                          type="text"
                          placeholder="Enter Status here"
                        />
                        <ErrorMessage
                          name="status"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <Label text="Language" />
                        <Field
                          name="language"
                          component={InputField}
                          type="dropdown"
                          placeholder="Select Language"
                          options={[
                            { value: "Marathi", label: "Marathi" },
                            { value: "English", label: "English" },
                            { value: "Hindi", label: "Hindi" },
                          ]}
                        />
                        <ErrorMessage
                          name="language"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div> */}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={() => navigate("/dashboard")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full sm:w-auto"
                      >
                        Generate Prescription
                      </Button>
                    </div>
                  </section>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmPrescription;