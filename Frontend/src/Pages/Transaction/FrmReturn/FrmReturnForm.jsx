import React, { useEffect, useState } from "react";
import Layout from "../../../Components/Layout";
import HeaderLabel from "../../../Components/HeaderLabel";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Button from "../../../Components/Button";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import InputField from "../../../Components/InputField";
import Label from "../../../Components/Label";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate, formatDateMonth } from "../../../utils/dateUtils";
import { inputHandlers } from "../../../HOC/Validation/InputValidations";

const FrmReturnForm = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const location = useLocation();
  const { returnAdjId } = location.state || {};
  const navigate = useNavigate();
  const [issueItemOptions, setIssueItemsOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [facilityOptions, setFacilityOptions] = useState([]);

  const [initialValues, setInitialValues] = useState({
    stockBatchId: "",
    deptId: "",
    facilityId: "",
    type: "",
    quantity: "",
    adjDate: new Date(),
    reason: "",
    remarks: "",
  });

  const handleSubmit = async (values) => {
    if (!userId || !ulbid) return;
    try {
      const ip = await GetIPAddress();
      const payload = {
        in_userId: userId,
        in_mode: returnAdjId ? 2 : 1,
        in_UlbId: Number(ulbid),
        in_returnAdjId: returnAdjId ? returnAdjId : 0,
        in_itemid: Number(values.stockBatchId),
        in_deptId: Number(values.deptId),
        in_Issueid: Number(values.facilityId),
        in_type: values.type,
        in_quantity: Number(values.quantity),
        in_adjDate: formatDateMonth(values.adjDate),
        in_reason: values.reason,
        in_remarks: values.remarks,
        in_ipaddress: ip,
        in_source: config.source,
      };
      const res = await apiService.post("aoin_ReturnAdjustment_ins", payload);
      if (res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        navigate("/Transaction/FrmReturn");
      } else {
        alert(res?.data?.errorMessage);
      }
    } catch (err) {
      console.error("Error in Return Adjustment:", err);
    }
  };

  // ✅ Fetch dropdowns
  const fetchDropdowns = async () => {
    try {
      const payload = {
        ulbId: ulbid,
      };

      const results = await Promise.allSettled([
        apiService.post("getDepartmentddList", payload),
        apiService.post("getIssueList", payload),
        apiService.post("getIssueItemList", payload),
      ]);
      if (
        results[0].status === "fulfilled" &&
        results[0].value?.data?.length > 0
      ) {
        console.log("dept", results[0]);
        const options = results[0].value?.data.map((option) => {
          return {
            value: option.NUM_DEPT_ID,
            label: option.VAR_DEPT_NAME,
          };
        });
        setDeptOptions(options);
      }
      if (
        results[1].status === "fulfilled" &&
        results[1].value?.data?.length > 0
      ) {
        const options = results[1].value?.data.map((option) => {
          return {
            value: option.NUM_ISSUE_ID,
            label: option.VAR_ISSUE_ISSUEDBY,
          };
        });
        setFacilityOptions(options);
      }
      if (
        results[2].status === "fulfilled" &&
        results[2].value?.data?.length > 0
      ) {
        // console.log(results[2], "hello");
        const options = results[2].value?.data.map((option) => {
          return {
            value: option.NUM_ISSUEITEM_ID,
            label: option.VAR_ISSUEITEM_NAME,
            issueId: option.NUM_ISSUEITEM_ISSUEID,
            deptId: option.NUM_ISSUE_DEPTID,
          };
        });
        setIssueItemsOptions(options);
      }
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
    }
  };

  const fetchReturnAdjItem = async () => {
    try {
      const payload = {
        ulbId: ulbid,
        returnAdjId: returnAdjId,
      };
      const res = await apiService.post("getReturnAdjbyId", payload);

      if (res?.data?.length > 0) {
        const data = res.data[0];
        const initValue = {
          stockBatchId: data.ISSUEITEMID,
          deptId: data.DEPTID,
          facilityId: data.ISSUEID,
          type: data.ADJTYPE,
          quantity: Number(data.QUANTITYRETURN),
          adjDate: data.ADJDATE,
          reason: data.REASON,
          remarks: data.REMARKS,
        };
        setInitialValues(initValue);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    if (ulbid) {
      fetchDropdowns();
    }
    if (returnAdjId && ulbid) {
      fetchReturnAdjItem();
    }
  }, [ulbid, returnAdjId]);

  return (
    <Layout
      title="Return Adjustment"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Return Adjustment",
      }}
    >
      <div>
        {/* <HeaderLabel text="Return Adjustment" size="text-l" align="text-left" /> */}
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={ValidationSchemas().FrmReturnAdjustment}
          enableReinitialize
        >
          {({ values, setFieldValue }) => {
            useEffect(() => {
              const issueItemObj = issueItemOptions.find(
                (option) => option.value == values.stockBatchId
              );

              if (issueItemObj) {
                // Facility auto select
                setFieldValue("facilityId", issueItemObj.issueId || "");

                // Department auto select
                setFieldValue("deptId", issueItemObj.deptId || "");
              }
            }, [values.stockBatchId, issueItemOptions]);

            return (
              <Form className="w-full space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <Label text="Item :" required htmlFor="stockBatchId" />
                    <Field
                      name="stockBatchId"
                      placeholder="Enter Stock Batch Id"
                      className="form-input-box"
                      as="select"
                    >
                      <option value="">Select Item</option>
                      {issueItemOptions.map((option) => {
                        return (
                          <option value={option.value} key={option.value}>
                            {option.label}
                          </option>
                        );
                      })}
                    </Field>
                    <ErrorMessage
                      name="stockBatchId"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label text="Department :" required htmlFor="deptId" />
                    <Field
                      name="deptId"
                      className="form-input-box"
                      as="select"
                      disabled={true}
                    >
                      <option value="">Select Department</option>
                      {deptOptions.map((option) => {
                        return (
                          <option value={option.value} key={option.value}>
                            {option.label}
                          </option>
                        );
                      })}
                    </Field>
                    <ErrorMessage
                      name="deptId"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label text="Issued By :" required htmlFor="facilityId" />
                    <Field
                      name="facilityId"
                      className="form-input-box hover:cursor-not-allowed"
                      as="select"
                      disabled={true}
                    >
                      <option value="">Select Issued by </option>
                      {facilityOptions.map((option) => {
                        return (
                          <option value={option.value} key={option.value}>
                            {option.label}
                          </option>
                        );
                      })}
                    </Field>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <Label text="Type :" required htmlFor="type" />
                    <Field
                      name="type"
                      component={InputField}
                      type="dropdown"
                      options={[
                        { value: "Damage Stocks", label: "Damage Stocks" },
                        { value: "Extra Stocks", label: "Extra Stocks" },
                        { value: "Expired Stocks", label: "Expired Stocks" },
                      ]}
                    />
                    <ErrorMessage
                      name="type"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label text="Quantity :" required htmlFor="quantity" />
                    <Field
                      name="quantity"
                      placeholder="Enter Quantity"
                      component={InputField}
                      restrictInput={inputHandlers.integer}
                      type="text"
                    />
                    <ErrorMessage
                      name="quantity"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label
                      text="Adjustment Date :"
                      required
                      htmlFor="adjDate"
                    />
                    <Field
                      name="adjDate"
                      component={InputField}
                      type="calendar"
                      allowPastDates={false}
                    />
                    <ErrorMessage
                      name="adjDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label text="Reason :" required htmlFor="reason" />
                    <Field
                      name="reason"
                      placeholder="Enter Reason"
                      component={InputField}
                      restrictInput={inputHandlers.noSpecialChar}
                      type="text"
                    />
                    <ErrorMessage
                      name="reason"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <Label text="Remarks :" htmlFor="remarks" />
                    <Field
                      name="remarks"
                      placeholder="Enter Remarks"
                      component={InputField}
                      restrictInput={inputHandlers.noSpecialChar}
                      type="text"
                    />
                    <ErrorMessage
                      name="remarks"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-center">
                  <Button type="submit" className="hover:cursor-pointer">
                    {returnAdjId ? "Update" : "Submit"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmReturnForm;
