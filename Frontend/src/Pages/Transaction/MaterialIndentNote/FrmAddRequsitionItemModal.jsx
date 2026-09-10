import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmAddItemModal = ({ onClose, onAddItem, categoryList }) => {
  const { user } = useAuth();
  const { setLoading } = useLoader();

  const ulbId = user?.ulbId;

  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);

  // 🔹 Fetch item master list
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await apiService.post("GetItemList", {
          ulbId: ulbId,
        });

        if (res?.data) {
          const mappedData = res.data.map((item) => {
            const categoryObj = categoryList.find(
              (c) => c.category_name === item["Category"],
            );

            return {
              id: item["Item Id"],
              name: item["Item Name"],
              Vendor: item["Vendor"],
              categoryId: categoryObj?.category_id, // 🔥 important
              categoryName: item["Category"], // for UI
              quantity: 1,
              currentStock: 9999,
            };
          });

          setItems(mappedData);
        }
      } catch (error) {
        console.error("❌ Error fetching item list:", error);
      } finally {
        setLoading(false);
      }
    };

    if (ulbId) {
      fetchItems();
    }
  }, [ulbId]);

  // 🔍 Search filter
  const filteredItems = items.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Vendor?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-lg">Add Items</h3>
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
              placeholder="Search item name or category..."
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
                  <th className="py-2 text-left text-gray-500 font-medium">
                    Item Name
                  </th>
                  <th className="py-2 text-left text-gray-500 font-medium">
                    Supplier
                  </th>
                  <th className="py-2 text-left text-gray-500 font-medium">
                    Category
                  </th>
                  <th className="py-2 text-left text-gray-500 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">{item.Vendor}</td>
                    <td className="py-3">{item.categoryName}</td>
                    <td className="py-3">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        variant="primary"
                        onClick={() => onAddItem(item)}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrmAddItemModal;