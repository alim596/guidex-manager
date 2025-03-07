import React from "react";
import { Outlet, Navigate } from "react-router-dom";


const ProtectedRoutes: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const role = sessionStorage.getItem("role") ;
  console.log('Role is ', role)
  if (!role) {
    console.log('User is not updated')
    return <Navigate to="/auth" />;
  }

  if (!allowedRoles.includes(role)) {

    if (["admin", "guide"].includes(role)) {
      return <Navigate to="/staff/home" replace />;
    }
    return <Navigate to="/visitor/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
