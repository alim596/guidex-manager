import React, { useState, useEffect } from "react";
import { fetchAppointmentsForUser, updateAppointmentStatus, Appointment } from "../../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try { 
        setIsLoading(true);
        setError(false); // Reset error state before loading
        const data = await fetchAppointmentsForUser();
        if (data.length === 0) {
          setError(true); // Show no-appointments message
        } else {
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        //toast.error("Failed to load appointments. Please try again.");
        setError(true); // Show error message
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Placeholder function for canceling an appointment
  const handleCancel = async (id: number) => {
    try {
      await updateAppointmentStatus(id, { status: "canceled" }); // Update status to "CANCELED"
      toast.success("Appointment canceled successfully.");
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? { ...appointment, status: "CANCELED" } : appointment
        )
      );
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Failed to cancel the appointment. Please try again.");
    }
  };
  
  return (
    <div className="h-full p-6 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="pb-3 mt-4 text-lg font-semibold text-zinc-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700">
          My Appointments
        </p>
  
        {isLoading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            Loading appointments...
          </p>
        ) : error ? (
          <div className="text-center text-gray-600 dark:text-gray-400 mt-6">
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
              You don’t have any appointments yet!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Once you schedule an appointment, it will appear here.
            </p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="grid grid-cols-2 gap-4 py-4 border-b border-gray-300 dark:border-gray-700 last:border-none"
            >
              {/* Appointment Details */}
              <div className="text-sm text-zinc-600 dark:text-gray-300">
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 dark:text-gray-400 font-medium">
                    <strong>Date:</strong>
                  </span>
                  {" " + appointment.date}
                  <br />
                  <span className="text-sm text-neutral-700 dark:text-gray-400 font-medium">
                    <strong>Time:</strong>
                    {" " + appointment.time}
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Visitors:</strong> {appointment.visitors_number}
                </p>
              </div>
  
              {/* Appointment Status and Actions */}
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Status:</p>
                  {(appointment.status === "approved" || appointment.status === "accepted") ? (
                    <p className="text-sm font-medium text-green-600 bg-green-100 dark:text-green-500 dark:bg-green-900 px-3 py-1 rounded-full">
                      Approved
                    </p>
                  ) : (appointment.status === "created" || appointment.status === "pending_admin") ? (
                    <p className="text-sm font-medium text-yellow-600 bg-yellow-100 dark:text-yellow-500 dark:bg-yellow-900 px-3 py-1 rounded-full">
                      Pending
                    </p>
                  ) : appointment.status === "completed" ? (
                    <p className="text-sm font-medium text-blue-600 bg-blue-100 dark:text-blue-500 dark:bg-blue-900 px-3 py-1 rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-red-600 bg-red-100 dark:text-red-500 dark:bg-red-900 px-3 py-1 rounded-full">
                      Canceled
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleCancel(appointment.id)}
                  className="text-sm text-red-600 dark:text-red-400 px-4 py-2 border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-600 hover:dark:bg-red-400 hover:text-white transition-all duration-300"
                  aria-label={`Cancel appointment with ID ${appointment.id}`}
                >
                  Cancel Appointment
                </button>

                {appointment.status === "approved" || appointment.status === "accepted"
                  // ? new Date(appointment.date) < new Date() Compare appointment date with current date/time
                    ? <button
                        onClick={() => navigate(`/visitor/feedback/${appointment.id}`)}
                        className="text-sm text-blue-600 dark:text-blue-400 px-4 py-2 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600 hover:dark:bg-blue-400 hover:text-white transition-all duration-300"
                        aria-label={`Leave a feedback for an appointment with ID ${appointment.id}`}
                      >
                        Leave Feedback
                      </button>
                    : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );  
};

export default MyAppointments;
