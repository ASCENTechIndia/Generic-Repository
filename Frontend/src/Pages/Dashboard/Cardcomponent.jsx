import React from "react";

const CardComponent = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default CardComponent;
