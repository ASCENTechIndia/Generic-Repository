import React, { useEffect, useState } from "react";
import {
  Hospital,
  LayoutDashboard,
  Tablets,
  Shapes,
  BaggageClaim,
  Boxes,
  HandCoinsIcon,
  ClipboardList,
  Bell,
  ChartColumn,
  ChevronDown,
} from "lucide-react";
import SidebarItem from "../../Components/SidebarItem";
import apiService from "../../../apiService";
import { useAuth } from "../../Context/AuthContext";

// 🔹 Icon mapping by menu label
const iconMap = {
  Home: LayoutDashboard,
  "Category List": Tablets,
  "Item List": Tablets,
  "Facility List": Tablets,
  "Department List": Tablets,
  "Vendor List": Tablets,
  "Medicine Management": Tablets,
  "Equipment Management": Shapes,
  Procurement: BaggageClaim,
  "Procurement Approval": BaggageClaim,
  "Issue / Dispense": HandCoinsIcon,
  "Current Stocks": Boxes,
  Return: ClipboardList,
  "Return List": ClipboardList,
  Alerts: Bell,
  Reports: ChartColumn,
  Default: Shapes,
};

const Navbar = ({ title = "MedInvent", isOpen, onClose }) => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({}); // 🔹 accordion state

  const { user } = useAuth();
  const effectiveUser = user || JSON.parse(localStorage.getItem("user"));
  const userId = effectiveUser?.userId;
  const ulbId = effectiveUser?.ulbId;
  const deptId = effectiveUser?.deptId;

  // 🔹 Toggle accordion
  const toggleSection = (menuId) => {
    setOpenSections((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // 🔹 Fetch menus
  useEffect(() => {
    if (!userId || !ulbId || !deptId) return;

    const loadMenus = async () => {
      try {
        const payload = { userId, ulbId: Number(ulbId), deptId };
        const res = await apiService.post("inventoryMenus", payload);

        if (res?.data?.success) {
          setMenuData(res.data.data || []);
        }
      } catch (err) {
        console.error("Menu fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, [userId, ulbId, deptId]);

  // 🔹 Convert flat menu into tree
  const buildTree = (data = []) => {
    const map = {};
    const roots = [];

    data.forEach((item) => {
      map[item.MENUID] = { ...item, children: [] };
    });

    data.forEach((item) => {
      if (item.PARENTID && map[item.PARENTID]) {
        map[item.PARENTID].children.push(map[item.MENUID]);
      } else {
        roots.push(map[item.MENUID]);
      }
    });

    return roots;
  };

  const menuTree = buildTree(menuData);

  return (
    <div
      className={`z-50 bg-white text-gray-800 h-screen w-64 flex flex-col fixed md:relative shadow-lg border-r border-gray-200 overflow-y-auto transition-all duration-300
       ${isOpen ? "translate-x-0" : "-translate-x-full"}
       md:translate-x-0
       ${isOpen ? "md:relative" : "md:-ml-64"}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-center p-4 border-b border-gray-200 bg-blue-50">
        <span className="text-lg font-bold flex items-center gap-2 text-blue-600">
          <Hospital className="w-5 h-5" />
          {title}
        </span>
      </div>

      {/* Scrollable Content */}
      <nav className="flex-1 overflow-y-auto py-2 flex flex-col">
        {loading ? (
          <div className="px-4 text-sm text-gray-400">Loading menus...</div>
        ) : (
          <>
            {/* Home */}
            <div className="mb-4">
              <SidebarItem
                icon={LayoutDashboard}
                label="Home"
                path="/dashboard"
                isOpen={true}
                onClick={() => onClose && onClose()}
              />
            </div>

            {/* 🔹 Accordion Menu */}
            {menuTree.map((section) => {
              const isOpenSection = openSections[section.MENUID] ?? false;

              return (
                <div key={section.MENUID} className="mb-2">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.MENUID)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition"
                  >
                    <span>{section.MENUTITLE}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpenSection ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Children */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpenSection ? "max-h-120 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-1 pl-2">
                      {(section.children || []).map((item) => {
                        const Icon =
                          iconMap[item.MENUTITLE] || iconMap.Default;

                        return (
                          <SidebarItem
                            key={item.MENUID}
                            icon={Icon}
                            label={item.MENUTITLE}
                            path={item.PAGEPATH}
                            isOpen={true}
                            onClick={() => onClose && onClose()}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;