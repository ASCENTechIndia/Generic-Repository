import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import InputField from "../../../Components/InputField";
import Button from "../../../Components/Button";
import TextArea from "../../../Components/TextArea";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";
import { formatDateMonth } from "../../../utils/dateUtils";
import config from "../../../utils/config";
import GetIPAddress from "../../../utils/ipHelper";

const FrmGrnStock = () => {
  const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.userId;
    const ulbid = user?.ulbId;
  const [dropdownOptions, setDropdownOptions] = useState([
    { VENDORID: "", VENDORLABEL: "" },
  ]);
  const initialValues = {
    poNo: "",
    supplier: "",
    challanNo: "",
    challanDate: "",
    receivedBy: "",
    warehouse: "",
   items: [] 
  };
 const fetchDropdownOptions = async () => {
    try {
      const payload = { ulbId: ulbid };
      const results = await Promise.allSettled([
        apiService.post("getVendorsDropdown", payload),
      ]);
      
      if (
        results[0].status === "fulfilled" &&
        results[0].value?.data?.length > 0
      ) {
        setDropdownOptions(results[0].value?.data);
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
    
    }, [ulbid]);
  
   const fetchPODetails = async (pono, setFieldValue) => {
  try {
    const res = await apiService.post("AoinGetAppStockList", {
      pono: pono, 
      ulbId : ulbid
    });
    console.log("RES",res)
    if (res?.data?.success && Array.isArray(res.data.data)) {
      const poItems = res.data.data;

      setFieldValue(
        "supplier",
        poItems[0].NUM_PURCHASEORDER_VENDORID
      );

      // ✅ Items map करून Formik मध्ये set
      const mappedItems = poItems.map((row) => ({
        itemId: row.NUM_POITEM_ATTRIBUTEID,
        itemName: row.VAR_POITEM_NAME,
        desc: "", 
        categoryId : row.VAR_POITEM_CATEGORY,
        category: row.VAR_CATEGORY_NAME,
        poQty: row.NUM_POITEM_QTY,
        deliveredQty: row.NUM_POITEM_QTY, 
        batch: "",
        expiry: "",
        remarks: "",
      }));

      setFieldValue("items", mappedItems);
    } else {
      alert("PO items सापडले नाहीत");
    }
  } catch (error) {
    console.error("PO fetch error:", error);
    alert("No PO details");
  }
};

    const handleSubmit = async (values, { resetForm }) => {
      try {
       const grnItemStr = values.items
  .map(item =>
    [ 
      //-itemid/itemname(varchar)/itemcategory(number)/POQty/DeliveredQty/BatchNo(varchar)/ExpiryDate/Remarks
      item.itemId,
      item.itemName,
      item.categoryId,
      item.poQty,
      item.deliveredQty,
      item.batch,          
      formatDateMonth(item.expiry),         //dd/mmm/yyyy
      item.remarks || ""
    ].join("#")
  )
  .join("$");
      const ip = await GetIPAddress();
        const payload = {
          in_userId: userId,
          in_mode: 1,
          in_UlbId: Number(ulbid),
          in_grnId: 0,
          in_Vendorid:  Number(values.supplier),
          in_PONo: values.poNo,
          in_invoiceno: values.challanNo,
          in_challandate: formatDateMonth(values.challanDate),     
          in_receivedbye: values.receivedBy,
          in_receiveddate: formatDateMonth(values.challanDate),
          in_Receivingstore: values.warehouse,
          in_status : "P",
          in_grnItemStr: grnItemStr,
          in_ipaddress: ip,
          in_source: config.source,
        };
        console.log("Payload",payload)
        // return;
        const res = await apiService.post("insertGoodsReceiptNote", payload);
        
        if (res?.data?.success && res.data.errorCode === 9999) {
          alert(res.data.errorMessage);
            resetForm();  
        } else {
          alert(res?.data?.errorMessage || "Something went wrong");
        }
      } catch (error) {
        console.error("GRN submit error:", error);
        alert("Server error");
      }
    };

  return (
    <Layout
      title="Goods Receipt Note (GRN)"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "GRN Stock",
      }}
    >
      <div>
        {/* <h2 className="text-xl font-semibold mb-6">
          Goods Receipt Note (GRN)
        </h2> */}

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Fetch PO Section */}
              <div className="border rounded-lg p-4 flex items-center gap-4 bg-gray-50">
                <Label text="Fetch Approved PO:" />
                <Field
                  name="poNo"
                  component={InputField}
                  placeholder="Enter PO Number here"
                  className="flex-1"
                />
                <Button type="button"  onClick={() => {
    if (!values.poNo) {
      alert("Please enter PO Number");
      return;
    }
    fetchPODetails(values.poNo, setFieldValue);
  }}>Load PO Details</Button>
              </div>

              {/* Vendor Delivery Details */}
              <div className="border rounded-lg p-5 bg-white shadow-sm">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                  Vendor Delivery Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
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
                  </div>

                  <div>
                    <Label text="Vendor Challan / Invoice No." required />
                    <Field name="challanNo" component={InputField} />
                  </div>

                  <div>
                    <Label text="Challan Date" required />
                    <Field
                      type="calendar"
                      name="challanDate"
                      component={InputField}
                    />
                  </div>

                  <div>
                    <Label text="Received By" />
                    <Field
                      name="receivedBy"
                      component={InputField}
                      // disabled
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label text="Receiving Store / Warehouse" />
                    <Field name="warehouse" component={InputField} />
                  </div>
                </div>
              </div>

              {/* Items Table */}
            {values.items && values.items.length > 0 && (
                <>
                  <div className="border rounded-lg p-5 bg-white shadow-sm">
                  <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                    Verify Delivered Quantities
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full border text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border p-2">Sr.</th>
                          <th className="border p-2 text-left">Item Details</th>
                          <th className="border p-2">PO Qty</th>
                          <th className="border p-2">Delivered Qty</th>
                          <th className="border p-2">Batch No.</th>
                          <th className="border p-2">Expiry Date</th>
                          <th className="border p-2">Remarks</th>
                        </tr>
                      </thead>

                      <FieldArray name="items">
                        {() => (
                          <tbody>
                            {values.items.map((item, index) => (
                              <tr key={index}>
                                <td className="border p-2 text-center">
                                  {index + 1}
                                </td>

                                <td className="border p-2">
                                  <div className="font-semibold">{item.itemName}</div>
                                  <div className="text-gray-500 text-xs">{item.desc}</div>
                                  <div className="text-gray-400 text-xs">
                                    Category: {item.category}
                                  </div>
                                </td>

                                <td className="border p-2 text-center">
                                  {item.poQty}
                                </td>

                                <td className="border p-2 w-30">
                                  <Field
                                    name={`items.${index}.deliveredQty`}
                                    component={InputField}
                                    type="quantity"
                                    min={0}
                                    // max={item.poQty}
                                  />
                                </td>

                                <td className="border p-2">
                                  <Field
                                    name={`items.${index}.batch`}
                                    component={InputField}
                                  />
                                </td>

                                <td className="border p-2">
                                  <Field
                                    name={`items.${index}.expiry`}
                                    component={InputField}
                                    type="calendar"
                                  />
                                </td>

                                <td className="border p-2">
                                  <Field
                                    name={`items.${index}.remarks`}
                                    component={TextArea}
                                    rows={1}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                      </FieldArray>
                    </table>
                  </div>
                  </div>
                </>
              )}
                {/* <p className="text-red-600 text-sm mt-3">
                  * Accepting this challan will immediately update the central
                  warehouse stock.
                </p> */}
            
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-600"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                   Accept Delivery
                  </Button>
                </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default FrmGrnStock;