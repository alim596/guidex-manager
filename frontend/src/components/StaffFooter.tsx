import React from "react";

const StaffFooter: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-3">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Left Section: About */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Bilkent University. All Rights Reserved.
        </p>

        {/* Right Section: Quick Contact */}
        <div className="flex space-x-4">
          <a
            href="mailto:support@bilkent.edu.tr"
            className="text-sm text-gray-400 hover:text-white"
          >
            support@bilkent.edu.tr
          </a>
          <span className="text-sm text-gray-400">|</span>
          <a
            href="tel:+903122904000"
            className="text-sm text-gray-400 hover:text-white"
          >
            +90 312 290 4000
          </a>
        </div>
      </div>
    </footer>
  );
};

export default StaffFooter;
