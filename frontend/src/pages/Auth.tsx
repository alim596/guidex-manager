import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser, registerUser, fetchAllSchools } from "../utils/api"; // Import fetchAllSchools API function

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [schoolOptions, setSchoolOptions] = useState<{ value: number; label: string }[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    school_id: 0, 
  });
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchoolChange = (selectedOption: any) => {
    setFormData((prev) => ({ ...prev, school_id: selectedOption?.value || 0 }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isLogin) {
      try {
        const role = await loginUser(formData.email, formData.password);
        if (role === "guide" || role === "admin") {
          navigate("/staff/home");
        } else if (role === "visitor") {
          navigate("/visitor/home");
        } else {
          toast.error("Login failed. Invalid role returned.");
        }
      } catch (error: any) {
        console.error("Error during login:", error.response?.data || error.message);
        toast.error("Error during login: " + (error.response?.data || error.message));
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || formData.school_id === 0) {
        toast.error("All fields are required. Please fill out the form completely.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      try {
        await registerUser(
          formData.email,
          "visitor",
          formData.name,
          formData.password,
          formData.school_id 
        );
        toast.success("Welcome! Your account has been created.", {
          position: "top-right",
          autoClose: 5000,
        });
        setFormData({ name: "", email: "", password: "", school_id: 0 });
        setIsLogin(true);
      } catch (error) {
        console.error("Error during registration:", error);
        toast.error("Failed to create your account. Please try again later.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white text-black rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Visitor Signup"}
        </h1>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label className="block mb-2 text-sm font-medium">Select Your School</label>
              <Select
                options={schoolOptions}
                onChange={handleSchoolChange}
                placeholder="Select a school"
                isSearchable
                className="mb-4 text-black"
              />

              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 mb-4 bg-gray-200 text-black rounded-md"
              />
            </>
          )}

          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-4 bg-gray-200 text-black rounded-md"
          />

          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-6 bg-gray-200 text-black rounded-md"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md mb-4"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <p className="text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>
        {/* Toggle between Login and Signup */}
        <p className="text-center">
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate('/auth/recover_password')}
            >
              {isLogin ? "Frogot your password?" : ''}{' '}
            </span>
          </p>
      </div>
    </div>
  );
};

export default AuthPage;
