import { Navigate, useLocation } from "react-router-dom";
import { authStore } from "@/store/auth";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  adminOnly?: boolean;
};

const allowedWhenPending = ["/profile", "/settings"];

export const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const user = authStore.getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/volunteer-dashboard" replace />;
  }

  if (user.status !== "Approved" && !allowedWhenPending.includes(location.pathname)) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
