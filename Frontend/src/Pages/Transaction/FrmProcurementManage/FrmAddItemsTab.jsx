

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import FrmAddItemModal from "./FrmAddItemModal";

const FrmAddItemsTab = ({ poItems, setPoItems, onNext, onBack,selectedSupplier  }) => {
  const [addItemModal, setAddItemModal] = useState(false);

const updateQuantity = (id, newQuantity) => {
  const item = poItems.find((i) => i.id === id);
  if (!item) return;

  if (newQuantity < 1) return;

  // if (newQuantity > item.currentStock) {
  //   alert(`You cannot add more than ${item.currentStock} units. Limited stock!`);
  //   return;
  // }

  setPoItems(
    poItems.map((i) =>
      i.id === id
        ? { ...i, quantity: newQuantity, total: newQuantity * i.price }
        : i
    )
  );
};


  const removeItem = (id) => {
    setPoItems(poItems.filter((item) => item.id !== id));
  };
const isQuantityValid = () => {
  return poItems.every((item) => item.quantity <= item.currentStock);
};


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Add Items from Inventory</h4>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm flex items-center"
          onClick={() => setAddItemModal(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Item
        </button>
      </div>

      {poItems.length > 0 ? (
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-left text-gray-500 font-medium w-32">
                  Item
                </th>
                <th className="py-2 text-left text-gray-500 font-medium w-32">
                  Category
                </th>
                 <th className="py-2 text-left text-gray-500 font-medium w-32">
                  Rate
                </th>
                <th className="py-2 text-left text-gray-500 font-medium w-32">
                  Quantity
                </th>
                  <th className="py-2 text-left text-gray-500 font-medium w-32">
                  Total Amount
                </th>
                <th className="py-2 text-left text-gray-500 font-medium w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {poItems.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <td className="py-3">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.id}</div>
                    </div>
                  </td>
                  <td className="py-3">{item.category}</td>
                    <td className="py-3">{item.rate}</td>
                 <td className="py-3">
  <div className="flex items-center border border-gray-300 rounded-md w-fit">
    
    {/* Minus Button */}
    <button
      className="px-2 py-1 text-gray-500 hover:bg-gray-100"
      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
    >
      -
    </button>

    {/* Editable Quantity Input */}
    <input
      type="number"
      className="w-16 text-center outline-none px-1 py-1"
      value={item.quantity}
      onChange={(e) => {
        let val = parseInt(e.target.value, 10);

        if (isNaN(val) || val < 0) val = 0; // prevent negative  
        updateQuantity(item.id, val);
      }}
    />

    {/* Plus Button */}
    <button
      className="px-2 py-1 text-gray-500 hover:bg-gray-100"
      onClick={() => updateQuantity(item.id, item.quantity + 1)}
    >
      +
    </button>

  </div>
</td>
<td className="py-3 font-medium">
  {Number(item.rate || 0) * Number(item.quantity || 0)}
</td>
                  <td className="py-3">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center mb-6">
          <div className="text-gray-400 mb-2">No items added yet</div>
          <button
            className="text-blue-600 font-medium"
            onClick={() => setAddItemModal(true)}
          >
            Add your first item
          </button>
        </div>
      )}

      

      {addItemModal && (
        <FrmAddItemModal
        vendorId={selectedSupplier?.id} 
          onClose={() => setAddItemModal(false)}
          onAddItem={(item) => {
            const existingItem = poItems.find((i) => i.id === item.id);
const stock = item.currentStock; // Make sure this exists
console.log(item);
 if (existingItem) {
              setPoItems(
                poItems.map((i) =>
                  i.id === item.id
                    ? {
                        ...i,
                        quantity: i.quantity + item.quantity,
                        total: (i.quantity + item.quantity) * i.price,
                      }
                    : i
                )
              );
            } else {
              setPoItems([
                ...poItems,
                {
                  id: item.id,
                  name: item.name,
                  category: item.category,
                  categoryid: item.categoryid,  
                  price: item.price,
                  quantity: item.quantity,
                  rate: item.rate,
                  total: item.price,
                  currentStock: stock,
                },
              ]);
            }
            setAddItemModal(false);
          }}
        />
      )}
    </div>
  );
};

export default FrmAddItemsTab;
