import React, { useState} from "react";
import { updateUser } from "../../utils/api";
import { useTheme } from "../../components/ThemeContext";

const MyProfile: React.FC = () => {
  const [userData, setUserData] = useState({
    name: sessionStorage.getItem("name") || "",
    image: "/assets/profile_pic.webp",
    user_email: sessionStorage.getItem("user_email") || "",
    password: sessionStorage.getItem("password") || "",
  });

  const [isEdit, setIsEdit] = useState(false);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Theme logic
  const { isDarkMode, toggleDarkMode } = useTheme();


  // Update Account Information
    const handleUpdateAccount = async () => {
    const { name, user_email, password } = userData;
  
     // Validation
     if (!name || !user_email) {
      alert("Name and Email cannot be empty.");
      return;
    }
  
    try {
      // Debugging the payload before sending
      const payload = {
        name,
        user_email,
        ...(password && { password }), // Include password only if it's not empty
      };
      console.log("Payload being sent to updateUser:", payload);
  
      // Call the updateUser API function
      const response = await updateUser(payload);
  
      // Debugging the API response
      console.log("Response from updateUser API:", response);
  
      // Success feedback
      alert("Account information updated successfully!");
      setUserData({ ...userData, password: "" }); // Clear the password field
  
      // Update sessionStorage with new user info
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("user_email", user_email);
      sessionStorage.setItem("password", password);
      console.log("Session storage updated with new user info.");
    } catch (error: any) {
      // Debugging the error
      console.error("Error during account update:", error.message);
      console.error("Error details:", error);
      // User feedback
      alert(error.message || "Failed to update account. Please try again.");
    }
  };
  

  return (
    <div
      className={`max-w-lg mx-auto p-6 shadow-lg rounded-lg space-y-6 mt-16 mb-8 border ${
        isDarkMode
          ? "bg-dark-background text-dark-text border-dark-border"
          : "bg-white text-gray-800 border-gray-200"
      }`}
    >
      {/* Profile Picture */}
      <div className="flex flex-col items-center">
        <img
          className="w-20 h-20 rounded-full shadow-md object-cover mb-4 border-4 border-primary"
          src={userData.image}
          alt="Profile"
        />
        {isEdit ? (
          <input
            className={`mt-4 text-center text-xl font-semibold p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-xs ${
              isDarkMode ? "bg-dark-card text-dark-text" : "bg-gray-100"
            }`}
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
          />
        ) : (
          <h1 className="mt-4 text-xl font-semibold">{userData.name}</h1>
        )}
      </div>

      {/* User Information */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold border-b pb-2">
            User Information
          </h2>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">Email:</p>
              {isEdit ? (
                <input
                  className={`text-lg p-3 rounded-lg w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary ${
                    isDarkMode ? "bg-dark-card text-dark-text" : "bg-gray-100"
                  }`}
                  type="email"
                  name="user_email"
                  value={userData.user_email}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-lg font-semibold">{userData.user_email}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="font-medium">Password:</p>
              {isEdit ? (
                <input
                  className={`text-lg p-3 rounded-lg w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary ${
                    isDarkMode ? "bg-dark-card text-dark-text" : "bg-gray-100"
                  }`}
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-lg font-semibold">{userData.password}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Save and Theme Buttons */}
      <div className="flex justify-between mt-6 space-x-4">
        <div className="flex space-x-4">
          {isEdit ? (
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-all duration-300"
              onClick={handleUpdateAccount}
            >
              Save Changes
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all duration-300"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>

        {/* Theme Button */}
        <div>
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`py-2 px-4 rounded text-sm font-semibold ${
              isDarkMode
                ? "bg-dark-hover text-dark-text hover:bg-dark-card"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
