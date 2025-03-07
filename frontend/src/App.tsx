import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/User/Home";
import About from "./pages/User/About";
import Contact from "./pages/User/Contact";
import MyProfile from "./pages/User/MyProfile";
import MyAppointments from "./pages/User/MyAppointments";
import Appointment from "./pages/User/Appointment";
import Feedback from "./pages/User/Feedback";
import VisitorLayout from "./layouts/VisitorLayout";
import StaffLayout from "./layouts/StaffLayout";
import MainLayout from "./layouts/MainLayout";
import StaffHomepage from "./pages/Staff/StaffHomePage";
import PendingApprovals from "./pages/Staff/PendingApprovals";
import Calendar from "./pages/Staff/Calendar";
import Notifications from "./pages/Staff/Notifications";
import Analytics from "./pages/Staff/Analytics";
import AddStaff from "./pages/Staff/AddStaff";
import StaffSettings from "./pages/Staff/StaffSettings";
import GuideAppointments from "./pages/Staff/GuideAppointments";
import FeedbackList from "./pages/Staff/FeedbackList";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import AuthPage from "./pages/Auth";
import RecoverPassword from "./pages/RecoverPassword";
import Notify from "./pages/Staff/Notify";
import Schools from "./pages/Staff/Schools";

const App = () => {
  const role = sessionStorage.getItem("role");

  const handleInvalidRoute = () => {
    if (!role) return <Navigate to="/auth" />;
    if (role === "visitor") return <Navigate to="/visitor/home" />;
    if (["admin", "guide"].includes(role)) return <Navigate to="/staff/home" />;
  };

  // Define restricted routes for roles
  const restrictedRoutes = {
    admin: ["/staff/appointments", "/staff/calendar"],
    guide: ["/staff/add-staff", "/staff/analytics, /staff/notify", "/staff/schools"],
  };

  // Define staff routes
  const staffRoutes = [
    { path: "/staff/home", element: <StaffHomepage /> },
    { path: "/staff/pending-approvals", element: <PendingApprovals /> },
    { path: "/staff/calendar", element: <Calendar /> },
    { path: "/staff/notifications", element: <Notifications /> },
    { path: "/staff/analytics", element: <Analytics /> },
    { path: "/staff/add-staff", element: <AddStaff /> },
    { path: "/staff/settings", element: <StaffSettings /> },
    { path: "/staff/appointments", element: <GuideAppointments /> },
    { path: "/staff/feedback-list", element: <FeedbackList /> },
    { path: "/staff/notify", element: <Notify />},
    { path: "/staff/schools", element: <Schools/>}
  ];

  // Filter routes based on role
  const filteredStaffRoutes = staffRoutes.filter(
    (route) => !restrictedRoutes[role]?.includes(route.path)
  );

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to={role ? `/${role}/home` : "/auth"} />} />

        {/* Visitor Routes */}
        <Route element={<MainLayout />}>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/recover_password" element={<RecoverPassword/>}/>

          {/* Protected Visitor Routes */}
          <Route element={<ProtectedRoutes allowedRoles={["visitor"]} />}>
            <Route element={<VisitorLayout />}>
              <Route path="/visitor/home" element={<Home />} />
              <Route path="/visitor/about" element={<About />} />
              <Route path="/visitor/contact" element={<Contact />} />
              <Route path="/visitor/my-profile" element={<MyProfile />} />
              <Route path="/visitor/my-appointments" element={<MyAppointments />} />
              <Route path="/visitor/appointment" element={<Appointment />} />
              <Route path="/visitor/feedback/:appointmentId" element={<Feedback />} />
            </Route>
          </Route>

          {/* Protected Staff Routes */}
          <Route element={<ProtectedRoutes allowedRoles={["admin", "guide"]} />}>
            <Route element={<StaffLayout />}>
              {filteredStaffRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>

          {/* Handle Invalid Routes */}
          <Route path="*" element={handleInvalidRoute()} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
