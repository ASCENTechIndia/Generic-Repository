import { useState, useEffect } from "react";
import Navbar from "../HOC/Navbar/Navbar";
import Header from "../HOC/Header/Header";
import HeaderLabel from "./HeaderLabel";
import { Link } from "react-router-dom";

const Layout = ({ title, breadcrumb, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Navbar isOpen={isOpen}   onClose={() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }} />

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-opacity-30"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col bg-gray-200 min-h-screen max-h-screen overflow-hidden transition-all duration-300
          ${isOpen ? "md:ml-0" : "md:ml-0"}`}
      >
        {/* Top header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Page heading + breadcrumb */}
       

        {/* Main page content */}
        <main className="flex-1 overflow-y-auto p-8">
              <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.75)] border border-gray-700 p-6"> 
                {(title || breadcrumb) && (
        <div className="mb-4">
  {title && (
    <HeaderLabel
      text={title}
      size="text-xl font-semibold"
      align="text-left"
      className="mb-0"
    />
  )}
  {/* {breadcrumb && (
    <div>
      <Link
        className="text-blue-600 text-lg"
        to={breadcrumb.homeLink}
      >
        {breadcrumb.homeText}
      </Link>{" "}
      /{" "}
      <span className="text-lg text-gray-700">
        {breadcrumb.current}
      </span>
    </div>
  )} */}
</div>

        )}
        {children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
