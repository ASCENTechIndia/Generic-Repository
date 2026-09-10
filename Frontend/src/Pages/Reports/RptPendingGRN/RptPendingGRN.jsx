import { useState, useEffect, useMemo } from "react";
import { Formik, Field, Form } from "formik";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import InputField from "../../../Components/InputField";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import Table from "../../../Components/Table";
import { formatDate } from "../../../utils/dateUtils";

const RptPendingGRN = () => {
    const { user } = useAuth();
    const { setLoading } = useLoader();
    const ulbId = user?.ulbId;

    const [initialValues, setInitialValues] = useState({
        poNumber: "",
        // poType: "",
        // sortType: "",
    });
    const [tableHeader, setTableHeader] = useState([
        "PO No.",
        "PO Date",
        "Expiry Delivery Date",
        "Supplier Name",
        "Requisition No.",
        "Items",
        "Total Amount",
        "PO Status",
    ]);
    const [tableData, setTableData] = useState([]);


    const fetchPendingPurchaseOrders = async () => {
        try {
            setLoading(true);
            const payload = {
                "ulbid": ulbId
            }
            const response = await apiService.post("getPurApproveGrn", payload);

            // console.log(response);

            if (response.data.success && response.data.data.length > 0) {
                const formattedTableData = response.data.data.map((item) => [
                    item.VAR_PURCHASEORDER_PONO || "-",
                    formatDate(item.DAT_PURCHASEORDER_DATE) || "-",
                    formatDate(item.DAT_PURCHASEORDER_EXPDELIVERYDT) || "-",
                    item.VAR_VENDOR_NAME || "-",
                    item.VAR_REQUISITIONITEM_REQUNO || "-",
                    item.NUM_POITEM_QTY || "-",
                    item.NUM_PURCHASEORDER_TOTALAMOUNT || "-",
                    (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#dbfce7] text-[#016630]">
                            {item.VAR_PURCHASEORDER_STATUS === "A" ? "Approved" : "-"}
                        </span>
                    )
                ]);

                setTableData(formattedTableData);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!ulbId) return;

        fetchPendingPurchaseOrders();
    }, [ulbId]);



    return (
        <Layout
            title="Pending Good Receipt Notes"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Pending Good Receipt Notes"
            }}
        >
            {/* <div className="flex justify-end gap-x-3">
                <Button>Rejected Selected</Button>
                <Button>Approve Selected</Button>
            </div> */}
            <Formik initialValues={initialValues} >
                {({ setFieldValue, values, resetForm }) => {
                    const filteredData = useMemo(() => {
                        let filtered = [...tableData];

                        // 🔎 Search
                        if (values.poNumber) {
                            const search = values.poNumber.toLowerCase();

                            filtered = filtered.filter(row =>   
                                String(row[0]).toLowerCase().includes(search) || // PO Number
                                String(row[3]).toLowerCase().includes(search)  ||  // Supplier Name
                                String(row[4]).toLowerCase().includes(search) ||
                                String(row[1]).toLowerCase().includes(search) ||
                                String(row[2]).toLowerCase().includes(search)
                            );
                        }

                        // 📦 PO Type
                        // if (values.poType && values.poType !== "1") {
                        //     filtered = filtered.filter(row =>
                        //         row[4] === values.poType
                        //     );
                        // }

                        // // 🔽 Sorting
                        // if (values.sortType === "1") {
                        //     filtered.sort((a, b) => b[6] - a[6]);
                        // } else if (values.sortType === "2") {
                        //     filtered.sort((a, b) => a[6] - b[6]);
                        // }

                        return filtered;

                    }, [values, tableData]);
                    return (
                        <>
                            <Form>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">

                                    {/* <div>
                                        <Field
                                            name="poNumber"
                                            type="text"
                                            component={InputField}
                                            placeholder="Search PO Number or Supplier.."
                                        />
                                    </div> */}
                                    {/* <div>
                                        <Field
                                            name="poType"
                                            type="dropdown"
                                            component={InputField}
                                            options={[
                                                { label: "Default Type", value: "D" },
                                                { label: "All PO Types", value: "1" }
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <Field
                                            name="sortType"
                                            type="dropdown"
                                            component={InputField}
                                            options={[
                                                { label: "Default Type", value: "D" },
                                                { label: "Sort by value (High to Low)", value: "1" },
                                                { label: "Sort by Value (Low to High)", value: "2" }
                                            ]}
                                        />
                                    </div> */}
                                </div>


                            </Form>
                            <div className="mt-5">
                                <Table
                                    headers={tableHeader}
                                    data={filteredData.length > 0 ? filteredData : []}
                                />

                            </div>
                        </>
                    )
                }}

            </Formik>

        </Layout>
    )
};

export default RptPendingGRN;
