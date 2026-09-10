import React, { useState, useEffect } from "react";
import Table from "../../../Components/Table";
import HeaderLabel from "../../../Components/HeaderLabel";
import Layout from "../../../Components/Layout";
import apiService from "../../../../apiService";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../Components/Button";
import { useAuth } from "../../../Context/AuthContext";
import { Edit, Trash2 } from "lucide-react";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import Label from "../../../Components/Label";
import InputField from "../../../Components/InputField";
import { inputHandlers } from "../../../HOC/Validation/InputValidations";
import { useLoader } from "../../../Context/LoaderContext";

const FrmCurrentStocks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const [tableData, setTableData] = useState([]);
  const [currentIssuedStock, setCurrentIssuedStock] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    issuedStocks: "",
    itemName: "",
    issueId: "",
    issueItemId: "",
    status: "",
  });

  const getCategoryDropdown = async () => {
    try {
      const payload = { ulbId: ulbid };

      const res = await apiService.post("GetCategoryActiveList", payload);

      if (res?.data?.length > 0) {
        const options = res.data.map((item) => ({
          value: String(item.CATEGORY_ID),
          label: item.CATEGORY_NAME,
        }));

        setCategoryOptions(options);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const changeStocks = (data) => {
    if (!data) return;
    setInitialValues({
      issuedStocks: data.CURRENT_STOCK,
      itemName: data.VAR_ITEM_NAME,
      issueId: Number(data.NUM_ISSUEITEM_ISSUEID),
      issueItemId: Number(data.NUM_ISSUEITEM_ID),
      status: data.VAR_ISSUEITEM_STATUS,
    });
    setCurrentIssuedStock(data.NUM_ISSUEITEM_QTYISSUED);
  };

  const handleSubmit = async (values) => {
    if (currentIssuedStock && values.issuedStocks > currentIssuedStock) {
      alert("Quantity of used Item cannot be greater than current Quantity");
      return;
    }
    try {
      setLoading(true);
      const ip = await GetIPAddress();
      const payload = {
        In_Userid: userId,
        In_issueid: Number(values.issueId),
        In_issueitemid: Number(values.issueItemId),
        In_name: values.itemName,
        In_Qty: Number(values.issuedStocks),
        In_status: values.status,
        In_ulbid: ulbid,
        In_ipaddress: ip,
        In_source: config.source,
      };
      const res = await apiService.post("aoin_issueitemutdt_ins", payload);
      if (res?.data?.errorCode === 9999) {
        alert(res.data.errorMsg);
        navigate(0);
      } else {
        alert(res?.data?.errorMsg);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentStocks = async () => {
    try {
      setLoading(true);
      const payload = {
        ulbId: ulbid,
      };
      const res = await apiService.post("getIssueItemList", payload);
      if (res?.data?.length > 0) {
        // const data = res.data.map((data) => {
        //   return [
        //     data.VAR_ISSUEITEM_NAME,
        //     data.VAR_CATEGORY_NAME,
        //     data.NUM_ISSUEITEM_QTYISSUED,
        //     <div className="flex justify-center items-centr">
        //       <p
        //         onClick={() => changeStocks(data)}
        //         className="text-blue-600 underline hover:cursor-pointer"
        //       >
        //         Select
        //       </p>
        //     </div>,
        //   ];
        // });
        // setTableData(data);
        setStockList(res.data)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid) {
      getCategoryDropdown();
      fetchCurrentStocks();
    }
  }, [ulbid]);

  return (
    <Layout
      title="Current Stocks"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Current Stocks",
      }}
    >
      <Formik initialValues={{
        searchText: "",
        category: ""
      }}>
        {({ values, setFieldValue, resetForm }) => {
          const filteredData = stockList
            .filter((item) => {
              const search = values.searchText?.toLowerCase() || "";

              const searchMatch =
                item.VAR_ITEM_NAME?.toLowerCase().includes(search) ||
                item.VAR_CATEGORY_NAME?.toLowerCase().includes(search) ||
                String(item.CURRENT_STOCK).includes(search);

              const categoryMatch =
                !values.category || String(item.VAR_CATEGORY_NAME) === String(values.category);

              return searchMatch && categoryMatch;
            })
            .map((data) => [
              data.VAR_ITEM_NAME,
              data.VAR_CATEGORY_NAME,
              data.CURRENT_STOCK,
              // <div className="flex justify-center items-center">
              //   <p
              //     onClick={() => changeStocks(data)}
              //     className="text-blue-600 underline hover:cursor-pointer"
              //   >
              //     Select
              //   </p>
              // </div>,
            ]);
          return (
            <Form>
              <div className="flex justify-start items-end gap-2">
                <div>
                  <Field
                    name="searchText"
                    type="text"
                    component={InputField}
                    onChange={(e) => {
                      setFieldValue("searchText", e.target.value)
                    }}
                    placeholder="Search"
                  />
                </div>
                <div className="w-60">
                  <Label text="Category" />
                  <Field
                    name="category"
                    type="dropdown"
                    options={categoryOptions}
                    component={InputField}
                    onChange={(e) => {
                      setFieldValue("category", e.target.value);
                    }}
                  />
                </div>
              </div>
              <Table
                // headerlabel={"Medicine List"}
                // headers={["Item", "Item Category", "Total Items", "Actions"]}
                headers={["Item", "Item Category", "Total Items"]}
                data={filteredData}
                showSearch={false}
              />
            </Form>
          )
        }}
      </Formik>




      {initialValues.issuedStocks && (
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={ValidationSchemas().FrmCurrentStocks}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ values, errors }) => {
              return (
                <Form className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5 bg-white p-6 rounded-md shadow">
                  {/* Item Name */}
                  <div className="flex flex-col gap-2">
                    <Label
                      text="Item Name :"
                      className="font-semibold text-gray-700"
                    />
                    <p className="px-3 py-2 border rounded-md bg-gray-50 text-gray-800">
                      {values.itemName}
                    </p>
                  </div>

                  {/* Enter Used Stocks */}
                  <div className="flex flex-col">
                    <Label
                      text="Enter Used Stocks :"
                      className="font-semibold text-gray-700"
                    />
                    <Field
                      name="issuedStocks"
                      component={InputField}
                      restrictInput={inputHandlers.integer}
                      placeholder="Used Stocks"
                      className="form-input-box"
                    />
                    <ErrorMessage
                      name="issuedStocks"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 mt-5"
                    >
                      Update
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      )}
    </Layout>
  );
};

export default FrmCurrentStocks;
