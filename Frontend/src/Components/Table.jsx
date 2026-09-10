import React, { useState, useMemo, useEffect } from "react";

const Table = ({
  headers = [],
  data = [],
  headerlabel,
  columnStyles = [],
  showUpload = false,
  onFileUpload = () => { },
  rowsPerPage = 10, // default rows per page
  showSearch = true
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 Filtered data based on search
  const filteredData = useMemo(() => {
    if (!showSearch || !searchTerm.trim()) return data;
    return data.filter((row) =>
      row.some(
        (cell) =>
          cell &&
          cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // 🔹 Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

useEffect(() => {
  const newTotalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));

  if (currentPage > newTotalPages) {
    setCurrentPage(1);
  }
}, [data, rowsPerPage, currentPage]);

  return (
    <div className="mt-6">
      <div className=" rounded-lg bg-white">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center bg-white 
                 rounded-t-lg px-4 py-3">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-800 tracking-wide">
            {headerlabel}
          </h2>

          {/* Actions (Search + Upload) */}
          <div className="flex items-center gap-3">
            {/* Search Box */}
            {showSearch && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 pl-9 pr-3 py-1.5 rounded-md text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
                 shadow-sm"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  🔍
                </span>
              </div>
            )}

            {/* Upload Button (if enabled) */}
            {showUpload && (
              <label className="cursor-pointer text-sm bg-blue-500 hover:bg-blue-600 text-white 
                        px-3 py-1.5 rounded-md shadow-sm transition">
                Upload
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => onFileUpload(e.target.files[0])}
                />
              </label>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto w-full">
          <div className="sm:max-h-64 md:max-h-80 lg:max-h-96 overflow-y-auto">
            <table className="w-full min-w-max border-collapse table-fixed">
              <thead className=" top-0 bg-[oklch(0.85_0.08_265.58)] z-10 border border-gray-400">
                <tr className="text-gray-700 border border-gray-400">
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className={`px-3 py-2 text-center font-bold text-lg break-words ${columnStyles[idx] || ""
                        }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      {headers.map((_, colIdx) => (
                        <td
                          key={colIdx}
                          className={`px-4 py-3 text-sm text-center break-words border border-gray-200 ${columnStyles[colIdx] || ""
                            }`}
                          style={{ wordBreak: "break-word" }}
                        >
                          {row[colIdx]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={headers.length}
                      className="text-center py-4 text-gray-500"
                    >
                      No matching data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-3 border-t border-gray-200">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              Prev
            </button>

            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
