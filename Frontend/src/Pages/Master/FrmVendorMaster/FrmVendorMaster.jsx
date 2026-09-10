import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Layout";
import HeaderLabel from "../../../Components/HeaderLabel";
import { Field, Form, Formik } from "formik";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import apiService from "../../../../apiService";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { useAuth } from "../../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { inputHandlers } from "../../../HOC/Validation/InputValidations";
import InputField from "../../../Components/InputField";
import { useLoader } from "../../../Context/LoaderContext";

const FrmVendorMaster = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const location = useLocation();
  // const { vendorId } = location.state || {};
  const queryParams = new URLSearchParams(location.search);
  const vendorId = queryParams.get("vendorId");
  const mode = queryParams.get("mode") || "1";
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    vendorCode: "",
    vendorName: "",
    contactPerson: "",
    phone: "",
    email: "",
    paymentTerms: "",
    creditLimit: "",
    rating: "",
    flag: "",
    vendorAddress: "",
    gstNo: "",
    panNo: "",
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const ip = await GetIPAddress();
      const payload = {
        in_userId: userId,
        in_mode: Number(mode),
        in_ulbId: ulbid,
        in_vendorId: vendorId || null,
        in_vendorCode: values.vendorCode,
        in_vendorName: values.vendorName,
        in_vendorAddress: values.vendorAddress,
        in_contactPerson: values.contactPerson,
        in_phone: values.phone,
        in_email: values.email,
        in_paymentTerms: values.paymentTerms,
        in_creditLimit: values.creditLimit,
        in_rating: values.rating,
        in_flag: values.flag,
        in_ipaddress: ip,
        in_source: config.source,
        in_gstin: values.gstNo,
        in_panno: values.panNo,
      };
      const res = await apiService.post("AoinVendorIns", payload);
      if (res?.data.errorCode == 9999) {
        alert(res.data.message);
        navigate("/Master/FrmVendorMasterList");
      } else {
        alert(res.data.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);

      const payload = {
        ulbId: ulbid,
        vendorId: vendorId,
      };

      const res = await apiService.post("vendorsById", payload);

      if (res?.data) {
        const data = res.data;

        setInitialValues({
          vendorCode: data.VENDOR_CODE || "",
          vendorName: data.VENDOR_NAME || "",
          contactPerson: data.CONTACT_PERSON || "",
          phone: data.PHONE || "",
          email: data.EMAIL || "",
          paymentTerms: data.PAYMENT_TERMS || "",
          creditLimit: data.CREDIT_LIMIT || "",
          rating: data.RATING || "",
          flag: data.FLAG || "",
          vendorAddress: data.VENDOR_ADDRESS || "",
          gstNo: data.GSTIN || "",
          panNo: data.PANNO || "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid && vendorId) {
      fetchVendorDetails();
    }
  }, [ulbid, vendorId]);
  return (
    <Layout
      title="Vendor Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Vendor Master",
      }}
    >
      <div>
        {/* <HeaderLabel text="Vendor Master" size="text-l" align="text-left" /> */}
        <div>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={ValidationSchemas().FrmVendorMaster}
            enableReinitialize
          >
            {({ errors, touched }) => {
              return (
                <Form className="w-full space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <Label text="Vendor Code : " required />
                      <Field
                        name="vendorCode"
                        placeholder="Vendor Code"
                        className="form-input-box"
                      />
                      {touched.vendorCode && errors.vendorCode && (
                        <div className="text-red-500 text-sm">
                          {errors.vendorCode}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label text="Vendor Name: " required />
                      <Field
                        name="vendorName"
                        placeholder="Vendor Name"
                        className="form-input-box"
                      />
                      {touched.vendorName && errors.vendorName && (
                        <div className="text-red-500 text-sm">
                          {errors.vendorName}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label text="Contact Person: " required />
                      <Field
                        name="contactPerson"
                        placeholder="Contact Person"
                        className="form-input-box"
                      />
                      {touched.contactPerson && errors.contactPerson && (
                        <div className="text-red-500 text-sm">
                          {errors.contactPerson}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <Label text="Phone : " required />
                      <Field
                        name="phone"
                        placeholder="Phone"
                        className="form-input-box"
                        component={InputField}
                        type="text"
                        restrictInput={inputHandlers.phone}
                      />
                      {touched.phone && errors.phone && (
                        <div className="text-red-500 text-sm">
                          {errors.phone}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label text="Email : " required />
                      <Field
                        name="email"
                        placeholder="email"
                        className="form-input-box"
                      />
                      {touched.email && errors.email && (
                        <div className="text-red-500 text-sm">
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label text="Payment Terms : " required />
                      <Field
                        name="paymentTerms"
                        placeholder="Payment Terms"
                        className="form-input-box"
                      />
                      {touched.paymentTerms && errors.paymentTerms && (
                        <div className="text-red-500 text-sm">
                          {errors.paymentTerms}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <Label text="Credit Limit : " required />
                      <Field
                        name="creditLimit"
                        placeholder="Credit Limit"
                        className="form-input-box"
                        component={InputField}
                        restrictInput={inputHandlers.integer}
                      />
                      {touched.creditLimit && errors.creditLimit && (
                        <div className="text-red-500 text-sm">
                          {errors.creditLimit}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label text="Ratings : " required />
                      <Field
                        name="rating"
                        placeholder="Ratings"
                        className="form-input-box"
                      />
                      {touched.rating && errors.rating && (
                        <div className="text-red-500 text-sm">
                          {errors.rating}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label text="Flag : " required />
                      <Field
                        as="select"
                        name="flag"
                        placeholder="Item Category"
                        className="form-input-box"
                      >
                        <option value="">Select flag</option>
                        <option value="A">Active</option>
                        <option value="I">In-Active</option>
                      </Field>
                      {touched.flag && errors.flag && (
                        <div className="text-red-500 text-sm">
                          {errors.flag}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <Label text="GST No: " required />
                      <Field
                        name="gstNo"
                        placeholder="Vendor Name"
                        className="form-input-box"
                      />
                      {touched.gstNo && errors.gstNo && (
                        <div className="text-red-500 text-sm">
                          {errors.gstNo}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label text="PAN No: " required />
                      <Field
                        name="panNo"
                        placeholder="Vendor Name"
                        className="form-input-box"
                      />
                      {touched.panNo && errors.panNo && (
                        <div className="text-red-500 text-sm">
                          {errors.panNo}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label text="Vendor Address : " required />
                      <Field
                        name="vendorAddress"
                        as="textarea"
                        rows="4"
                        placeholder="Vendor Address"
                        className="form-input-box"
                      />
                      {touched.vendorAddress && errors.vendorAddress && (
                        <div className="text-red-500 text-sm">
                          {errors.vendorAddress}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button type="button" onClick={() => navigate(-1)}>
                      Back
                    </Button>
                    <Button type="submit" className="hover:cursor-pointer">
                      {vendorId ? "Update" : "Add"}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default FrmVendorMaster;
