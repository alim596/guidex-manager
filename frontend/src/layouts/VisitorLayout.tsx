import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/TopScroll";
import { Outlet } from "react-router-dom";

const VisitorLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* Navbar */}
      <div className="px-5 bg-white dark:bg-gray-800 shadow">
        <NavBar />
      </div>

      {/* Main Content */}
      <div className="flex-grow pt-6 bg-gray-100 dark:bg-gray-900">
        <Outlet />
      </div>

      {/* Scroll to Top Button */}
      <div className="fixed bottom-5 right-5">
        <ScrollToTop />
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800">
        <Footer />
      </div>
    </div>
  );
};

export default VisitorLayout;
