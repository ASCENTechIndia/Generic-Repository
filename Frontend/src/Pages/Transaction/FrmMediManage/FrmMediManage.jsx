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
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FrmMediManage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;

  const [medicineData, setMedicineData] = useState([]);

  const handleDelete = async (values) => {
    const payld = {
      entityType: "MEDICINE",
      ulbId: ulbid,
      attributeId: values.ATTRIBUTE_ID,
    };
    const res = await apiService.post("getItemdetails", payld);
    if (res?.data?.length <= 0) {
      return;
    }
    const data = res.data;
    try {
      const ip = await GetIPAddress();
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbid,
        in_entityId: 19,
        in_ipaddress: ip,
        in_source: config.source,
        in_attributeId: values.ATTRIBUTE_ID ? values.ATTRIBUTE_ID : 0,
        values: [
          {
            in_propertyvalueId: data[0].PROPERTYVALUEID,
            in_propertydefId: 10,
            in_valueString: values.medicineName,
          },
          {
            in_propertyvalueId: data[1].PROPERTYVALUEID,
            in_propertydefId: 11,
            in_valueString: values.genericName,
          },
          {
            in_propertyvalueId: data[2].PROPERTYVALUEID,
            in_propertydefId: 12,
            in_valueString: values.dosageForm,
          },
          {
            in_propertyvalueId: data[3].PROPERTYVALUEID,
            in_propertydefId: 13,
            in_valueString: values.strength,
          },
          {
            in_propertyvalueId: data[4].PROPERTYVALUEID,
            in_propertydefId: 14,
            in_valueString: values.unitOfMeasure,
          },
          {
            in_propertyvalueId: data[5].PROPERTYVALUEID,
            in_propertydefId: 15,
            in_valueString: values.manufacturer,
          },
          {
            in_propertyvalueId: data[6].PROPERTYVALUEID,
            in_propertydefId: 16,
            in_valueString: values.primarySupplier,
          },
          {
            in_propertyvalueId: data[7].PROPERTYVALUEID,
            in_propertydefId: 17,
            in_valueNumber: Number(values.minStock) || null,
          },
          {
            in_propertyvalueId: data[8].PROPERTYVALUEID,
            in_propertydefId: 18,
            in_valueNumber: Number(values.maxStock) || null,
          },
          {
            in_propertyvalueId: data[9].PROPERTYVALUEID,
            in_propertydefId: 19,
            in_valueNumber: Number(values.shelfLife) || null,
          },
          {
            in_propertyvalueId: data[10].PROPERTYVALUEID,
            in_propertydefId: 20,
            in_valueString: values.storageConditions,
          },
          {
            in_propertyvalueId: data[11].PROPERTYVALUEID,
            in_propertydefId: 21,
            in_valueBool: values.controlledDrug ? "Y" : "N",
          },
        ],
      };
      const res = await apiService.post("aoin_propertyvalue_ins", payload);
      if (res?.data?.results.some((r) => r.errorCode !== 9999)) {
        alert("Some properties failed: " + JSON.stringify(res.data.results));
      } else {
        alert("Equipment Deleted Successfully");
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMedicineData = async () => {
    try {
      const payload = {
        ulbId: ulbid,
      };
      // const res = await apiService.post("getMedicineList", payload);
      const res = await axios.post(`${API_BASE_URL}/getMedicineList`, payload);
      if (res?.data?.length > 0) {
        const data = res.data.map((data) => {
          return [
            data.MEDICINE_NAME,
            data.GENERIC_NAME,
            data.DOSAGE_FORM,
            data.STRENGTH,
            data.MAX_STOCK,
            data.PRIMARY_SUPPLIER_NAME,
            <div className="flex justify-center items-centr">
              <Link
                to={`/Transaction/FrmMedicineForm`}
                state={{
                  attributeId: data.ATTRIBUTE_ID,
                }}
                className="text-blue-600 underline border border-blue-500 p-1 rounded-md"
              >
                <Edit size={16} />
              </Link>
              <p
                onClick={() => handleDelete(data)}
                className="text-blue-600 underline ms-2 hover:cursor-pointer border border-red-500 p-1 rounded-md"
              >
                <Trash2 size={15} className="text-red-500" />
              </p>
            </div>,
          ];
        });
        setMedicineData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (ulbid) {
      fetchMedicineData();
    }
  }, [ulbid]);

  return (
    <Layout
      title="Medicine Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Medicine Management",
      }}
    >
      <div className="flex justify-start mb-4">
        {/* ✅ Add Button with Navigation */}
        <Button
          type="button"
          className="hover:cursor-pointer"
          onClick={() => navigate("/Transaction/FrmMedicineForm")}
        >
          Add New
        </Button>
      </div>

      <Table
        // headerlabel={"Medicine List"}
        headers={[
          "Name",
          "Generic Name",
          "Dosage Form",
          "Strength",
          "Max Stock",
          "Primary Supplier",
          "Actions",
        ]}
        data={medicineData}
      />
    </Layout>
  );
};

export default FrmMediManage;
