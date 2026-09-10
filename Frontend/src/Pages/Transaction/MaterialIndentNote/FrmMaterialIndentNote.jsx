import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Layout from "../../../Components/Layout";
import HeaderLabel from "../../../Components/HeaderLabel";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../../../../apiService";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { ValidationSchemas } from "../../../HOC/Validation/Validation";
import { useAuth } from "../../../Context/AuthContext";
import InputField from "../../../Components/InputField";
import { Plus, Trash2 } from "lucide-react";
import FrmAddItemModal from "./FrmAddRequsitionItemModal";

const FrmRequisitionMst = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "1";
  const requisitionId = queryParams.get("reqId");

  const [initialValues, setInitialValues] = useState({
    requisitionNo: "",
    requisitionDate: "",
    hospitalMOQ: "",
    remarks: "",
    lastIssueDate: "",
    status: "",
  });

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);

  const [poItems, setPoItems] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [addItemModal, setAddItemModal] = useState(false);
  const [hospitalList, setHospitalList] = useState([]);

  const updateQuantity = (id, newQuantity) => {
    const item = poItems.find((i) => i.id === id);
    if (!item) return;

    if (newQuantity < 1) return;

    if (newQuantity > item.currentStock) {
      alert(`Only ${item.currentStock} available in stock`);
      return;
    }

    setPoItems(
      poItems.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i)),
    );
  };

  useEffect(() => {
    if (mode === "1" || !requisitionId || !ulbId || categoryList.length === 0)
      return;

    const fetchRequisitionById = async () => {
      try {
        setLoading(true);

        const response = await apiService.post("RequisitionById", {
          ulbId: Number(ulbId),
          requisitionId: Number(requisitionId),
        });

        const data = response?.data;
        console.log("Requisition Data:", data);
        if (data?.master) {
          setInitialValues({
            requisitionNo: data.master.requisition_no || "",
            requisitionDate: data.master.requisition_date || "",
            hospitalMOQ: data.master.hospital || "",
            remarks: data.master.remark || "",
            lastIssueDate: data.master.last_issue_date || "",
            status: data.master.status || "",
          });

          if (Array.isArray(data.items)) {
            const mappedItems = data.items.map((item) => {
              const categoryObj = categoryList.find(
                (c) => Number(c.category_id) === Number(item.category_id),
              );

              return {
                id: item.item_id,
                name: item.item_name,
                Vendor: item.vendor_name,
                categoryId: item.category_id,
                categoryName: categoryObj?.category_name || "Unknown",
                quantity: item.quantity,
                detailId: item.detail_id,
                currentStock: 9999,
              };
            });

            setPoItems(mappedItems);
            console.log("Items", mappedItems);
          }
        }
      } catch (error) {
        console.error("Autofill Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequisitionById();
  }, [mode, requisitionId, ulbId, categoryList]);

  useEffect(() => {
    const fetchCategoryItemData = async () => {
      try {
        const itemRes = await apiService.post("GetItemList", {
          ulbId: Number(ulbId),
        });

        const categoryRes = await apiService.post("GetCategoryListByUlb", {
          ulbId: Number(ulbId),
        });

        if (itemRes?.data) {
          setItemList(itemRes.data);
        }

        if (categoryRes?.data) {
          const normalizedCategories = categoryRes.data.map((c) => ({
            category_id: c.CATEGORY_ID,
            category_name: c.CATEGORY_NAME,
          }));

          setCategoryList(normalizedCategories);
        }
      } catch (error) {
        console.error("Dropdown fetch error:", error);
      }
    };

    if (ulbId) {
      fetchCategoryItemData();
    }
  }, [ulbId]);

  const removeItem = (id) => {
    setPoItems(poItems.filter((item) => item.id !== id));
  };

  const generateItemString = () => {
    return poItems
      .map((item) => {
        return `${item.id}#${item.name}#${item.quantity}#${item.categoryId}`;
      })
      .join("$");
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const ip = await GetIPAddress();

      const itemString = generateItemString();
      debugger;

      const payload = {
        in_userId: userId,
        in_mode: Number(mode),
        in_UlbId: Number(ulbId),
        in_requisitionItemId: mode === "1" ? null : Number(requisitionId),

        In_requisistiondate: formatDate(values.requisitionDate),

        In_Hospital: values.hospitalMOQ,
        In_remark: values.remarks,
        in_itemstr: itemString,
        // In_status: values.status,
        In_status: "APPROVE",
        In_lastIssueDate: formatDate(values.lastIssueDate),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const response = await apiService.post("RequisitionIns", payload);

      const resData = response?.data;

      if (resData?.ErrorCode === 9999) {
        alert(resData?.ErrorMessage || "Saved Successfully");
        navigate("/Transaction/FrmRequisitionList");
      } else {
        alert(resData?.ErrorMessage || "Operation Failed");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("API Error ❌");
    }
  };

  return (
    <Layout
      title="Requisition Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Requisition Master",
      }}
    >
      <div>
        {/* <HeaderLabel size="text-l" align="text-left" /> */}

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={ValidationSchemas().FrmRequisitionMaster}
            enableReinitialize
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label text="Requisition Date :" required />
                    <Field
                      type="calendar"
                      name="requisitionDate"
                      component={InputField}
                      className="w-full"
                    />
                    {touched.requisitionDate && errors.requisitionDate && (
                      <div className="text-red-500 text-sm">
                        {errors.requisitionDate}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label text="Remarks :" required />
                    <Field name="remarks" className="form-input-box" />
                    {touched.remarks && errors.remarks && (
                      <div className="text-red-500 text-sm">
                        {errors.remarks}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label text="Last Issue Date :" required />
                    <Field
                      type="calendar"
                      name="lastIssueDate"
                      component={InputField}
                      className="form-input-box"
                    />
                    {touched.lastIssueDate && errors.lastIssueDate && (
                      <div className="text-red-500 text-sm">
                        {errors.lastIssueDate}
                      </div>
                    )}
                  </div>
                  {/* <div>
                    <Label text="Status : " required />
                    <Field as="select" name="status" className="form-input-box">
                      <option value="">Select status</option>
                      <option value="APPROVE">APPROVE</option>
                      <option value="PENDING">PENDING</option>
                    </Field>
                    {touched.status && errors.status && (
                      <div className="text-red-500 text-sm">
                        {errors.status}
                      </div>
                    )}
                  </div> */}
                </div>

                <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-lg">Add Items</h4>

                    <button
                      type="button"
                      className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center"
                      onClick={() => setAddItemModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </button>
                  </div>

                  {poItems.length > 0 ? (
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Item
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Supplier
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Category
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Quantity
                            </th>
                            <th className="py-2 text-left text-gray-500 font-medium">
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {poItems.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-gray-200 last:border-b-0"
                            >
                              <td className="py-3">
                                <div className="font-medium">{item.name}</div>
                              </td>
                              <td className="py-3">{item.Vendor}</td>
                              <td className="py-3">{item.categoryName}</td>

                              <td className="py-3">
                                <div className="flex items-center border border-gray-300 rounded-md w-fit">
                                  <button
                                    type="button"
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                  >
                                    -
                                  </button>

                                  <input
                                    type="number"
                                    className="w-16 text-center outline-none px-1 py-1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateQuantity(
                                        item.id,
                                        parseInt(e.target.value, 10),
                                      )
                                    }
                                  />

                                  <button
                                    type="button"
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </td>

                              <td className="py-3">
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="text-gray-400 mb-2">
                        No items added yet
                      </div>
                      <button
                        type="button"
                        className="text-blue-600 font-medium"
                        onClick={() => setAddItemModal(true)}
                      >
                        Add your first item
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-3">
                  <Button type="submit" className="bg-blue-600 text-white">
                    {mode === "1" ? "Save" : "Update"}
                  </Button>

                  <Button
                    type="button"
                    className="bg-gray-400 text-white"
                    onClick={() => navigate("/Transaction/FrmRequisitionList")}
                  >
                    Cancel
                  </Button>
                </div>

                {addItemModal && (
                  <FrmAddItemModal
                    categoryList={categoryList}
                    onClose={() => setAddItemModal(false)}
                    onAddItem={(item) => {
                      const existingItem = poItems.find(
                        (i) => i.id === item.id,
                      );

                      if (existingItem) {
                        setPoItems(
                          poItems.map((i) =>
                            i.id === item.id
                              ? { ...i, quantity: i.quantity + 1 }
                              : i,
                          ),
                        );
                      } else {
                        setPoItems([
                          ...poItems,
                          {
                            id: item.id,
                            name: item.name,
                            Vendor: item.Vendor,
                            categoryId: item.categoryId,
                            categoryName: item.categoryName,
                            quantity: 1,
                            currentStock: 9999,
                          },
                        ]);
                      }

                      setAddItemModal(false);
                    }}
                  />
                )}
              </Form>
            )}
          </Formik>
        )}
      </div>
    </Layout>
  );
};

export default FrmRequisitionMst;
