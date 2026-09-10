



// import React, { useState, useEffect } from "react";
// import { X, Search } from "lucide-react";
// import apiService from "../../../../apiService";
// import { useAuth } from "../../../Context/AuthContext";
// import { useLoader } from "../../../Context/LoaderContext";

// const FrmAddItemModal = ({ onClose, onAddItem }) => {
//   const { user } = useAuth();
//   const {setLoading}=useLoader();

//   const ulbId = user?.ulbId;

//   const [searchTerm, setSearchTerm] = useState("");
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       setLoading(true);
//       try {
//         const res = await apiService.post("getStocksList", {
//           entityType: "",
//           ulbId: ulbId,
//         });

//         if (res?.data) {
//           const mappedData = res.data.map((item) => {
//             let itemName = "";
//             let unit = "";
//             let price = 0;
//             let stocks = 0;
//             if (item.ENTITY_TYPE === "MEDICINE") {
//               itemName = `${item.MEDICINE_NAME || ""}`
//               unit = item.UOM || "Unit";
//               price = item.UNIT_PRICE || 0;
//               stocks = item.MAX_STOCK || 0;
//             } else if (item.ENTITY_TYPE === "EQUIPMENT") {
//               itemName = `${item.EQUIPMENT_NAME || ""} `
//               // ${item.MODEL || ""} ${
//               //   item.SERIAL_NUMBER || ""
//               // }`.trim();
//               unit = "Units";
//               price = item.UNIT_PRICE || 0;
//               stocks = item.TOTAL_STOCKS || 0;
//             } else {
//               itemName = "Unnamed Item";
//               unit = "Unit";
//             }

//             return {
//               id: item.ATTRIBUTE_ID,
//               name: itemName,
//               strength : item.STRENGTH, 
//               // ${item.STRENGTH || ""} ${
//               //   item.UOM || ""
//               category: item.ENTITY_TYPE,
//               stock: stocks || 0,
//               currentStock: stocks || 0,    
//               unit,
//               stockStatus:
//                 (stocks|| 0) <= 10
//                   ? "text-red-500"
//                   : (stocks|| 0) <= 100
//                   ? "text-yellow-500"
//                   : "text-green-500",
//             };
//           });

//           setItems(mappedData);
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching stock list:", error);
//       }
//     };

//     if (ulbId) {
//       fetchItems();
//     }
//   }, [ulbId]);

//   // filter items by search
//   const filteredItems = items.filter(
//     (item) =>
//       item.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//           <h3 className="font-semibold">Add Items from Inventory</h3>
//           <button
//             className="p-1 text-gray-500 hover:bg-gray-100 rounded-md"
//             onClick={onClose}
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Search */}
//         <div className="p-4 border-b border-gray-200">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search items..."
//               className="pl-10 w-full p-2 border border-gray-300 rounded-md"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="p-4">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="py-2 text-left text-gray-500 font-medium">
//                     Item Code
//                   </th>
//                   <th className="py-2 text-left text-gray-500 font-medium">
//                     Item Name
//                   </th>
//                   <th className="py-2 text-left text-gray-500 font-medium">
//                     Category
//                   </th>
//                   <th className="py-2 text-left text-gray-500 font-medium">
//                     Current Stock
//                   </th> 
//                   {/* <th className="py-2 text-left text-gray-500 font-medium">
//                     Strength
//                   </th> */}
//                   {/* <th className="py-2 text-left text-gray-500 font-medium">
//                     Unit
//                   </th> */}
//                   <th className="py-2 text-left text-gray-500 font-medium">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredItems.map((item, index) => (
//                   <tr
//                     key={index}
//                     className="border-b border-gray-200 last:border-b-0"
//                   >
//                     <td className="py-3">{item.id}</td>
//                     <td className="py-3">{item.name}</td>
//                     <td className="py-3">{item.category}</td>
//                     <td className="py-3">
//                       <span className={item.stockStatus}>{item.stock}</span>
//                     </td>
//                     <td className="py-3">
//                       <button
//                         className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
//                         onClick={() => onAddItem(item)}
//                       >
//                         Add
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredItems.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="text-center py-4 text-gray-500">
//                       No items found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FrmAddItemModal;


import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmAddItemModal = ({ onClose, onAddItem, vendorId }) => {
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;

  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchItems = async () => {
      if (!ulbId || !vendorId) return;

      setLoading(true);
      try {
        const res = await apiService.post("getPoItemsBySup", {
          ulbId,
          vendorId,
          page,
          pageSize,
        });
        console.log("📦 Fetched items for supplier:", res?.data?.data || []);
        if (res?.data?.data) {
          const mappedData = res.data.data.map((item) => ({
            id: item.NUM_ITEM_ID,
            name: item.VAR_REQITEMDET_NAME || "N/A",
            category: item.VAR_CATEGORY_NAME,
            categoryid: item.NUM_CATEGORY_ID,
            stock: item.QTY || 0,
            currentStock: item.QTY || 0,
            quantity:item.QTY || 0,
            rate: item.NUM_ITEM_RATE || 0, 
            unit: "Units",
            stockStatus:
              (item.QTY || 0) <= 10
                ? "text-red-500"
                : (item.QTY || 0) <= 100
                ? "text-yellow-500"
                : "text-green-500",
          }));

          setItems(mappedData);
        }
      } catch (error) {
        console.error("❌ Error fetching PO items by supplier:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [ulbId, vendorId, page]);

  // 🔎 Search Filter
  const filteredItems = items.filter((item) =>
    [item.id, item.name, item.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold">Add Items from Inventory</h3>
          <button
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-md"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-left text-gray-500 font-medium">Item Code</th>
                  <th className="py-2 text-left text-gray-500 font-medium">Item Name</th>
                  <th className="py-2 text-left text-gray-500 font-medium">Category</th>
                  <th className="py-2 text-left text-gray-500 font-medium">Rate</th>
                  <th className="py-2 text-left text-gray-500 font-medium">Quantity</th>
                  <th className="py-2 text-left text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 last:border-b-0">
                    <td className="py-3">{item.id}</td>
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">{item.category}</td>
                    <td className="py-3">{item.rate}</td>
                    <td className="py-3">
                      <span className={item.stockStatus}>{item.stock}</span>
                    </td>
                    <td className="py-3">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                        onClick={() => onAddItem(item)}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 🔢 Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">Page {page}</span>

            <button
              disabled={items.length < pageSize}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrmAddItemModal;