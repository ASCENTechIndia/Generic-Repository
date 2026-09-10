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

const FrmSupplierMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const supplierId = queryParams.get("supplierId");

  const [initialValues, setInitialValues] = useState({
    supplierCode: "",
    supplierName: "",
    address: "",
    contactPerson: "",
    mobile: "",
    email: "",
    gstNumber: "",
    pan: "",
    bankDetails: "",
    status: "A",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSupplierById = async () => {
      if (mode !== "1" && supplierId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), supplierId: Number(supplierId) };
          // const { data } = await apiService.post("GetSupplierById", payload);

          // Dummy data for now
          const data = {
            SUPPLIER_CODE: "SUP001",
            SUPPLIER_NAME: "MedPlus Distributors",
            ADDRESS: "123 Main Street, Mumbai",
            CONTACT_PERSON: "John Doe",
            MOBILE: "9876543210",
            EMAIL: "john@medplus.com",
            GST_NUMBER: "27AAAAA0000A1Z5",
            PAN: "AAAAA0000A",
            BANK_DETAILS: "HDFC Bank, A/C: 123456789, IFSC: HDFC0001234",
            STATUS: "A",
          };

          setInitialValues({
            supplierCode: data.SUPPLIER_CODE || "",
            supplierName: data.SUPPLIER_NAME || "",
            address: data.ADDRESS || "",
            contactPerson: data.CONTACT_PERSON || "",
            mobile: data.MOBILE || "",
            email: data.EMAIL || "",
            gstNumber: data.GST_NUMBER || "",
            pan: data.PAN || "",
            bankDetails: data.BANK_DETAILS || "",
            status: data.STATUS || "A",
          });
        } catch (error) {
          console.error("Error fetching supplier by id:", error);
          alert("Failed to fetch supplier details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSupplierById();
  }, [mode, supplierId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_supplierId: mode === "1" ? null : Number(supplierId),
        in_supplierCode: values.supplierCode,
        in_supplierName: values.supplierName,
        in_address: values.address,
        in_contactPerson: values.contactPerson,
        in_mobile: values.mobile,
        in_email: values.email,
        in_gstNumber: values.gstNumber,
        in_pan: values.pan,
        in_bankDetails: values.bankDetails,
        in_status: values.status,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("SupplierIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Master/FrmSupplierMasterList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving supplier:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Supplier Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Supplier Master",
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
            validationSchema={ValidationSchemas().FrmSupplierMaster}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Supplier Code */}
                  <div>
                    <Label text="Supplier Code : " required />
                    <Field
                      name="supplierCode"
                      placeholder="e.g. SUP001"
                      component={InputField}
                      type="text"
                    />
                    {touched.supplierCode && errors.supplierCode && (
                      <div className="text-red-500 text-sm">
                        {errors.supplierCode}
                      </div>
                    )}
                  </div>

                  {/* Supplier Name */}
                  <div>
                    <Label text="Supplier Name : " required />
                    <Field
                      name="supplierName"
                      placeholder="e.g. MedPlus Distributors"
                      component={InputField}
                      type="text"
                    />
                    {touched.supplierName && errors.supplierName && (
                      <div className="text-red-500 text-sm">
                        {errors.supplierName}
                      </div>
                    )}
                  </div>

                  {/* Contact Person */}
                  <div>
                    <Label text="Contact Person : " required />
                    <Field
                      name="contactPerson"
                      placeholder="e.g. John Doe"
                      component={InputField}
                      type="text"
                    />
                    {touched.contactPerson && errors.contactPerson && (
                      <div className="text-red-500 text-sm">
                        {errors.contactPerson}
                      </div>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <Label text="Mobile : " required />
                    <Field
                      name="mobile"
                      placeholder="e.g. 9876543210"
                      component={InputField}
                      type="text"
                    />
                    {touched.mobile && errors.mobile && (
                      <div className="text-red-500 text-sm">
                        {errors.mobile}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label text="Email : " required />
                    <Field
                      name="email"
                      placeholder="e.g. john@medplus.com"
                      component={InputField}
                      type="text"
                    />
                    {touched.email && errors.email && (
                      <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                  </div>

                  {/* GST Number */}
                  <div>
                    <Label text="GST Number : " required />
                    <Field
                      name="gstNumber"
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      component={InputField}
                      type="text"
                    />
                    {touched.gstNumber && errors.gstNumber && (
                      <div className="text-red-500 text-sm">
                        {errors.gstNumber}
                      </div>
                    )}
                  </div>

                  {/* PAN */}
                  <div>
                    <Label text="PAN : " required />
                    <Field
                      name="pan"
                      placeholder="e.g. AAAAA0000A"
                      component={InputField}
                      type="text"
                    />
                    {touched.pan && errors.pan && (
                      <div className="text-red-500 text-sm">{errors.pan}</div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <Label text="Address : " required />
                    <Field
                      name="address"
                      placeholder="e.g. 123 Main Street, Mumbai"
                      component={InputField}
                      type="text"
                    />
                    {touched.address && errors.address && (
                      <div className="text-red-500 text-sm">
                        {errors.address}
                      </div>
                    )}
                  </div>

                  {/* Bank Details */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label text="Bank Details : " required />
                    <Field
                      name="bankDetails"
                      placeholder="e.g. HDFC Bank, A/C: 123456789, IFSC: HDFC0001234"
                      component={InputField}
                      type="text"
                    />
                    {touched.bankDetails && errors.bankDetails && (
                      <div className="text-red-500 text-sm">
                        {errors.bankDetails}
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
                    onClick={() => navigate("/Master/FrmSupplierMasterList")}
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

export default FrmSupplierMaster;
