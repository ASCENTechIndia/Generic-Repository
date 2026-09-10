
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";

const FrmSelectSupplierTab = ({
  selectedSupplier,
  setSelectedSupplier,
  onNext,
}) => {
  const [suppliers, setSuppliers] = useState([]);
  const { user } = useAuth();
  const ulbId = user?.ulbId;

  useEffect(() => {
  if (!ulbId) return;

  const fetchSuppliers = async () => {
    try {
      const payload = { ulbId };
      const { data } = await apiService.post("getVendorsDropdown", payload);

      // ✅ data direct array आहे
      if (Array.isArray(data)) {
        const mappedSuppliers = data.map((vendor) => ({
          id: vendor.VENDORID,
          name: vendor.VENDOR_NAME,
          category: vendor.VENDOR_ADDRESS,
          rating: vendor.RATING || 0,
          contactPerson: vendor.CONTACT_PERSON,
          email: vendor.EMAIL,
          phone: vendor.PHONE,
        }));

        setSuppliers(mappedSuppliers);
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]);
    }
  };

  fetchSuppliers();
}, [ulbId]);
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key={fullStars}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={fullStars + i + (hasHalfStar ? 1 : 0)}
          className="w-4 h-4 text-yellow-400"
        />
      );
    }

    return stars;
  };

  return (
    <div className="">
      <div>
        <h4 className="font-medium mb-4">Select from existing suppliers:</h4>
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {suppliers.map((supplier) => (
    <div
      key={supplier.id}
      className={`border rounded-lg p-4 cursor-pointer ${
        selectedSupplier?.id === supplier.id
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-blue-300"
      }`}
      onClick={() => setSelectedSupplier(supplier)}
    >
      <div className="text-center">
        <h5 className="font-medium">{supplier.name}</h5>
        <p className="text-sm text-gray-500 mb-2">{supplier.category}</p>
        <div className="flex justify-center items-center mb-2">
          {renderStars(supplier.rating)}
          <span className="ml-1 text-sm">{supplier.rating}</span>
        </div>
        <button className="text-sm text-blue-600 font-medium">Select</button>
      </div>
    </div>
  ))}

  {suppliers.length === 0 && (
    <p className="text-sm text-gray-500">No suppliers available.</p>
  )}
</div>

      </div>

      {/* <div>
        <h4 className="font-medium mb-4">Or add a new supplier:</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Supplier
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default FrmSelectSupplierTab;
