// src/routes/ProtectedRouteMerchant.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthMerchant } from "../context/merchant/MerchantAuthContext"; // ton context merchant

const ProtectedRouteMerchant = ({ children }) => {
  const { merchantUser, loading } = useAuthMerchant();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-700 text-xl">
      Chargement de l'espace marchand...
    </div>
  );

  if (!merchantUser) {
    return <Navigate to="/login_merchant" replace />;
  }

  return children;
};

export default ProtectedRouteMerchant;
