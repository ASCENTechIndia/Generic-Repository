import React, { useState, useEffect } from "react";
import Table from "../../../Components/Table";
import { Eye, Edit, Trash2 } from "lucide-react"; // ✅ icons
import HeaderLabel from "../../../Components/HeaderLabel";
import Layout from "../../../Components/Layout";
import apiService from "../../../../apiService";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../Components/Button";
import { useAuth } from "../../../Context/AuthContext";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";
import { formatDatebyMonthSmall } from "../../../utils/dateUtils";
import { useLoader } from "../../../Context/LoaderContext";

const FrmEquipManage = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const userId = user?.userId;
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [tableData, setTableData] = useState([]);
  const headers = [
    "ID",
    "Name",
    "Model",
    "Serial No",
    "Location",
    "Status",
    "Actions",
  ];

  const handleDelete = async (values) => {
    const payld = {
      entityType: "EQUIPMENT",
      ulbId: ulbid,
      attributeId: values.attribute_id,
    };
    const res = await apiService.post("getItemdetails", payld);
    if (!res?.data || res?.data?.length <= 0) {
      return;
    }
    const data = res.data;
    try {
      setLoading(true);
      const attributeId = values.attribute_id;
      const ip = await GetIPAddress();
      const payload = {
        in_userId: userId,
        in_mode: 3,
        in_ulbId: ulbid,
        in_entityId: 32,
        in_ipaddress: ip,
        in_source: config.source,
        attributeId: attributeId ? attributeId : 0,
        values: [
          {
            in_propertyvalueId: data[0].PROPERTYVALUEID,
            in_propertydefId: 43,
            in_valueString: values.equipment_name,
          },
          {
            in_propertyvalueId: data[1].PROPERTYVALUEID,
            in_propertydefId: 44,
            in_valueString: values.model,
          },
          {
            in_propertyvalueId: data[2].PROPERTYVALUEID,
            in_propertydefId: 45,
            in_valueNumber: values.serial_number,
          },
          {
            in_propertyvalueId: data[3].PROPERTYVALUEID,
            in_propertydefId: 46,
            in_valueString: values.category,
          },
          {
            in_propertyvalueId: data[4].PROPERTYVALUEID,
            in_propertydefId: 47,
            in_valueString: values.manufacturer,
          },
          {
            in_propertyvalueId: data[5].PROPERTYVALUEID,
            in_propertydefId: 48,
            in_valueString: values.supplier,
          },
          {
            in_propertyvalueId: data[6].PROPERTYVALUEID,
            in_propertydefId: 49,
            in_valueDate: formatDatebyMonthSmall(values.purchase_date),
          },
          {
            in_propertyvalueId: data[7].PROPERTYVALUEID,
            in_propertydefId: 50,
            in_valueDate: formatDatebyMonthSmall(values.warranty_until),
          },
          {
            in_propertyvalueId: data[8].PROPERTYVALUEID,
            in_propertydefId: 51,
            in_valueString: values.current_location,
          },
          {
            in_propertyvalueId: data[9].PROPERTYVALUEID,
            in_propertydefId: 52,
            in_valueString: values.status,
          },
          {
            in_propertyvalueId: data[10].PROPERTYVALUEID,
            in_propertydefId: 53,
            in_valueString: values.notes,
          },
          {
            in_propertyvalueId: data[11]?.PROPERTYVALUEID,
            in_propertydefId: 54,
            in_valueJson: values.imageBase64,
          },
          {
            in_propertyvalueId: data[12].PROPERTYVALUEID,
            in_propertydefId: 55,
            in_valueString: values.warranty_alert,
          },
          {
            in_propertyvalueId: data[13].PROPERTYVALUEID,
            in_propertydefId: 56,
            in_valueString: values.total_stocks,
          },
          {
            in_propertyvalueId: data[14].PROPERTYVALUEID,
            in_propertydefId: 57,
            in_valueString: values.warranty_until,
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
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      const payload = { ulbId: ulbid };
      const res = await apiService.post("getEquipmentList", payload);
      if (res?.data?.length > 0) {
        const data = res.data.map((data) => {
          return [
            data.attribute_id,
            data.equipment_name,
            data.model,
            data.serial_number,
            data.current_location,
            data.status,
            <div className="flex justify-center items-centr">
              <Link
                to={`/Transaction/FrmEquipmentForm`}
                state={{
                  attributeId: data.attribute_id,
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
        setTableData(data);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid) {
      fetchEquipmentData();
    }
  }, [ulbid]);

  return (
    <Layout
      title="Equipment Management"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Equipment Management",
      }}
    >
      <div className="flex justify-start mb-4">
        <Button
          type="button"
          className="hover:cursor-pointer"
          onClick={() => navigate("/Transaction/FrmEquipmentForm")}
        >
          Add New
        </Button>
      </div>

      <Table  headers={headers} data={tableData} />
    </Layout>
  );
};

export default FrmEquipManage;
