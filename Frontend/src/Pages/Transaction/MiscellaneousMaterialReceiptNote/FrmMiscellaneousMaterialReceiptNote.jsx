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

const FrmMiscellaneousMaterialReceiptNote = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const receiptId = queryParams.get("receiptId");

  const [initialValues, setInitialValues] = useState({
    createMiscReceipt: "",
    material: "",
    quantity: "",
    storeBin: "",
    approval: "",
    stockIncrease: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReceiptById = async () => {
      if (mode !== "1" && receiptId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), receiptId: Number(receiptId) };
          // const { data } = await apiService.post("GetMiscReceiptById", payload);

          // Dummy data for now
          const data = {
            CREATE_MISC_RECEIPT: "MISC001",
            MATERIAL: "A4 Paper",
            QUANTITY: "500",
            STORE_BIN: "Main Store - A01",
            APPROVAL: "Approved",
            STOCK_INCREASE: "Yes",
          };

          setInitialValues({
            createMiscReceipt: data.CREATE_MISC_RECEIPT || "",
            material: data.MATERIAL || "",
            quantity: data.QUANTITY || "",
            storeBin: data.STORE_BIN || "",
            approval: data.APPROVAL || "",
            stockIncrease: data.STOCK_INCREASE || "",
          });
        } catch (error) {
          console.error("Error fetching misc receipt by id:", error);
          alert("Failed to fetch receipt details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReceiptById();
  }, [mode, receiptId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_receiptId: mode === "1" ? null : Number(receiptId),
        in_createMiscReceipt: values.createMiscReceipt,
        in_material: values.material,
        in_quantity: values.quantity,
        in_storeBin: values.storeBin,
        in_approval: values.approval,
        in_stockIncrease: values.stockIncrease,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("MiscReceiptIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Transaction/FrmMiscellaneousMaterialReceiptNoteList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving misc receipt:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Miscellaneous Material Receipt Note"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Miscellaneous Material Receipt Note",
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
            validationSchema={
              ValidationSchemas().FrmMiscellaneousMaterialReceiptNote
            }
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Create Misc Receipt */}
                  <div>
                    <Label text="Create Misc Receipt : " required />
                    <Field
                      name="createMiscReceipt"
                      placeholder="e.g. MISC001"
                      component={InputField}
                      type="text"
                    />
                    {touched.createMiscReceipt && errors.createMiscReceipt && (
                      <div className="text-red-500 text-sm">
                        {errors.createMiscReceipt}
                      </div>
                    )}
                  </div>

                  {/* Select Material */}
                  <div>
                    <Label text="Select Material : " required />
                    <Field
                      name="material"
                      placeholder="e.g. A4 Paper"
                      component={InputField}
                      type="text"
                    />
                    {touched.material && errors.material && (
                      <div className="text-red-500 text-sm">
                        {errors.material}
                      </div>
                    )}
                  </div>

                  {/* Enter Quantity */}
                  <div>
                    <Label text="Enter Quantity : " required />
                    <Field
                      name="quantity"
                      placeholder="e.g. 500"
                      component={InputField}
                      type="text"
                    />
                    {touched.quantity && errors.quantity && (
                      <div className="text-red-500 text-sm">
                        {errors.quantity}
                      </div>
                    )}
                  </div>

                  {/* Select Store/Bin */}
                  <div>
                    <Label text="Select Store/Bin : " required />
                    <Field
                      name="storeBin"
                      placeholder="e.g. Main Store - A01"
                      component={InputField}
                      type="text"
                    />
                    {touched.storeBin && errors.storeBin && (
                      <div className="text-red-500 text-sm">
                        {errors.storeBin}
                      </div>
                    )}
                  </div>

                  {/* Approval */}
                  <div>
                    <Label text="Approval : " required />
                    <Field
                      name="approval"
                      placeholder="e.g. Approved / Pending"
                      component={InputField}
                      type="text"
                    />
                    {touched.approval && errors.approval && (
                      <div className="text-red-500 text-sm">
                        {errors.approval}
                      </div>
                    )}
                  </div>

                  {/* Stock Increase */}
                  <div>
                    <Label text="Stock Increase : " required />
                    <Field
                      name="stockIncrease"
                      placeholder="e.g. Yes / No"
                      component={InputField}
                      type="text"
                    />
                    {touched.stockIncrease && errors.stockIncrease && (
                      <div className="text-red-500 text-sm">
                        {errors.stockIncrease}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  {/* ✅ Back button points to the List page */}
                  <Button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/Transaction/FrmMiscellaneousMaterialReceiptNoteList",
                      )
                    }
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

export default FrmMiscellaneousMaterialReceiptNote;
