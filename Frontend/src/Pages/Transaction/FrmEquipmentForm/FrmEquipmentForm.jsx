import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import Label from "../../../Components/Label";
import InputField from "../../../Components/InputField";
import Button from "../../../Components/Button";
import Layout from "../../../Components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import FileUpload from "../../../Components/FileUpload";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import { inputHandlers } from "../../../HOC/Validation/InputValidations";
import {
  formatDatebyMonth,
  formatDatebyMonthSmall,
  toLocalDate,
} from "../../../utils/dateUtils";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { useLoader } from "../../../Context/LoaderContext";

const FrmEquipmentForm = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useLoader();
  const [imageState, setImageState] = useState(false);
  const { attributeId } = location.state || {};
  const [dropdownOptions, setDropdownOptions] = useState([
    { VENDORID: "", VENDORLABEL: "" },
  ]);
  const [categoryDropdownOptions, setCategoryDropdownOptions] = useState([
    { NUM_CATEGORY_ID: "", VAR_CATEGORY_NAME: "" },
  ]);
  const [propertyValueId, setPropertyValueId] = useState(null);
  const [initialValues, setInitialValues] = useState({
    equipmentName: "",
    model: "",
    serialNumber: "",
    category: "",
    manufacturer: "",
    supplier: "",
    purchaseDate: new Date(),
    warrantyUntil: new Date(),
    location: "",
    status: "",
    notes: "",
    equipmentImage: null,
    equipmentImageName: "",
    alertNotificationDay: "",
    alertNotificationStock: "",
    totalStocks: "",
  });

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        reject(new Error("Provided value is not a valid file"));
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (values) => {
    if (values.equipmentImage instanceof File) {
      let base64Content = await convertFileToBase64(values.equipmentImage);
      values.equipmentImage = {
        fileName: values.equipmentImage.name,
        fileContent: base64Content,
      };
    }
    try {
      setLoading(true);
      const ip = await GetIPAddress();
      const payload = {
        in_userId: userId,
        in_mode: attributeId ? 2 : 1,
        in_ulbId: ulbid,
        in_entityId: 32,
        in_ipaddress: ip,
        in_source: config.source,
        attributeId: attributeId ? attributeId : 0,
        values: [
          {
            in_propertyvalueId: attributeId ? propertyValueId.equipmentName : 0,
            in_propertydefId: 43,
            in_valueString: values.equipmentName,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.model : 0,
            in_propertydefId: 44,
            in_valueString: values.model,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.serialNumber : 0,
            in_propertydefId: 45,
            in_valueNumber: values.serialNumber,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.category : 0,
            in_propertydefId: 46,
            in_valueString: values.category,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.manufacturer : 0,
            in_propertydefId: 47,
            in_valueString: values.manufacturer,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.supplier : 0,
            in_propertydefId: 48,
            in_valueString: values.supplier,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.purchaseDate : 0,
            in_propertydefId: 49,
            in_valueDate: formatDatebyMonthSmall(values.purchaseDate),
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.warrantyUntil : 0,
            in_propertydefId: 50,
            in_valueDate: formatDatebyMonthSmall(values.warrantyUntil),
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.location : 0,
            in_propertydefId: 51,
            in_valueString: values.location,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.status : 0,
            in_propertydefId: 52,
            in_valueString: values.status,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.notes : 0,
            in_propertydefId: 53,
            in_valueString: values.notes,
          },
          {
            in_propertyvalueId: attributeId
              ? propertyValueId.equipmentImage
              : 0,
            in_propertydefId: 54,
            in_valueJson: values.equipmentImage,
          },

          {
            in_propertyvalueId: attributeId
              ? propertyValueId.alertNotificationDay
              : 0,
            in_propertydefId: 55,
            in_valueNumber: values.alertNotificationDay,
          },
          {
            in_propertyvalueId: attributeId ? propertyValueId.totalStocks : 0,
            in_propertydefId: 56,
            in_valueNumber: values.totalStocks,
          },
          {
            in_propertyvalueId: attributeId
              ? propertyValueId.alertNotificationStock
              : 0,
            in_propertydefId: 57,
            in_valueNumber: values.alertNotificationStock,
          },
        ],
      };

      const res = await apiService.post("aoin_propertyvalue_ins", payload);

      if (!res?.data?.results) {
        alert("Error: " + (res?.data?.error || "Unknown error from server"));
        return;
      }

      if (res.data.results.some((r) => r.errorCode !== 9999)) {
        alert("Some properties failed: " + JSON.stringify(res.data.results));
      } else {
        alert(res.data.results[0].errorMsg);
        navigate("/Transaction/FrmEquipManage");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const payload = { ulbId: ulbid };
      const results = await Promise.allSettled([
        apiService.post("getVendorsDropdown", payload),
        apiService.post("getcategoryDropdown", payload),
      ]);
      if (
        results[0].status === "fulfilled" &&
        results[0].value?.data?.length > 0
      ) {
        setDropdownOptions(results[0].value?.data);
      }
      if (
        results[1].status === "fulfilled" &&
        results[1].value?.data?.length > 0
      ) {
        setCategoryDropdownOptions(results[1].value?.data);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const fetchEquipmentDetails = async () => {
    try {
      const payload = {
        entityType: "EQUIPMENT",
        ulbId: ulbid,
        attributeId: attributeId,
      };
      const res = await apiService.post("getItemdetails", payload);
      if (res?.data?.length > 0) {
        const data = res.data;
        const initState = {
          equipmentName: data[0].VALUESTRING,
          model: data[1].VALUESTRING,
          serialNumber: data[2].VALUENUMBER,
          category: data[3].VALUESTRING,
          manufacturer: data[4].VALUESTRING,
          supplier: data[5].VALUESTRING,
          purchaseDate: toLocalDate(data[6].VALUEDATE),
          warrantyUntil: toLocalDate(data[7].VALUEDATE),
          location: data[8].VALUESTRING,
          status: data[9].VALUESTRING,
          notes: data[10].VALUESTRING,
          equipmentImage: data[11]?.VALUEJSON,
          alertNotificationDay: data[12]?.VALUENUMBER,
          totalStocks: data[13]?.VALUENUMBER,
          alertNotificationStock: data[14]?.VALUENUMBER,
        };
        const propId = {
          equipmentName: data[0].PROPERTYVALUEID,
          model: data[1].PROPERTYVALUEID,
          serialNumber: data[2].PROPERTYVALUEID,
          category: data[3].PROPERTYVALUEID,
          manufacturer: data[4].PROPERTYVALUEID,
          supplier: data[5].PROPERTYVALUEID,
          purchaseDate: data[6].PROPERTYVALUEID,
          warrantyUntil: data[7].PROPERTYVALUEID,
          location: data[8].PROPERTYVALUEID,
          status: data[9].PROPERTYVALUEID,
          notes: data[10].PROPERTYVALUEID,
          equipmentImage: data[11].PROPERTYVALUEID,
          alertNotificationDay: data[12].PROPERTYVALUEID,
          totalStocks: data[13].PROPERTYVALUEID,
          alertNotificationStock: data[14].PROPERTYVALUEID,
        };
        setPropertyValueId(propId);
        setInitialValues(initState);
        setImageState(true);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  useEffect(() => {
    if (ulbid) {
      fetchDropdownOptions();
    }
    if (ulbid && attributeId) {
      fetchEquipmentDetails();
    }
  }, [ulbid, attributeId]);

  return (
    <Layout
      title="Equipment Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Add Equipment",
      }}
    >
      <div>
        {/* <h2 className="text-xl font-semibold mb-6">Add New Equipment</h2> */}

        <Formik
          initialValues={initialValues}
          validationSchema={ValidationSchemas().FrmEquipmentForm}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue, resetForm, values }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label text="Equipment Name " required />
                <Field
                  name="equipmentName"
                  restrictInput={inputHandlers.noSpecialChar}
                  component={InputField}
                  placeholder="Enter equipment name"
                  className="form-input-box"
                />
                <ErrorMessage
                  name="equipmentName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Model */}
              <div>
                <Label text="Model " required />
                <Field
                  name="model"
                  restrictInput={inputHandlers.noSpecialChar}
                  component={InputField}
                  placeholder="Enter model"
                  className="form-input-box"
                />
                <ErrorMessage
                  name="model"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Serial Number */}
              <div>
                <Label text="Serial Number " required />
                <Field
                  name="serialNumber"
                  restrictInput={inputHandlers.integer}
                  component={InputField}
                  placeholder="Enter serial number"
                  className="form-input-box"
                />
                <ErrorMessage
                  name="serialNumber"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <Label text="Category " required />
                <Field className="form-input-box" as="select" name="category">
                  <option value="">Select Category</option>
                  {categoryDropdownOptions.map((option) => {
                    return (
                      <option
                        value={option.NUM_CATEGORY_ID}
                        key={option.NUM_CATEGORY_ID}
                      >
                        {option.VAR_CATEGORY_NAME}
                      </option>
                    );
                  })}
                </Field>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Manufacturer */}
              <div>
                <Label text="Manufacturer " required />
                <Field
                  name="manufacturer"
                  restrictInput={inputHandlers.name}
                  component={InputField}
                  placeholder="Enter manufacturer"
                  className="form-input-box"
                />
                <ErrorMessage
                  name="manufacturer"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Supplier */}
              <div>
                <Label text="Supplier" />
                <Field
                  name="supplier"
                  as="select"
                  placeholder="Enter supplier"
                  className="form-input-box"
                >
                  <option value="">Select Supplier</option>
                  {dropdownOptions.map((option) => {
                    return (
                      <option value={option.VENDORID} key={option.VENDORID}>
                        {option.VENDORLABEL}
                      </option>
                    );
                  })}
                </Field>
                <ErrorMessage
                  name="supplier"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Purchase Date */}
              <div>
                <Label text="Purchase Date " required />
                <Field
                  type="calendar"
                  name="purchaseDate"
                  component={InputField}
                />
                <ErrorMessage
                  name="purchaseDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Warranty Until */}
              <div>
                <Label text="Warranty Until" required />
                <Field
                  type="calendar"
                  name="warrantyUntil"
                  component={InputField}
                />
                <ErrorMessage
                  name="warrantyUntil"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Alert notification timing */}
              <div>
                <Label text="Notification Alert Days" required />
                <Field
                  className="form-input-box"
                  restrictInput={inputHandlers.integer}
                  component={InputField}
                  placeholder="Enter days"
                  name="alertNotificationDay"
                />
                <ErrorMessage
                  name="alertNotificationDay"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Total Stocks */}
              <div>
                <Label text="Total Stocks" required />
                <Field
                  className="form-input-box"
                  restrictInput={inputHandlers.integer}
                  component={InputField}
                  placeholder="Enter stocks"
                  name="totalStocks"
                />
                <ErrorMessage
                  name="totalStocks"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Alert notification timing */}
              <div>
                <Label text="Stocks Alert Notification" required />
                <Field
                  className="form-input-box"
                  restrictInput={inputHandlers.integer}
                  component={InputField}
                  placeholder="Enter stocks"
                  name="alertNotificationStock"
                />
                <ErrorMessage
                  name="alertNotificationStock"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Current Location */}
              <div>
                <Label text="Current Location " required />
                <Field
                  className="form-input-box"
                  restrictInput={inputHandlers.noSpecialChar}
                  component={InputField}
                  placeholder="Enter Current Location"
                  name="location"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Status */}
              <div>
                <Label text="Status " required />
                <Field
                  className="form-input-box"
                  restrictInput={inputHandlers.noSpecialChar}
                  component={InputField}
                  name="status"
                  placeholder="Equipment Staus"
                ></Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <Label text="Notes" />
                <Field
                  name="notes"
                  as="textarea"
                  className="form-input-box"
                  placeholder="Enter notes"
                  rows={3}
                />
                <ErrorMessage
                  name="notes"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Equipment Image */}
              <div className="md:col-span-2 flex flex-col items-start gap-1">
                <Label text="Equipment Image" />
                <FileUpload
                  name="equipmentImage"
                  multiple={false}
                  accept="image/png, image/jpeg"
                  onChange={() => setImageState(false)}
                  onFileUpload={(file) => {
                    if (file) {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        const base64 = reader.result.split(",")[1];
                        setFieldValue("equipmentImage", {
                          fileName: file.name,
                          fileContent: base64,
                        });
                        setImageState(false);
                      };
                    }
                  }}
                />

                {initialValues.equipmentImage && imageState && (
                  <div className="flex flex-col items-start gap-2">
                    <img
                      src={`data:image/png;base64,${initialValues.equipmentImage.fileContent}`}
                      alt={initialValues.equipmentImage.fileName}
                      className="w-40 h-40 object-cover mb-2 rounded border"
                    />
                    <span className="text-sm text-gray-600">
                      {initialValues.equipmentImage.fileName}
                    </span>
                  </div>
                )}
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
                  Save Equipment
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmEquipmentForm;
