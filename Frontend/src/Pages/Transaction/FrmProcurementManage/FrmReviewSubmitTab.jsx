import React, { useState } from "react";
import { Star, CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "./style.css";
import { Formik, Form, Field } from "formik";
import InputField from "../../../Components/InputField";


const FrmReviewSubmitTab = ({
  selectedSupplier,
  poItems,
  deliveryDate,
  setDeliveryDate,
  onBack,
  onSubmit,
}) => {
  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative w-full cursor-pointer">
      <input
        ref={ref}
        value={value}
        readOnly
        onClick={onClick}
        placeholder="dd/mm/yyyy"
        className="w-full h-10 px-4 py-2 border border-[#ddd] rounded-md transition duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm text-sm sm:text-base placeholder-gray-400 bg-white"

      />
      <CalendarIcon
        size={18}
        className="text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={onClick}
      />
    </div>
  ));
  const renderStars = (rating) => {
    const [selectDate, setSelectedDate] = useState(new Date());
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

  const calculateTotals = () => {
    const subtotal = poItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];

  const { subtotal, tax, total } = calculateTotals();

  return (
      <Formik
  enableReinitialize={true}
  initialValues={{
    deliveryDate: deliveryDate || new Date(),
    deliveryAddress: "",
    notes: "",
  }}
   onSubmit={(values) => {
        setDeliveryDate(values.deliveryDate);
        onSubmit(values); // ✅ PASS VALUES TO PARENT
      }}
>

      {() => (
        <Form>
    <div className="purchase-order-page">
      <h4 className="font-medium mb-4">Review Purchase Order</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h5 className="font-medium mb-3">Supplier Information</h5>
          <div className="text-sm">
            <div className="font-medium">{selectedSupplier.name}</div>
            <div className="text-gray-500">{selectedSupplier.category}</div>
            <div className="flex items-center mt-1">
              {renderStars(selectedSupplier.rating)}
              <span className="ml-1 text-sm">{selectedSupplier.rating}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h5 className="font-medium mb-3">Delivery Information</h5>
          <div className="text-sm">
            <div className="mb-2">
              <label className="block text-gray-500 mb-1">
                Delivery Address
              </label>
              <Field
    name="deliveryAddress"
    type="text"
    className="w-full p-2 border border-gray-300 bg-white rounded-md"
  />
            </div>
            <div className="mb-2">
              <label className="block text-gray-500 mb-1">
                Expected Delivery Date
              </label>
              <div className="">
                {/* <DatePicker
                  selected={deliveryDate}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/yyyy"
                  onChange={(date) => setDeliveryDate(date)}
                  customInput={<CustomDateInput />}
                /> */}
                <Field
  name="deliveryDate"
  component={InputField}
  type="calendar"
  allowPastDates={false}  setDeliveryDate={setDeliveryDate}
/>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h5 className="font-medium mb-3">Order Items</h5>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-left text-gray-500 font-medium">
                  Item
                </th>
                <th className="py-2 text-left text-gray-500 font-medium">
                  Quantity
                </th>
                <th className="py-2 text-left text-gray-500 font-medium">
                  Total Amount
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
                  <td className="py-3">{item.quantity}</td>
                     <td className="py-3">  {Number(item.rate || 0) * Number(item.quantity || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h5 className="font-medium mb-3">Additional Notes</h5>
          <Field
    as="textarea"
    name="notes"
    rows="3"
    className="w-full p-2 border border-gray-300 rounded-md"
    placeholder="Add any special instructions or notes for this order..."
  />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          onClick={onBack} type="button"
        >
          Back
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          // onClick={onSubmit}
          type="submit"
        >
          Submit Purchase Order
        </button>
      </div>
    </div></Form>)}</Formik>
  );
};

export default FrmReviewSubmitTab;
