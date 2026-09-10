// import React, { useEffect, useState } from "react";
// import Layout from "../../../Components/Layout";
// import HeaderLabel from "../../../Components/HeaderLabel";
// import { Field, Form, Formik } from "formik";
// import Label from "../../../Components/Label";
// import Button from "../../../Components/Button";
// import { ValidationSchemas } from "../../../HOC/Validation/Validation";
// import GetIPAddress from "../../../utils/ipHelper";
// import config from "../../../utils/config";
// import { useAuth } from "../../../Context/AuthContext";
// import apiService from "../../../../apiService";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useLoader } from "../../../Context/LoaderContext";
// import InputField from "../../../Components/InputField";

// const FrmItemMaster = () => {
//   const { user } = useAuth();
//   const userId = user?.userId;
//   const ulbid = user?.ulbId;
//   const location = useLocation();
//   const { setLoading } = useLoader();
//   const { itemId } = location.state || {};
//   const navigate = useNavigate();

//   const [dropdownOptions, setDropdownOptions] = useState([]);
//   const [subCategoryOptions, setSubCategoryOptions] = useState([]);

//   const [initialValues, setInitialValues] = useState({
//     code: "",
//     name: "",
//     category: "",
//     subCategory: "",
//     unit: "",
//     type: "",
//     flag: "",
//     packageSize: "",
//     gstApplicable: "",
//     moq: "",
//     vendor: "",
//     manufacturer: "",
//   });

//   // ================= HANDLE SUBMIT =================
//   const handleSubmit = async (values) => {
//     if (!userId || !ulbid) return;

//     try {
//       setLoading(true);
//       const ip = await GetIPAddress();

//       const payload = {
//         in_userId: userId,
//         in_mode: itemId ? 2 : 1,
//         in_UlbId: ulbid,
//         in_itemId: itemId || null,
//         in_itemCode: values.code,
//         in_itemName: values.name,
//         in_itemCategory: Number(values.category),
//         in_subCategory: Number(values.subCategory),
//         in_itemUnit: values.unit,
//         in_itemType: values.type,
//         in_flag: values.flag,
//         in_packageSize: values.packageSize,
//         in_gstApplicable: values.gstApplicable,
//         in_moq: Number(values.moq),
//         in_vendor: values.vendor,
//         in_manufacturer: values.manufacturer,
//         in_ipaddress: ip,
//         in_source: config.source,
//       };

//       const res = await apiService.post("AoinItemIns", payload);

//       if (res?.data?.errorCode === 9999) {
//         alert(res?.data?.errorMessage);
//         navigate("/Master/FrmItemMasterList");
//       } else {
//         alert(res?.data?.errorMessage);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= FETCH ITEM DETAIL (EDIT MODE) =================
//   const fetchItemFormData = async () => {
//     try {
//       setLoading(true);

//       const payload = {
//         ulbId: ulbid,
//         itemId: itemId,
//       };

//       const res = await apiService.post("GetItemDetail", payload);

//       if (res?.data) {
//         setInitialValues({
//           code: res.data.ITEM_CODE,
//           name: res.data.ITEM_NAME,
//           category: res.data.CATEGORY_ID,
//           subCategory: res.data.SUBCATEGORY_ID,
//           unit: res.data.UNIT_MEASURE,
//           type: res.data.ITEM_TYPE,
//           flag: res.data.ITEM_FLAG,
//           packageSize: res.data.PACKAGE_SIZE,
//           gstApplicable: res.data.GST_APPLICABLE,
//           moq: res.data.MOQ,
//           vendor: res.data.VENDOR_NAME,
//           manufacturer: res.data.MANUFACTURER_NAME,
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= GET CATEGORY =================
//   const getDropdownOptions = async () => {
//     try {
//       const payload = { ulbId: ulbid };

//       const res = await apiService.post("GetCategoryActiveList", payload);

//       if (res?.data?.length > 0) {
//         const options = res.data.map((item) => ({
//           value: String(item.CATEGORY_ID),
//           label: item.CATEGORY_NAME,
//         }));

//         setDropdownOptions(options);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ================= GET SUBCATEGORY =================
//   const getSubCategoryOptions = async () => {
//     try {
//       const payload = { ulbId: ulbid };

//       const res = await apiService.post("subCategoryList", payload);

//       if (res?.data?.length > 0) {
//         const options = res.data
//           .filter((item) => item.ACTIVE_FLAG === "A") // only active
//           .map((item) => ({
//             value: String(item.SUBCATEGORY_ID),
//             label: item.SUBCATEGORY_NAME,
//             categoryId: item.CATEGORY_ID,
//           }));

//         setSubCategoryOptions(options);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ================= USE EFFECT =================
//   useEffect(() => {
//     if (ulbid) {
//       getDropdownOptions();
//       getSubCategoryOptions();
//     }

//     if (ulbid && itemId) {
//       fetchItemFormData();
//     }
//   }, [ulbid, itemId]);

//   return (
//     <Layout
//       title="Item Master"
//       breadcrumb={{
//         homeLink: "/dashboard",
//         homeText: "Home",
//         current: "Item Master",
//       }}
//     >
//       <div className="mt-6 bg-white shadow-md rounded-lg p-6">
//         <HeaderLabel text="Item Master" size="text-l" align="text-left" />

//         <Formik
//           initialValues={initialValues}
//           onSubmit={handleSubmit}
//           validationSchema={ValidationSchemas().FrmItemMaster}
//           enableReinitialize
//         >
//           {({ errors, touched, values, setFieldValue }) => (
//             <Form className="w-full space-y-6">
//               {/* ================= BASIC DETAILS ================= */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                 <div>
//                   <Label text="Item Code : " required />
//                   <Field name="code" className="form-input-box" />
//                   {touched.code && errors.code && (
//                     <div className="text-red-500 text-sm">{errors.code}</div>
//                   )}
//                 </div>

//                 <div>
//                   <Label text="Item Name : " required />
//                   <Field name="name" className="form-input-box" />
//                 </div>

//                 <div>
//                   <Label text="Category : " required />
//                   <Field
//                     name="category"
//                     component={InputField}
//                     type="dropdown"
//                     options={dropdownOptions}
//                     onChange={(e) => {
//                       setFieldValue("category", e.target.value);
//                       setFieldValue("subCategory", "");
//                     }}
//                   />
//                 </div>

//                 <div>
//                   <Label text="Sub Category : " required />
//                   <Field
//                     name="subCategory"
//                     component={InputField}
//                     type="dropdown"
//                     options={subCategoryOptions.filter(
//                       (opt) =>
//                         Number(opt.categoryId) === Number(values.category),
//                     )}
//                   />
//                 </div>
//                 <div>
//                   <Label text="Item Unit : " required />
//                   <Field name="unit" className="form-input-box" />
//                 </div>

//                 <div>
//                   <Label text="Item Type : " required />
//                   <Field name="type" className="form-input-box" />
//                 </div>
//               </div>

//               {/* ================= OTHER DETAILS ================= */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                 <div>
//                   <Label text="Flag : " required />
//                   <Field as="select" name="flag" className="form-input-box">
//                     <option value="">Select flag</option>
//                     <option value="A">Active</option>
//                     <option value="I">In-Active</option>
//                   </Field>
//                 </div>

//                 <div>
//                   <Label text="Package Size : " required />
//                   <Field name="packageSize" className="form-input-box" />
//                 </div>

//                 <div>
//                   <Label text="GST Applicable : " required />
//                   <Field
//                     as="select"
//                     name="gstApplicable"
//                     className="form-input-box"
//                   >
//                     <option value="">Select GST</option>
//                     <option value="Y">Yes</option>
//                     <option value="N">No</option>
//                   </Field>
//                 </div>

//                 <div>
//                   <Label text="Minimum Order Quantity (MOQ) : " required />
//                   <Field type="number" name="moq" className="form-input-box" />
//                 </div>

//                 <div>
//                   <Label text="Vendor / Distributor : " required />
//                   <Field name="vendor" className="form-input-box" />
//                 </div>

//                 <div>
//                   <Label text="Manufacturer : " required />
//                   <Field name="manufacturer" className="form-input-box" />
//                 </div>
//               </div>

//               {/* ================= BUTTONS ================= */}
//               <div className="flex justify-center gap-3">
//                 <Button type="button" onClick={() => navigate(-1)}>
//                   Back
//                 </Button>
//                 <Button type="submit">{itemId ? "Update" : "Add"}</Button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </Layout>
//   );
// };

// export default FrmItemMaster;

import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Layout";
import HeaderLabel from "../../../Components/HeaderLabel";
import { Field, Form, Formik, ErrorMessage } from "formik";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoader } from "../../../Context/LoaderContext";
import InputField from "../../../Components/InputField";
import { inputHandlers } from "../../../HOC/Validation/InputValidations";

const FrmItemMaster = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const location = useLocation();
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  // itemId passed via query string
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const itemId = queryParams.get("itemId");

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);

  const [initialValues, setInitialValues] = useState({
    code: "",
    name: "",
    category: "",
    subCategory: "",
    unit: "",
    type: "",
    flag: "",
    packageSize: "",
    gstApplicable: "",
    moq: "",
    vendor: "",
    manufacturer: "",
    rate: "",
    rateGST: "",
  });

  // ================= GET CATEGORY =================
  const getDropdownOptions = async () => {
    try {
      const payload = { ulbId: ulbid };

      const res = await apiService.post("GetCategoryActiveList", payload);

      if (res?.data?.length > 0) {
        const options = res.data.map((item) => ({
          value: String(item.CATEGORY_ID),
          label: item.CATEGORY_NAME,
        }));

        setDropdownOptions(options);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= GET SUBCATEGORY =================
  const getSubCategoryOptions = async () => {
    try {
      const payload = { ulbId: ulbid };

      const res = await apiService.post("subCategoryList", payload);

      if (res?.data?.length > 0) {
        const options = res.data
          .filter((item) => item.ACTIVE_FLAG === "A") // only active
          .map((item) => ({
            value: String(item.SUBCATEGORY_ID),
            label: item.SUBCATEGORY_NAME,
            categoryId: item.CATEGORY_ID,
          }));

        setSubCategoryOptions(options);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= GET VENDOR =================
  const getVendorOptions = async () => {
    try {
      const payload = { ulbId: ulbid };

      const res = await apiService.post("vendorList", payload);

      if (res?.data?.length > 0) {
        const options = res.data
          .filter((item) => item.FLAG === "A" || item.FLAG === null)
          .map((item) => ({
            value: String(item.VENDOR_ID),
            label: item.VENDOR_NAME,
          }));

        setVendorOptions(options);
      }
    } catch (error) {
      console.log("Vendor API Error:", error);
    }
  };

  // ================= USE EFFECT =================
  useEffect(() => {
    if (ulbid) {
      getDropdownOptions();
      getSubCategoryOptions();
      getVendorOptions();
    }

    if (ulbid && itemId) {
      fetchItemFormData();
    }
  }, [ulbid, itemId]);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (values) => {
    if (!userId || !ulbid) return;

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: Number(mode),
        in_UlbId: ulbid,
        in_itemId: mode === "1" ? null : Number(itemId),
        in_itemCode: values.code,
        in_itemName: values.name,
        in_itemCategory: Number(values.category),
        in_subcategoryid: values.subCategory
          ? Number(values.subCategory)
          : null,
        in_itemUnit: values.unit,
        in_itemType: values.type,
        in_flag: values.flag,
        in_packsize: values.packageSize || null,
        in_orderquanty: values.moq ? Number(values.moq) : null,
        in_vendorid: values.vendor || null,
        in_manufacturer: values.manufacturer || null,
        in_gstapplflag: values.gstApplicable || null,
        in_rate: Number(values.rate),
        in_GSTrate : Number(values.rateGST) || null,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("AoinItemIns", payload);

      if (res?.data?.errorCode === 9999) {
        alert(res?.data?.message || "Saved successfully");
        navigate("/Master/FrmItemMasterList");
      } else {
        alert(res?.data?.message || "Failed to save item");
      }
    } catch (error) {
      console.error("Error while saving item:", error);
      alert("API Error ❌ Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH ITEM DETAIL (EDIT MODE) =================
  const fetchItemFormData = async () => {
    if (mode === "1" || !itemId) return;
    try {
      setLoading(true);

      const payload = {
        ulbId: ulbid,
        itemId: Number(itemId),
      };

      const res = await apiService.post("GetItemDetail", payload);

      if (res?.data) {
        setInitialValues({
          code: res.data.ITEM_CODE || "",
          name: res.data.ITEM_NAME || "",
          category: res.data.CATEGORY_ID || "",
          subCategory: res.data.SUBCATEGORY_ID || "",
          unit: res.data.UNIT_MEASURE || "",
          type: res.data.ITEM_TYPE || "",
          flag: res.data.ITEM_FLAG || "",
          packageSize: res.data.PACK_SIZE || "",
          gstApplicable: res.data.GST_APPLICABLE || "",
          moq: res.data.ORDER_QUANTITY || "",
          vendor: res.data.VENDOR_ID ? String(res.data.VENDOR_ID) : "",
          manufacturer: res.data.MANUFACTURER || "",
          rate: res.data.RATE || "",
          rateGST: res.data.GST_RATE || ""
        });
      }
    } catch (error) {
      console.error("Error fetching item detail:", error);
      alert("Failed to fetch item details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid && itemId) {
      fetchItemFormData();
    }
  }, [ulbid, itemId]);

  return (
    <Layout
      title="Item Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Item Master",
      }}
    >
      <div>
        {/* <HeaderLabel text="Item Master" size="text-l" align="text-left" /> */}

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={ValidationSchemas().FrmItemMaster}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="w-full space-y-6">
              {/* BASIC DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <Label text="Item Code : " required />
                  <Field name="code" component={InputField} type="text" />
                  <ErrorMessage
                    name="code"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                <div>
                  <Label text="Item Name : " required />
                  <Field name="name" component={InputField} />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                <div>
                  <Label text="Category : " required />
                  <Field
                    name="category"
                    component={InputField}
                    type="dropdown"
                    options={dropdownOptions}
                    onChange={(e) => {
                      setFieldValue("category", e.target.value);
                      setFieldValue("subCategory", "");
                    }}
                  />
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div>
                  <Label text="Sub Category : " required />
                  <Field
                    name="subCategory"
                    component={InputField}
                    type="dropdown"
                    options={subCategoryOptions.filter(
                      (opt) =>
                        Number(opt.categoryId) === Number(values.category),
                    )}
                  />
                  <ErrorMessage
                    name="subCategory"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                <div>
                  <Label text="Item Unit : " required />
                  <Field name="unit" component={InputField} />
                  <ErrorMessage
                    name="unit"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
                <div>
                  <Label text="Item Type : " required />
                  <Field name="type" component={InputField} />
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
              </div>

              {/* OTHER DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <Label text="Flag : " required />
                  <Field as="select" name="flag" className="form-input-box">
                    <option value="">Select flag</option>
                    <option value="A">Active</option>
                    <option value="I">In-Active</option>
                  </Field>
                  <ErrorMessage
                    name="flag"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                <div>
                  <Label text="Package Size : " />
                  <Field name="packageSize" component={InputField} />
                </div>
                <div>
                  <Label text="GST Applicable : " />
                  <Field
                    as="select"
                    name="gstApplicable"
                    className="form-input-box"
                  >
                    <option value="">Select GST</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </Field>
                </div>
                <div>
                  <Label text="Minimum Order Quantity (MOQ) : " />
                  <Field type="number" name="moq" className="form-input-box shadow-lg border border-gray-500" />
                </div>
                <div>
                  <Label text="Vendor / Distributor : " />
                  <Field
                    name="vendor"
                    component={InputField}
                    type="dropdown"
                    options={vendorOptions}
                  />
                </div>
                <div>
                  <Label text="Manufacturer : " />
                  <Field name="manufacturer" component={InputField} />
                </div>
                <div>
                  <Label text="Rate : " required />
                  <Field name="rate" component={InputField} restrictInput={inputHandlers.integer} />
                  <ErrorMessage
                    name="rate"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                {values.gstApplicable === "Y" &&
                  (
                    <div>
                      <Label text="GST Rate: " />
                      <Field
                        name="rateGST"
                        type="text"
                        component={InputField}
                        restrictInput={inputHandlers.amount}
                      />
                    </div>
                  )}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-center gap-3">
                <Button type="button" onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button type="submit">{mode === "1" ? "Add" : "Update"}</Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmItemMaster;