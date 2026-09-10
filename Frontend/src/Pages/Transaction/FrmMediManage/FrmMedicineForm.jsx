import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import Label from "../../../Components/Label";
import InputField from "../../../Components/InputField";
import Button from "../../../Components/Button";
import TextArea from "../../../Components/TextArea";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { useAuth } from "../../../Context/AuthContext";
import { inputHandlers } from "../../../HOC/Validation/InputValidations";

const FrmMedicineForm = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const location = useLocation();
  const { attributeId } = location.state || {};
  const [dropdownOptions, setDropdownOptions] = useState([
    { VENDORID: "", VENDORLABEL: "" },
  ]);
  const [propertyValueId, setPropertyValueId] = useState(null);
  const [initialValues, setInitialValues] = useState({
    medicineName: "",
    genericName: "",
    dosageForm: "",
    strength: "",
    unitOfMeasure: "",
    manufacturer: "",
    primarySupplier: "",
    minStock: "",
    maxStock: "",
    expiry: "",
    shelfLife: "",
    storageConditions: "",
    controlledDrug: false,
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const ip = await GetIPAddress();
      const payload = {
        in_userId: userId,
        in_mode: attributeId ? 2 : 1,
        in_ulbId: ulbid,
        in_entityId: 19,
        in_ipaddress: ip,
        in_source: config.source,
        in_attributeId: attributeId ? attributeId : 0,
        values: [
          {
            in_propertyvalueId: attributeId ? propertyValueId.medicineName : 0,
            in_propertydefId: 10,
            in_valueString: values.medicineName,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.genericName : 0,
            in_propertydefId: 11,
            in_valueString: values.genericName,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.dosageForm : 0,
            in_propertydefId: 12,
            in_valueString: values.dosageForm,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.strength : 0,
            in_propertydefId: 13,
            in_valueString: values.strength,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.unitOfMeasure : 0,
            in_propertydefId: 14,
            in_valueString: values.unitOfMeasure,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.manufacturer : 0,
            in_propertydefId: 15,
            in_valueString: values.manufacturer,
          },
          {
            in_propertyvalueId: attributeId
              ? propertyValueId.primarySupplier
              : 0,
            in_propertydefId: 16,
            in_valueString: values.primarySupplier,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.minStock : 0,
            in_propertydefId: 17,
            in_valueNumber: Number(values.minStock) || null,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.maxStock : 0,
            in_propertydefId: 18,
            in_valueNumber: Number(values.maxStock) || null,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.shelfLife : 0,
            in_propertydefId: 19,
            in_valueNumber: Number(values.shelfLife) || null,
          },
          {
            in_propertyvalueId: attributeId
              ? propertyValueId.storageConditions
              : 0,
            in_propertydefId: 20,
            in_valueString: values.storageConditions,
          },
          {
            in_propertyvalueId: attributeId
              ? propertyValueId.controlledDrug
              : 0,
            in_propertydefId: 21,
            in_valueBool: values.controlledDrug ? "Y" : "N",
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.expiry : 0,
            in_propertydefId: 22,
            in_valueNumber: Number(values.expiry) || null,
          },
        ],
      };
      const res = await apiService.post("aoin_propertyvalue_ins", payload);
      if (res?.data?.results.some((r) => r.errorCode !== 9999)) {
        alert("Some properties failed: " + JSON.stringify(res.data.results));
      } else {
        alert("Medicine Added Successfully!");
        navigate("/Transaction/FrmMediManage");
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to save medicine: " + err.message);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const payload = { ulbId: ulbid };
      const res = await apiService.post("getVendorsDropdown", payload);
      if (res?.data?.length > 0) {
        setDropdownOptions(res.data);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const fetchMedicineDetails = async () => {
    try {
      setLoading(true);
      const payload = {
        entityType: "MEDICINE",
        ulbId: ulbid,
        attributeId: attributeId,
      };
      const res = await apiService.post("getItemdetails", payload);
      // console.log("details",res)
      if (res?.data?.length > 0) {
        const data = res.data;
        const initVal = {
          medicineName: data[0].VALUESTRING || "",
          genericName: data[1].VALUESTRING || "",
          dosageForm: data[2].VALUESTRING || "",
          strength: data[3].VALUESTRING || "",
          unitOfMeasure: data[4].VALUESTRING || "",
          manufacturer: data[5].VALUESTRING || "",
          primarySupplier: data[6].VALUESTRING || "",
          minStock: data[7].VALUENUMBER || 0,
          maxStock: data[8].VALUENUMBER || 0,
          shelfLife: data[9].VALUENUMBER || 0,
          storageConditions: data[10].VALUESTRING || "",
          controlledDrug: data[11].VALUEBOOL === "Y" ? true : false,
          expiry: data[12].VALUENUMBER || 0,
        };
        const propId = {
          medicineName: data[0].PROPERTYVALUEID || 0 ,
          genericName: data[1].PROPERTYVALUEID || 0,
          dosageForm: data[2].PROPERTYVALUEID || 0,
          strength: data[3].PROPERTYVALUEID || 0,
          unitOfMeasure: data[4].PROPERTYVALUEID || 0,
          manufacturer: data[5].PROPERTYVALUEID || 0,
          primarySupplier: data[6].PROPERTYVALUEID || 0,
          minStock: data[7].PROPERTYVALUEID || 0,
          maxStock: data[8].PROPERTYVALUEID || 0,
          shelfLife: data[9].PROPERTYVALUEID || 0,
          storageConditions: data[10].PROPERTYVALUEID || 0,
          controlledDrug: data[11].PROPERTYVALUEID || 0,
          expiry: data[12].PROPERTYVALUEID || 0,
        };
        setPropertyValueId(propId);
        setInitialValues(initVal);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid) {
      fetchDropdownOptions();
    }
    if (ulbid && attributeId) {
      fetchMedicineDetails();
    }
  }, [ulbid, attributeId]);

  return (
    <Layout
      title="Medicine Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Medicine Management",
      }}
    >
      <div>
        {/* <h2 className="text-xl font-semibold mb-6">Add New Medicine</h2> */}

        <Formik
          initialValues={initialValues}
          validationSchema={ValidationSchemas().FrmMedicineForm}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Medicine Name */}
              <div>
                <Label text="Medicine Name " required />
                <Field
                  name="medicineName"
                  component={InputField}
                  restrictInput={inputHandlers.name}
                  placeholder="Enter medicine name"
                  className="form-input-box"
                />
                <ErrorMessage
                  name="medicineName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Generic Name */}
              <div>
                <Label text="Generic Name " required />
                <Field
                  name="genericName"
                  component={InputField}
                  restrictInput={inputHandlers.name}
                  placeholder="Enter generic name"
                  className="form-input-box"
                />
                <ErrorMessage
                  name="genericName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Dosage Form */}
              <div>
                <Label text="Dosage Form " required />
                <Field as="select" name="dosageForm" className="form-input-box">
                  <option value="">Select Form</option>
                  <option value="tablet">Tablet</option>
                  <option value="capsule">Capsule</option>
                  <option value="syrup">Syrup</option>
                </Field>
                <ErrorMessage
                  name="dosageForm"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Strength */}
              <div>
                <Label text="Strength " required />
                <Field
                  name="strength"
                  component={InputField}
                  restrictInput={inputHandlers.integer}
                  placeholder="e.g., 500 mg"
                  className="form-input-box"
                />
                <ErrorMessage
                  name="strength"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Unit of Measure */}
              <div>
                <Label text="Unit of Measure " required />
                <Field
                  as="select"
                  name="unitOfMeasure"
                  className="form-input-box"
                >
                  <option value="">Select UoM</option>
                  <option value="mg">mg</option>
                  <option value="ml">ml</option>
                  <option value="g">g</option>
                  <option value="Nos">Nos</option>
                  <option value="Tablets">Tablets</option>
                </Field>
                <ErrorMessage
                  name="unitOfMeasure"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Manufacturer */}
              <div>
                <Label text="Manufacturer " required />
                <Field
                  name="manufacturer"
                  placeholder="Enter manufacturer"
                  className="form-input-box"
                />
                <ErrorMessage
                  name="manufacturer"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Primary Supplier */}
              <div>
                <Label text="Primary Supplier " required />
                <Field
                  as="select"
                  name="primarySupplier"
                  className="form-input-box"
                >
                  <option value="">Select Supplier</option>
                  {/* <option value="supplier1">MediSupplies Ltd.</option>
                  <option value="supplier2">HealthPharma Co.</option> */}
                  {dropdownOptions.map((option) => {
                    return (
                      <option value={option.VENDORID} key={option.VENDORID}>
                        {option.VENDORLABEL}
                      </option>
                    );
                  })}
                </Field>
                <ErrorMessage
                  name="primarySupplier"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Max Stock */}
              <div>
                <Label text="Maximum Stock " required />
                <Field
                  name="maxStock"
                  className="form-input-box"
                  component={InputField}
                  restrictInput={inputHandlers.phone}
                  placeholder="Enter maximum stock"
                />
                <ErrorMessage
                  name="maxStock"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Shelf Life */}
              <div>
                <Label text="Shelf Life (months) " required />
                <Field
                  name="shelfLife"
                  component={InputField}
                  restrictInput={inputHandlers.phone}
                  className="form-input-box"
                  placeholder="Enter shelf life"
                />
                <ErrorMessage
                  name="shelfLife"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Min Stock */}
              <div>
                <Label text="Out of Stock (No. of Stocks)" required />
                <Field
                  name="minStock"
                  component={InputField}
                  restrictInput={inputHandlers.phone}
                  placeholder="Enter number of days"
                  className="form-input-box"
                />
                <ErrorMessage
                  name="minStock"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Min Stock */}
              <div>
                <Label text="Expiry alert (No. of Days)" required />
                <Field
                  name="expiry"
                  component={InputField}
                  restrictInput={inputHandlers.phone}
                  placeholder="Enter number of days"
                  className="form-input-box"
                />
                <ErrorMessage
                  name="expiry"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Storage Conditions */}
              <div className="md:col-span-2">
                <Label text="Storage Conditions " required />
                <Field
                  as="textarea"
                  className="form-input-box"
                  name="storageConditions"
                  placeholder="Enter storage conditions"
                  rows={3}
                />
                <ErrorMessage
                  name="storageConditions"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Controlled Drug */}
              <div className="md:col-span-2 flex items-center gap-2">
                <Field type="checkbox" name="controlledDrug" />
                <Label text="Controlled Drug (Requires special handling)" />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-center gap-4 mt-6">
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate(-1)}
                >
                  {" "}
                  Back{" "}
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {attributeId ? "Update Medicine" : "Add Medicine"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmMedicineForm;
