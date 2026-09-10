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

const FrmMaterialTransferIndent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1"; // 1 = Add, 2 = Edit
  const transferId = queryParams.get("transferId");

  const [initialValues, setInitialValues] = useState({
    sourceStoreStock: "",
    transferredQty: "",
    destinationStoreStock: "",
    receivedQty: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransferById = async () => {
      if (mode !== "1" && transferId) {
        try {
          setLoading(true);
          // Mock API call - Replace with actual API when ready
          // const payload = { ulbId: Number(ulbId), transferId: Number(transferId) };
          // const { data } = await apiService.post("GetMaterialTransferById", payload);

          // Dummy data for now
          const data = {
            SOURCE_STORE_STOCK: "Main Store - 500 Units",
            TRANSFERRED_QTY: "100",
            DESTINATION_STORE_STOCK: "Pharmacy Store - 50 Units",
            RECEIVED_QTY: "100",
          };

          setInitialValues({
            sourceStoreStock: data.SOURCE_STORE_STOCK || "",
            transferredQty: data.TRANSFERRED_QTY || "",
            destinationStoreStock: data.DESTINATION_STORE_STOCK || "",
            receivedQty: data.RECEIVED_QTY || "",
          });
        } catch (error) {
          console.error("Error fetching transfer by id:", error);
          alert("Failed to fetch transfer details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransferById();
  }, [mode, transferId, ulbId, user]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const payload = {
        in_userId: userId,
        in_mode: mode,
        in_ulbId: Number(ulbId),
        in_transferId: mode === "1" ? null : Number(transferId),
        in_sourceStoreStock: values.sourceStoreStock,
        in_transferredQty: values.transferredQty,
        in_destinationStoreStock: values.destinationStoreStock,
        in_receivedQty: values.receivedQty,
        in_ipaddress: ip,
        in_source: config.source,
      };

      // Mock API call - Replace with actual API when ready
      // const res = await apiService.post("MaterialTransferIns", payload);

      const res = {
        data: { errorCode: 9999, errorMessage: "Saved Successfully" },
      };

      if (res?.data.errorCode === 9999) {
        alert(res.data.errorMessage);
        resetForm();
        navigate("/Transaction/FrmMaterialTransferIndentList");
      } else {
        alert(res?.data.errorMessage);
      }
    } catch (error) {
      console.error("Error while saving transfer:", error);
      alert("API Error ❌ Check console for details.");
    }
  };

  return (
    <Layout
      title="Material Transfer Indent"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Material Transfer Indent",
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
            validationSchema={ValidationSchemas().FrmMaterialTransferIndent}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Source Store Stock */}
                  <div>
                    <Label text="Source Store Stock : " required />
                    <Field
                      name="sourceStoreStock"
                      placeholder="e.g. Main Store - 500 Units"
                      component={InputField}
                      type="text"
                    />
                    {touched.sourceStoreStock && errors.sourceStoreStock && (
                      <div className="text-red-500 text-sm">
                        {errors.sourceStoreStock}
                      </div>
                    )}
                  </div>

                  {/* Transferred Qty */}
                  <div>
                    <Label text="Transferred Qty : " required />
                    <Field
                      name="transferredQty"
                      placeholder="e.g. 100"
                      component={InputField}
                      type="text"
                    />
                    {touched.transferredQty && errors.transferredQty && (
                      <div className="text-red-500 text-sm">
                        {errors.transferredQty}
                      </div>
                    )}
                  </div>

                  {/* Destination Store Stock */}
                  <div>
                    <Label text="Destination Store Stock : " required />
                    <Field
                      name="destinationStoreStock"
                      placeholder="e.g. Pharmacy Store - 50 Units"
                      component={InputField}
                      type="text"
                    />
                    {touched.destinationStoreStock &&
                      errors.destinationStoreStock && (
                        <div className="text-red-500 text-sm">
                          {errors.destinationStoreStock}
                        </div>
                      )}
                  </div>

                  {/* Received Qty */}
                  <div>
                    <Label text="Received Qty : " required />
                    <Field
                      name="receivedQty"
                      placeholder="e.g. 100"
                      component={InputField}
                      type="text"
                    />
                    {touched.receivedQty && errors.receivedQty && (
                      <div className="text-red-500 text-sm">
                        {errors.receivedQty}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  {/* ✅ Back button points to the List page using /Transaction/ */}
                  <Button
                    type="button"
                    onClick={() =>
                      navigate("/Transaction/FrmMaterialTransferIndentList")
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

export default FrmMaterialTransferIndent;
