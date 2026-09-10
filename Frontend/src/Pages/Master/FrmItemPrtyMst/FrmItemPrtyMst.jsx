import React, { useEffect, useState } from "react";
import Button from "../../../Components/Button";
import Label from "../../../Components/Label";

function FrmItemPrtyMst({ entityId, entityType }) {
  const [properties, setProperties] = useState([]);
  const [values, setValues] = useState({});

  // Fetch property definitions from backend
useEffect(() => {
  fetch("http://localhost:5000/getPropertyDefinitions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityType }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Property API response:", data);
      setProperties(data.data || data); // handle both plain array or wrapped
    })
    .catch((err) => console.error("Error fetching definitions:", err));
}, [entityType]);

  // Handle field change
  const handleChange = (def, e) => {
    let newValue;

    switch (def.var_property_datatype) {
      case "BOOLEAN":
        newValue = e.target.checked; // keep it boolean, backend will map Y/N
        break;
      case "NUMBER":
        newValue = e.target.value ? Number(e.target.value) : null;
        break;
      case "DATE":
        newValue = e.target.value; // string in YYYY-MM-DD format
        break;
      default: // STRING
        newValue = e.target.value;
    }

    setValues((prev) => ({
      ...prev,
      [def.num_propertydef_id]: newValue,
    }));
  };

  // Submit values to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      entityId,
      values: Object.entries(values).map(([defId, val]) => ({
        num_propertyvalue_propertydefid: Number(defId),
        value: val,
      })),
    };

    const res = await fetch("http://localhost:5000/savePropertyValues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Item properties saved successfully!");
    } else {
      alert("Failed to save item properties");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-lg rounded-2xl w-full max-w-3xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-700">
        {entityType} - Add Item Properties
      </h2>

      <table className="w-full border border-gray-200 rounded-lg">
      {properties.map((def) => (
  <tr key={def.NUM_PROPERTYDEF_ID} className="border-b">
    <td className="p-2 bg-gray-50 w-1/3">
      <Label 
        text={def.VAR_PROPERTY_DISPLAYLABEL} 
        required={def.VAR_PROPERTY_REQUIRED === "Y"} 
      />
    </td>
    <td className="p-2">
      {def.VAR_PROPERTY_DATATYPE === "STRING" && (
        <input
          type="text"
          className="w-full border rounded px-2 py-1"
          onChange={(e) => handleChange(def, e)}
        />
      )}
      {def.VAR_PROPERTY_DATATYPE === "NUMBER" && (
        <input
          type="number"
          className="w-full border rounded px-2 py-1"
          onChange={(e) => handleChange(def, e)}
        />
      )}
      {def.VAR_PROPERTY_DATATYPE === "DATE" && (
        <input
          type="date"
          className="w-full border rounded px-2 py-1"
          onChange={(e) => handleChange(def, e)}
        />
      )}
      {def.VAR_PROPERTY_DATATYPE === "BOOLEAN" && (
        <input
          type="checkbox"
          className="w-5 h-5"
          onChange={(e) => handleChange(def, e)}
        />
      )}
    </td>
  </tr>
))}


      </table>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          type="reset"
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Save Properties
        </Button>
      </div>
    </form>
  );
}

export default FrmItemPrtyMst;
