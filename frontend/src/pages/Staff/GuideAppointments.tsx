import React, { useState, useEffect } from "react";
import {
  fetchAssignedAppointmentsForGuide,
  Appointment,
} from "../../utils/api";

// Appointment statuses from backend
enum AppointmentStatus {
  CREATED = "created",
  PENDING_ADMIN = "pending_admin",
  APPROVED = "approved",
  AVAILABLE = "available",
  ACCEPTED = "accepted",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

const GuideAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const data = await fetchAssignedAppointmentsForGuide();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching guide appointments:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const formatTime = (timeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(`1970-01-01T${timeString}`));
  };

  // Filter appointments based on status from the database
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.ACCEPTED
  );

  const pastAppointments = appointments.filter(
    (appointment) =>
      appointment.status === AppointmentStatus.COMPLETED ||
      appointment.status === AppointmentStatus.CANCELED
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 dark:text-blue-400">
        My Appointments
      </h1>

      {isLoading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading appointments...
        </p>
      ) : appointments.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
          <p className="text-gray-600 text-lg dark:text-gray-400">
            You currently have no appointments assigned to you.
          </p>
        </div>
      ) : error ? (
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
          <p className="text-gray-700 dark:text-gray-300">
            Failed to load appointments. Please try again.
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Upcoming Appointments */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 dark:text-gray-100">
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-600 text-lg dark:text-gray-400">
                No upcoming appointments.
              </p>
            ) : (
              <ul className="space-y-6">
                {upcomingAppointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 
                    dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
                          {appointment.school_name || "Unknown School"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Date:</span>{" "}
                          {formatDate(appointment.date)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Time:</span>{" "}
                          {formatTime(appointment.time)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Visitors:</span>{" "}
                          {appointment.visitors_number}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium 
                        dark:bg-blue-900 dark:text-blue-300">
                          Upcoming
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Past Appointments */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 dark:text-gray-100">
              Past Appointments
            </h2>
            {pastAppointments.length === 0 ? (
              <p className="text-gray-600 text-lg dark:text-gray-400">
                No past appointments.
              </p>
            ) : (
              <ul className="space-y-6">
                {pastAppointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-gray-400 
                    dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
                          {appointment.school_name || "Unknown School"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Date:</span>{" "}
                          {formatDate(appointment.date)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Time:</span>{" "}
                          {formatTime(appointment.time)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Visitors:</span>{" "}
                          {appointment.visitors_number}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium 
                        dark:bg-gray-600 dark:text-gray-200">
                          Past
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default GuideAppointments;
