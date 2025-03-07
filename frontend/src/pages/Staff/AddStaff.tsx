import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser, fetchAllSchools } from "../../utils/api"; // Use fetchAllSchools from API utils

const AddStaff: React.FC = () => {
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    school_id: 0,
  });

  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false); // New state to handle processing
  const [schoolOptions, setSchoolOptions] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = sessionStorage.getItem("role");
        if (!role) {
          console.log("User is not updated");
          return <Navigate to="/auth" />;
        }
        setCurrentUserRole(role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setCurrentUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();

    const loadSchools = async () => {
      try {
        const schools = await fetchAllSchools(); // Fetch schools from backend
        const options = schools.map((school) => ({
          value: school.id,
          label: `${school.name} (${school.city})`,
        }));
        setSchoolOptions(options);
      } catch (error) {
        console.error("Error fetching schools:", error);
        toast.error("Failed to load schools. Please try again later.");
      }
    };

    loadSchools();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchoolChange = (selectedOption: any) => {
    setNewAccount((prev) => ({ ...prev, school_id: selectedOption?.value || 0 }));
  };

  const handleCreateAccount = async () => {
    if (!newAccount.name || !newAccount.email || !newAccount.password || !newAccount.role) {
      toast.error("All fields are required. Please fill out the form completely.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (newAccount.role === "visitor" && newAccount.school_id === 0) {
      toast.error("Please select a school for Visitor accounts.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setProcessing(true); // Disable the button during the process
    try {
      await registerUser(
        newAccount.email,
        newAccount.role,
        newAccount.name,
        newAccount.password,
        newAccount.role === "visitor" ? newAccount.school_id : undefined // Pass school_id
      );
      toast.success(`Account for "${newAccount.name}" created successfully as a "${newAccount.role}".`, {
        position: "top-right",
        autoClose: 5000,
      });
      setNewAccount({ name: "", email: "", password: "", role: "", school_id: 0 });
    } catch (error) {
      console.error("Error creating user account:", error);
      toast.error("Failed to create the account. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setProcessing(false); // Enable the button after process completion
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-4 text-gray-500">Loading...</h1>
      </div>
    );
  }

  if (currentUserRole !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-4 text-gray-500">Access Restricted</h1>
        <p className="text-gray-600">You do not have the necessary permissions to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 dark:bg-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-2 text-blue-700 dark:text-blue-400">Add Staff Accounts</h1>
      <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">New Staff Account</h2>
        {newAccount.role === "visitor" && (
          <div className="mb-6">
            <label htmlFor="school_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              School
            </label>
            <Select
              options={schoolOptions}
              onChange={handleSchoolChange}
              placeholder="Select a school"
              isSearchable
              className="text-gray-800 dark:text-gray-200"
            />
          </div>
        )}
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter full name"
              value={newAccount.name}
              onChange={handleChange}
              className="mt-1 p-3 border rounded w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
            />
          </div>
  
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              value={newAccount.email}
              onChange={handleChange}
              className="mt-1 p-3 border rounded w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
            />
          </div>
  
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={newAccount.password}
              onChange={handleChange}
              className="mt-1 p-3 border rounded w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
            />
          </div>
  
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={newAccount.role}
              onChange={handleChange}
              className="mt-1 p-3 border rounded w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="guide">Guide</option>
              <option value="visitor">Visitor</option>
            </select>
          </div>
  
          <div>
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 ${
                processing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={processing}
            >
              {processing ? "Processing..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
