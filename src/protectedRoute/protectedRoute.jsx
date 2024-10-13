import React from "react";
import { useAuth } from "../useAuth/useAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) return <h1>Loading, Please wait...</h1>;

  return admin ? children : <Navigate to={"/login"} />;
}
