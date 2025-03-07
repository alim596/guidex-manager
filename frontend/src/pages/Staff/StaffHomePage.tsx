import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Appointment,
  fetchAdminsAppointments,
  fetchAssignedAppointmentsForGuide,
  fetchAvailableAppointmentsForGuides,
  Notification,
  fetchNotifications} from "../../utils/api";
import PendingApprovals from "./PendingApprovals";

const qoutes = [
  '"Success is the sum of small efforts repeated day in and day out." – Robert Collier',
  '"The paycheck is coming, don\'t give up boss!." – Abdulaleem Altarsha',
  '"You may not like your work, but you surely like to buy the new iPhone, right ;)" – Ahmad Haikal',
];

const StaffHomepage: React.FC = () => {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState<Appointment[]>([]);
  const [myApprovals, setMyApprovals] = useState<Appointment[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<Notification[]>(
    []
  );
  const [guideNotifications, setGuideNotifications] = useState<Notification[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingTours, setPendingTours] = useState<number>(0);
  const [unassignedTours, setUnassignedTours] = useState<number>(0);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch user data
        const role = sessionStorage.getItem("role");
        const name = sessionStorage.getItem("name");
        console.log("Role is ", role);
        console.log("Name is ", name);
        if (!role || !name) {
          console.log("User is not updated");
          return navigate("/auth");
        }

        setUserRole(role);
        setUserName(name);

        // Determine fetch function based on user role
        let appointments: Appointment[] = [];
        let myAppointments: Appointment[] = [];
        if (role === "admin") {
          appointments = await fetchAdminsAppointments();
        } else if (role === "guide") {
          try {
            appointments = await fetchAvailableAppointmentsForGuides();
          } catch (e) {
            console.log(e);
          }

          try {
            myAppointments = await fetchAssignedAppointmentsForGuide();
          } catch (e) {
            console.log(e);
          }
        }

        setApprovals(appointments);
        setMyApprovals(myAppointments);

        // Fetch notifications
        const fetchedNotifications = await fetchNotifications();
        const unreadNotifications = fetchedNotifications.filter(
          (notification) => !notification.is_read
        );

        if (role === "admin") {
          try {
            setAdminNotifications(unreadNotifications);
          } catch (e) {
            console.log(e);
          }
        } else if (role === "guide") {
          try {
            setGuideNotifications(unreadNotifications);
          } catch (e) {
            console.log(e);
          }
        }

        // Filter counts for statuses
        const pendingCount = appointments.filter(
          (app) => app.status === "created"
        ).length;
        const unassignedCount = appointments.filter(
          (app) => app.status === "approved"
        ).length;

        setPendingTours(pendingCount);
        setUnassignedTours(unassignedCount);

        console.log("Pending:", pendingCount, "Unassigned:", unassignedCount); // Add this log
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData(); // Fetch data initially
  }, []); // Empty dependency array ensures it runs once on mount

  const handleApprovalStatusChange = (
    pendingCount: number,
    unassignedCount: number
  ) => {
    setPendingTours(pendingCount);
    setUnassignedTours(unassignedCount);
  };

  const goToApproval = () => navigate("/staff/pending-approvals");
  const goToCalendar = () => navigate("/staff/calendar");
  const goToNotifications = () => navigate("/staff/notifications");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 dark:bg-gray-900 dark:text-gray-200">
      {/* Hero Section */}
      <div className="mb-8 p-6 bg-blue-600 text-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
        <p className="mt-2">
          {qoutes[Math.floor(Math.random() * qoutes.length)]}
        </p>
        <button
          className="mt-4 bg-white text-blue-600 py-2 px-6 rounded font-semibold hover:bg-gray-200 
          dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          onClick={goToApproval}
        >
          View Pending Approvals
        </button>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task Summary */}
        <div className="bg-white p-6 border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 dark:text-gray-300">
            Task Summary
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-400">
            <li>{pendingTours} pending approvals</li>
            <li>{unassignedTours} unassigned tours</li>
          </ul>
          <div className="mt-4 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
            {userRole === "admin" ? (
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${
                    (pendingTours / (pendingTours + unassignedTours || 1)) * 100
                  }%`,
                }}
              ></div>
            ) : (
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${
                    (unassignedTours / (pendingTours + unassignedTours || 1)) *
                    100
                  }%`,
                }}
              ></div>
            )}
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white p-6 border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          {/* My Schedule */}
          {myApprovals.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4 dark:text-gray-300">
                My Schedule
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-400">
                {myApprovals.map((appointment) => (
                  <li key={appointment.id}>
                    {appointment.id} - {appointment.time} - {appointment.date}
                  </li>
                ))}
              </ul>
              <hr className="my-4 border-gray-300 dark:border-gray-600" />
            </>
          )}

          {/* Upcoming Schedule */}
          <h2 className="text-xl font-bold mb-4 dark:text-gray-300">
            Upcoming Schedule
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-400">
            {approvals.length > 0 ? (
              approvals
                .filter((appointment) => {
                  // Admins see "created" status; guides see "approved" status
                  if (userRole === "admin") {
                    return appointment.status === "created";
                  }
                  return appointment.status === "approved";
                })
                .map((appointment) => (
                  <li key={appointment.id}>
                    {appointment.id} - {appointment.time} - {appointment.date}
                  </li>
                ))
            ) : (
              <li>No upcoming appointments</li>
            )}
          </ul>
          <button
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 
            dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            onClick={goToCalendar}
          >
            View Calendar
          </button>
        </div>

        {/* Notifications Section */}
        <div className="bg-white p-6 border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 dark:text-gray-300">
            Notifications
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-400">
            {userRole === "admin" && adminNotifications.length > 0 ? (
              adminNotifications.map((notification) => (
                <li key={notification.id}>
                  <strong>{notification.type}:</strong> {notification.message}
                </li>
              ))
            ) : userRole === "guide" && guideNotifications.length > 0 ? (
              guideNotifications.map((notification) => (
                <li key={notification.id}>
                  <strong>{notification.type}:</strong> {notification.message}
                </li>
              ))
            ) : (
              <li>No notifications available.</li>
            )}
          </ul>
          <button
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 
    dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            onClick={goToNotifications}
          >
            View All Notifications
          </button>
        </div>
      </div>

      {/* Analytics Snapshot */}
      <div className="mt-12 bg-gray-100 p-6 rounded-lg shadow dark:bg-gray-800 dark:text-gray-200">
        <h2 className="text-xl font-bold mb-4">Analytics Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600">25</h3>
            <p className="text-gray-700 dark:text-gray-400">Tours This Month</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600">4.8</h3>
            <p className="text-gray-700 dark:text-gray-400">
              Average Feedback Rating
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-600">15%</h3>
            <p className="text-gray-700 dark:text-gray-400">
              Increase in Visitor Engagement
            </p>
          </div>
        </div>
      </div>

      <PendingApprovals onApprovalStatusChange={handleApprovalStatusChange} />
    </div>
  );
};

export default StaffHomepage;
