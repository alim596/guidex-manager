import { useState } from "react";
import {
  AiOutlineSetting,
  AiOutlineForm,
  AiOutlineLogout,
  AiOutlineDashboard,
  AiOutlineFileDone,
  AiOutlineCalendar,
  AiOutlineBell,
  AiOutlineBarChart,
  AiOutlineUserAdd,
  AiOutlineComment, AiTwotonePlusCircle,
  AiOutlineGlobal 
} from "react-icons/ai";
import { FiChevronLeft } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const role = sessionStorage.getItem("role"); // Get user role

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/auth");
  };
  const isActive = (path) => location.pathname === path;

  // Define restricted pages for roles
  const restrictedPages = {
    admin: ["appointments", "calendar"],
    guide: ["add-staff", "analytics", "notify", "schools"],
  };

  const navigationItems = [
    { path: "/staff/home", icon: <AiOutlineDashboard />, label: "Dashboard" },
    {
      path: "/staff/pending-approvals",
      icon: <AiOutlineFileDone />,
      label: "Pending Approvals",
    },
    {
      path: "/staff/appointments",
      icon: <AiOutlineForm />,
      label: "Appointments",
    },
    { path: "/staff/calendar", icon: <AiOutlineCalendar />, label: "Calendar" },
    {
      path: "/staff/notifications",
      icon: <AiOutlineBell />,
      label: "Notifications",
    },
    { path: "/staff/notify", icon: <AiTwotonePlusCircle />, label: "Notify Guides"},
    {
      path: "/staff/analytics",
      icon: <AiOutlineBarChart />,
      label: "Statistics",
    },
    { path: "/staff/add-staff", icon: <AiOutlineUserAdd />, label: "Add User" },
    {
      path: "/staff/feedback-list",
      icon: <AiOutlineComment />,
      label: "Feedback List",
    },
    {
      path: "/staff/schools",
      icon: <AiOutlineGlobal />,
      label: "Schools",
    },
    { path: "/staff/settings", icon: <AiOutlineSetting />, label: "Settings" },
  ];

  const filteredNavigationItems = navigationItems.filter((item) => {
    const pageKey = item.path.split("/").pop(); // Extract the last part of the path
    return !restrictedPages[role]?.includes(pageKey); // Exclude restricted pages for the role
  });

  return (
    <>
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700 ${
          isOpen ? "w-60" : "w-16"
        } flex flex-col h-screen fixed z-50`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-600 dark:bg-blue-700">
          {isOpen && (
            <h2 className="text-lg font-semibold text-white">
              Welcome Friend!
            </h2>
          )}
          <button
            onClick={toggleSidebar}
            aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            className="text-white focus:outline-none"
          >
            <FiChevronLeft
              size={24}
              className={`transform transition-transform duration-300 ${
                isOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 flex-1 overflow-hidden">
          <ul className="flex flex-col space-y-1">
            {filteredNavigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-base font-medium ${
                    isActive(item.path)
                      ? "bg-blue-200 text-blue-700 dark:bg-blue-600 dark:text-white"
                      : "text-gray-700 hover:bg-blue-100 dark:text-gray-400 hover:bg-blue-600"
                  } transition-colors ${!isOpen ? "justify-center" : ""}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))}
            <li>
              <div
                onClick={handleLogout}
                className={`flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-red-400 transition-colors ${
                  !isOpen ? "justify-center" : ""
                } cursor-pointer dark:text-gray-400 dark:hover:bg-red-500`}
              >
                <AiOutlineLogout size={24} />
                {isOpen && <span className="ml-3">Logout</span>}
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
