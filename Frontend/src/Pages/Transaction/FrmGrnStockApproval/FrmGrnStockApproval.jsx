import { useState, useEffect, useCallback } from "react";
import {
  Edit,
  Truck,
  X,
} from "lucide-react";

import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";
import Table from "../../../Components/Table";
import { useNavigate } from "react-router-dom";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import FrmCreatePurchaseOrderPage from "../FrmProcurementManage/FrmCreatePurchaseOrderPage";
import ThreeTablePdf from "../FrmProcurementManage/ThreeTablePDF";

const FrmGrnStockApproval = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ulbId = user?.ulbId;
  const { setLoading } = useLoader();
  const username = user?.username;
  const [showGRNDetail, setShowGRNDetail] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState(null);
  const [createPOModal, setCreatePOModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [GRNList, setGRNList] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [ulbName, setUlbName] = useState("");

  const handleViewPO = (po) => {
    setSelectedGRN(po);
    setShowGRNDetail(true);
  };

  const urlToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const fetchGRNList = async () => {
  try {
    const res = await apiService.post("getGoodsReceiptNoteList", {
      ulbId: ulbId,
    });

    if (res?.data?.success && Array.isArray(res.data.data)) {
      const mapped = res.data.data.map((row) => ({
        id: row.GRN_ID,
        pono: row.PONO,
        supplier: row.VENDOR_NAME, 
        challanNo: row.INVOICE_NO,
        challanDate: row.CHALLAN_DATE,
        status: row.STATUS === "A" ? "Approved" : row.STATUS === "R" ? "Rejected" : "Pending",
        statusClass:
          row.STATUS === "A"
            ? "bg-green-100 text-green-700"
            : row.STATUS === "R"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700",
      }));

      setGRNList(mapped);
    }
  } catch (error) {
    console.error("GRN list error:", error);
  }
};

  const fetchLogoAndName = async () => {
    try {
      setLoading(true);
      const logoRes = await  apiService.post(`textlogo`,{ulbId:user?.ulbId});
      if (logoRes.data?.success) {
        const { ULBLOGO, ABC_MUNICIPAL_TEXT } = logoRes.data.data;

        const base64Logo = await urlToBase64(ULBLOGO);

        setLogoUrl(base64Logo);
        setUlbName(ABC_MUNICIPAL_TEXT + " ");
      }
    } catch (error) {
      console.error("Error fetching ULB logo/name:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.ulbId) {
      fetchLogoAndName();
      fetchGRNList();
    }
  }, [user?.ulbId]);

  return (
    <Layout
      title="GRN Approval"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "GRN Approval",
      }}
    >
      <div className="p-6">
    
      
          <>

            {/* Purchase Orders Table */}
            <div>
              {/* <div className="p-4 border-b flex justify-between items-center">
                <Label text="Goods Receipt Notes" className="font-semibold" />
              </div> */}

            <Table
            headers={[
                "PO Number",
                "Supplier",
                "Challan Number",
                "Challan Date",
                "Status",
                "Actions",
            ]}
            data={GRNList.map((po) => [
            po.pono,
                // Supplier
                po.supplier,

                // Challan Number
                po.challanNo,

                // Challan Date
                new Date(po.challanDate).toLocaleDateString("en-GB"),

                // Status badge
                <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${po.statusClass}`}
                >
                {po.status}
                </span>,

                // Actions
                <div className="flex space-x-2 justify-center">
                <Button
                    variant="outline"
                    onClick={() =>
                    navigate(
                        `/Transaction/FrmEditGrnStockApproval?mode=2&id=${po.id}`, {
                          state: {
                            statusGRN: po.status, 
                          }
                        } 
                    )
                    }
                >
                    <Edit className="w-4 h-4 text-blue-600" />
                </Button>
                </div>,
            ])}
            />
            </div>
          </>
    
      </div>
    </Layout>
  );
};

export default FrmGrnStockApproval;
