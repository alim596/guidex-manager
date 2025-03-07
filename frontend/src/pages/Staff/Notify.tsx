import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { custom_notification } from "../../utils/api";

const AddGuideNotification: React.FC = () => {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState({
    notification_type: "",
    message: "",
  });

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = sessionStorage.getItem("role");
        if (!role) {
          window.location.href = "/auth";
          return;
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
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNotification((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendNotification = async () => {
    if (!notification.notification_type || !notification.message) {
      toast.error("Both title and message are required.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      
      await custom_notification(notification.message, notification.notification_type);
      toast.success("Notification sent to all guides.", {
        position: "top-right",
        autoClose: 5000,
      });

      setNotification({ notification_type: "", message: "" });
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false); // Re-enable button after process ends
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-500">Loading...</h1>
      </div>
    );
  }

  if (currentUserRole !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-500 mb-4">Access Restricted</h1>
          <p className="text-gray-600">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
          Send Notification to Guides
        </h1>
        <div className="space-y-6">
          <div>
            <label htmlFor="notification_type" className="block text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
              Notification Title
            </label>
            <input
              type="text"
              id="notification_type"
              name="notification_type"
              value={notification.notification_type}
              onChange={handleChange}
              placeholder="Enter notification title"
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
              Notification Message
            </label>
            <textarea
              id="message"
              name="message"
              value={notification.message}
              onChange={handleChange}
              placeholder="Enter your message"
              rows={6}
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            />
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleSendNotification}
              disabled={isSubmitting} // Disable button when submitting
              className={`bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGuideNotification;
