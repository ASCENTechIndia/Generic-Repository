import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserIconDropdown from "../../Components/UserIconDropdown"
import { toast } from "react-toastify";
import { FaBell } from "react-icons/fa";
import apiService from "../../../apiService";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// import headerBanner from "../../assets/MBMCLibraryLogo.jpg"; // 👈 add this


const Header = ({ toggleSidebar: parentToggleSidebar }) => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbId = user?.ulbId;
  const userName = user?.username;
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allAlerts, setAllAlerts] = useState([]);
  const notifiedAlertsRef = useRef(new Set());
const [loading, setLoading] = useState(false);
  const [corpName, setCorpName] = useState("");
  const [corpEName, setCorpEName] = useState("");
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const fetchCorpDetails = async () => {
      if (!ulbId) return;

      try {
        const res = await fetch(`${API_BASE_URL}/textLogo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ulbId }),
        });

        const data = await res.json();

        if (data.success) {
          setCorpName(data.data.ABC_MUNICIPAL_TEXT);
          setCorpEName(data.data.ABC_MUNICIPAL_ETEXT);
          setLogo(data.data.ULBLOGO);
        }
      } catch (err) {
        console.error("Error fetching corporation details:", err);
      }
    };

    fetchCorpDetails();
  }, [ulbId]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    parentToggleSidebar();
  };
useEffect(() => {
    if (!ulbId) return;

    const fetchExpiryList = async () => {
      try {
        setLoading(true);
        const { data } = await apiService.post("getNearExpiryList", { ulbid: ulbId });

        if (data.success) {
          const formatted = data.data.map((item, index) => ({
            id: index + 1,
            title: item.MEDICINE_NAME || item.EQUIPMENT_NAME || "Unknown",
            time: item.DAYS_REMAINING,
          }));

          setAllAlerts(formatted);

          // Show toast for items with DAYS_REMAINING <= 15
          formatted.forEach((item) => {
            const key = `${item.title}-${item.time}`;
            if (parseInt(item.time) <= 15 && !notifiedAlertsRef.current.has(key)) {
              toast.warn(`${item.title} is expiring in ${item.time} days!`);
              notifiedAlertsRef.current.add(key);
            }
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
    const interval = setInterval(fetchExpiryList, 5 * 60 * 1000); // Poll every 5 min
    return () => clearInterval(interval);
  }, [ulbId]);

  return (
    <header className="sticky top-0 z-30 w-full px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
      {/* Left - Menu Button + Search bar */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:cursor-pointer"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      
 {/* Center - Logo + Dynamic Header */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3
                      max-w-[80%] sm:max-w-[70%] md:max-w-[60%] px-2">

        {logo && (
          <img
            src={logo}
            alt="Corporation Logo"
            className="w-20 h-20 md:w-20 md:h-14 drop-shadow-sm"
          />
        )}

        <div className="text-center">
          <div className="relative inline-block">
            <h1 className="text-lg sm:text-base md:text-lg lg:text-xl font-bold
                           bg-gradient-to-r from-blue-800 to-blue-600 
                           bg-clip-text text-transparent
                           tracking-tight leading-tight whitespace-nowrap">
              {corpName || "Municipal Corporation"}
            </h1>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 
                            w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          </div>

           {/* {corpEName && (
            <p className="text-[10px] sm:text-xs md:text-sm text-blue-500 font-medium mt-1">
              {corpEName}
            </p>
          )}  */}
             <p className="text-[10px] sm:text-xs md:text-sm text-blue-500">
           Medical Inventory
          </p> 
        </div>
      </div>

        {/* Center - Static Banner Image */}
      {/* <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-[80%]">
        <img
          src={headerBanner}
          alt="Digital Library Header"
          // className="object-contain [image-rendering:crisp-edges]"
           className="max-h-20 md:max-h-24 lg:max-h-28 w-auto object-contain"
        />
      </div> */}


      {/* Right - Notification + User icon */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* <Dropdown /> */}
           <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"  onClick={() => navigate("/Transaction/FrmAlerts")} >
          <FaBell className="w-6 h-6 text-gray-600" />
          {allAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {allAlerts.length}
            </span>
          )}
        </button>
        <UserIconDropdown
          name={userName}
          // imageUrl="https://randomuser.me/api/portraits/men/75.jpg"
          className="w-8 h-8 md:w-9 md:h-9"
        />
      </div>
    </header>
  );
};

export default Header;
