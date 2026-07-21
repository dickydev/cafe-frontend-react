import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-stone-100 pt-24 text-sm font-bold text-stone-500">Checking owner access...</div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  const normalizedRole = String(user.role || "").toLowerCase();
  const allowedRoles = roles?.map((role) => String(role).toLowerCase());
  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    return <div className="flex min-h-screen items-center justify-center bg-stone-100 pt-24"><div className="rounded-3xl bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-bold text-stone-950">Access denied</h1><p className="mt-2 text-sm text-stone-500">This console is available only to restaurant owners and administrators.</p></div></div>;
  }

  return children;
}
