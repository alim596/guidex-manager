import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import StaffFooter from '../components/StaffFooter';

const StaffLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-full bg-white shadow-lg dark:bg-gray-800">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="pl-20 flex-1 pt-6 bg-gray-100 dark:bg-gray-800">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="pl-20 dark:bg-gray-900">
        <StaffFooter />
      </div>
    </div>
  );
};

export default StaffLayout;
