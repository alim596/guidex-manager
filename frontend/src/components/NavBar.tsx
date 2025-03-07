import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa"; // Example icon

const NavBar = () => {
  const [token, setToken] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 dark:border-b-gray-600">
      <img
        onClick={() => navigate("/visitor")}
        className="h-12 cursor-pointer"
        src="/assets/bilkent_logo.jpg"
        alt="Bilkent Logo"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <li className="py-1">
          <NavLink
            to="/visitor/home"
            className={({ isActive }) =>
              isActive
                ? "text-primary dark:text-yellow-400"
                : "text-gray-700 dark:text-gray-300"
            }
          >
            {({ isActive }) => (
              <>
                HOME
                <hr
                  className={`h-0.5 bg-primary dark:bg-yellow-400 w-3/5 m-auto ${
                    isActive ? "block" : "hidden"
                  }`}
                />
              </>
            )}
          </NavLink>
        </li>
        <li className="py-1">
          <NavLink
            to="/visitor/about"
            className={({ isActive }) =>
              isActive
                ? "text-primary dark:text-yellow-400"
                : "text-gray-700 dark:text-gray-300"
            }
          >
            {({ isActive }) => (
              <>
                ABOUT
                <hr
                  className={`h-0.5 bg-primary dark:bg-yellow-400 w-3/5 m-auto ${
                    isActive ? "block" : "hidden"
                  }`}
                />
              </>
            )}
          </NavLink>
        </li>
        <li className="py-1">
          <NavLink
            to="/visitor/contact"
            className={({ isActive }) =>
              isActive
                ? "text-primary dark:text-yellow-400"
                : "text-gray-700 dark:text-gray-300"
            }
          >
            {({ isActive }) => (
              <>
                CONTACT
                <hr
                  className={`h-0.5 bg-primary dark:bg-yellow-400 w-3/5 m-auto ${
                    isActive ? "block" : "hidden"
                  }`}
                />
              </>
            )}
          </NavLink>
        </li>
      </ul>
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-12 h-12 rounded-full" src="/assets/profile_pic.webp" alt="" />
            <FaChevronDown className="ml-2" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 dark:text-gray-300 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 dark:bg-gray-800 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/visitor/my-profile")}
                  className="hover:text-black dark:hover:text-white cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/visitor/my-appointments")}
                  className="hover:text-black dark:hover:text-white cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={() => {
                    setToken(false);
                    navigate("/auth");
                    sessionStorage.clear();
                  }}
                  className="hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-light hidden md:block dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
  
};

export default NavBar;
