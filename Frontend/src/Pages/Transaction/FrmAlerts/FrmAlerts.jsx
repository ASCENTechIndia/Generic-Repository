import React, { useState, useEffect, useRef } from "react";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import { FaBell, FaExclamationTriangle, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { formatDate } from "../../../utils/dateUtils";
import { useLoader } from "../../../Context/LoaderContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FrmAlerts = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("");
  const { user } = useAuth();
  const ulbId = user?.ulbId;
  const [allAlerts, setAllAlerts] = useState([]);
  const [customAlerts, setCustomAlerts] = useState([]);
  const notifiedAlertsRef = useRef(new Set());
  const [typeFilter, setTypeFilter] = useState("all"); // Medicine / Equipment
  const [searchTerm, setSearchTerm] = useState("");
  const [alertForFilter, setAlertForFilter] = useState("");

  useEffect(() => {
    if (!ulbId) return;

    const fetchExpiryList = async () => {
      try {
        setLoading(true);
        const { data } = await apiService.post("getNearExpiryList", {
          ulbid: ulbId,
        });
        console.log("Expiry List Data:", data);
        if (data.success) {
          const formatted = data.data.map((item, index) => {
            // Days remaining
            const daysRemaining = Number(item.DAYS_REMAINING);

            // Pharmacist remaining stock
            const pharmacistStock = Number(item.CURRENT_STOCK_PHARMACIST ?? 0);

            // Shopkeeper stock
            const shopkeeperStock = Number(
              item.MEDICINE_INITIAL_STOCK ?? item.EQUIPMENT_INITIAL_STOCK ?? 0
            );

            // Stock alert threshold
            const alertStock = Number(
              item.MEDICINE_ALERT_STOCKS ?? item.EQUIPMENT_ALERT_STOCKS ?? 0
            );

            const statuses = [];

            /* -------------------------
        EXPIRY STATUS
  -------------------------- */
            if (!isNaN(daysRemaining)) {
              let label = "";

              if (daysRemaining <= 0) label = "Expired";
              else if (daysRemaining <= 7) label = "Expiring Soon";
              else label = "Valid";

              statuses.push({
                label,
                statusType: "expiry",
                days: daysRemaining,
                color:
                  label === "Expired"
                    ? "bg-red-500"
                    : label === "Expiring Soon"
                    ? "bg-yellow-500"
                    : "bg-green-500",
              });
            }

            /* -------------------------
      PHARMACIST STOCK ALERTS
  -------------------------- */
            if (pharmacistStock <= 0) {
              statuses.push({
                label: "Out of Stock",
                statusType: "pharmacist",
                color: "bg-red-700",
              });
            } else if (pharmacistStock <= alertStock) {
              statuses.push({
                label: "Low Stock",
                statusType: "pharmacist",
                color: "bg-orange-500",
              });
            }

            /* -------------------------
      SHOPKEEPER STOCK ALERTS
  -------------------------- */
            if (shopkeeperStock <= alertStock) {
              statuses.push({
                label: "Low Shopkeeper Stock",
                statusType: "shopkeeper",
                color: "bg-purple-600",
              });
            }

            const title =
              item.MEDICINE_NAME || item.EQUIPMENT_NAME || "Unknown";
            const expiryDate =
              item.MEDICINE_EXPIRY_DATE || item.EQUIPMENT_EXPIRY_DATE;
            const type = item.ENTITY_TYPE;

            return {
              id: index + 1,
              title,
              description: expiryDate
                ? `Expiry Date: ${formatDate(expiryDate)}`
                : "No expiry info",

              statuses,
              type,
              alertFor: item.ALERT_FOR, // Backend-provided alert

              typeColor: type === "EQUIPMENT" ? "bg-blue-500" : "bg-purple-500",

              borderColor: statuses.some((s) =>
                ["Expired", "Out of Stock"].includes(s.label)
              )
                ? "border-l-4 border-red-500"
                : statuses.some((s) =>
                    [
                      "Expiring Soon",
                      "Low Stock",
                      "Low Shopkeeper Stock",
                    ].includes(s.label)
                  )
                ? "border-l-4 border-yellow-500"
                : "border-l-4 border-green-500",

              time: isNaN(daysRemaining)
                ? "No expiry info"
                : daysRemaining <= 0
                ? "Expired"
                : `${daysRemaining} days remaining`,

              stockInfo: `Pharmacist: ${pharmacistStock} | Shopkeeper: ${shopkeeperStock}`,
            };
          });

          setAllAlerts(formatted);

          // Clear previous notifications
          // notifiedAlertsRef.current.clear();

          // Trigger toasts
          formatted.forEach((item) => {
            item.statuses.forEach((s) => {
              let label = s.label;
              const key = `${item.title}-${s.statusType}-${label}`;

              // handle expiry label manually
              if (
                s.statusType === "expiry" &&
                (s.days === null || s.days <= 0)
              ) {
                label = "Expired";
              }

              // Only show alert if not already shown
              if (
                [
                  "Expiring Soon",
                  "Expired",
                  "Low Stock",
                  "Out of Stock",
                ].includes(label) &&
                !notifiedAlertsRef.current.has(key)
              ) {
                toast.warn(`${item.title} - ${label}!`, {
                  toastId: key, // stable unique key
                  autoClose: 5000,
                  position: "top-right",
                  pauseOnHover: true,
                  closeOnClick: true,
                });

                // Track it for both expiry and stock
                notifiedAlertsRef.current.add(key);
              }
            });
          });
        } else {
          toast.error("Failed to fetch alerts.");
        }
      } catch (err) {
        console.error("Error fetching expiry list:", err);
        toast.error("Something went wrong while fetching alerts.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpiryList();
    const interval = setInterval(fetchExpiryList, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [ulbId]);

  const filteredAlerts = allAlerts.filter((alert) => {
    // ✅ Type filter
    if (typeFilter !== "all") {
      if (typeFilter === "stock" && alert.type !== "MEDICINE") return false;
      if (typeFilter === "expiry" && alert.type !== "EQUIPMENT") return false;
      if (alertForFilter && alert.alertFor !== alertForFilter) return false; // ✅ ADD THIS LINE
    }

    // ✅ Status filter (अब multiple statuses सपोर्ट करेंगे)
    if (statusFilter) {
      if (
        (statusFilter === "valid" &&
          !alert.statuses.some((s) => s.label === "Valid")) ||
        (statusFilter === "warning_expiring" &&
          !alert.statuses.some((s) => s.label === "Expiring Soon")) ||
        (statusFilter === "warning_lowstock" &&
          !alert.statuses.some((s) => s.label === "Low Stock")) ||
        (statusFilter === "critical_expired" &&
          !alert.statuses.some((s) => s.label === "Expired")) ||
        (statusFilter === "critical_outofstock" &&
          !alert.statuses.some((s) => s.label === "Out of Stock"))
      ) {
        return false;
      }
    }

    // ✅ Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (
        !alert.title.toLowerCase().includes(searchLower) &&
        !alert.description.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    return true;
  });

  // Render Alerts List
  const renderAlertsList = (alerts) => (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`bg-white p-4 rounded shadow-sm relative cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md hover:bg-gray-50 ${alert.borderColor}`}
        >
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <h4 className="text-md font-semibold text-gray-800">
                {alert.title}
              </h4>
              {alert.alertFor && (
                <span
                  className={`px-2 py-1 text-xs text-white rounded ${
                    alert.alertFor === "Shopkeeper"
                      ? "bg-green-600"
                      : alert.alertFor === "Pharmacist"
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  }`}
                >
                  {alert.alertFor}
                </span>
              )}

              {/* ✅ Multiple status badges */}
              {(alert.statuses || []).map((s, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-1 text-xs text-white rounded ${s.color}`}
                >
                  {s.label}
                </span>
              ))}

              <span
                className={`px-2 py-1 text-xs text-white rounded ${alert.typeColor}`}
              >
                {alert.type}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600">{alert.description}</p>
          <div className="text-xs text-gray-400 mt-2">{alert.time}</div>
          <div className="text-xs text-gray-400 mt-2">{alert.stockInfo}</div>
        </div>
      ))}
    </div>
  );

  const renderMessage = (message) => (
    <div className="bg-white p-4 rounded shadow-sm text-center text-gray-500 py-10">
      {message}
    </div>
  );

  return (
    <Layout
      title="Alerts & Notifications"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Alerts & Notifications",
      }}
    >
      <div className="space-y-6">
        {/* Filters + Search + Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={alertForFilter}
            onChange={(e) => setAlertForFilter(e.target.value)}
          >
            <option value="">All Users</option>
            <option value="Shopkeeper">Shopkeeper</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Both">Both</option>
          </select>

          <select
            className="p-2 border border-gray-300 rounded-md"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="stock">Medicine</option>
            <option value="expiry">Equipment</option>
          </select>

          <select
            className="p-2 border border-gray-300 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="valid">Valid</option>
            <option value="warning_expiring">Expiring Soon</option>
            <option value="warning_lowstock">Low Stock</option>
            <option value="critical_expired">Expired</option>
            <option value="critical_outofstock">Out of Stock</option>
          </select>

          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-64"
          />
        </div>

        {/* Tabs */}
        {/* Tab Buttons */}
        <div className="flex items-center gap-6 border-b">
          {["all", "custom"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              {tab === "all" && "All Alerts"}
              {/* {tab === "custom" && "Custom Alerts"} */}
            </button>
          ))}
        </div>

        {activeTab === "all"
          ? filteredAlerts.length > 0
            ? renderAlertsList(filteredAlerts) // ✅ filter apply kiya
            : renderMessage("All alerts would be displayed here.")
          : activeTab === "custom"
          ? customAlerts && customAlerts.length > 0
            ? renderAlertsList(customAlerts)
            : renderMessage("Custom alerts would be displayed here.")
          : null}
      </div>
    </Layout>
  );
};

export default FrmAlerts;
