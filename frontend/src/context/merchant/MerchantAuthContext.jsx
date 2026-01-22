import React, { createContext, useContext, useState, useEffect } from "react";

const MerchantAuthContext = createContext();

export const useAuthMerchant = () => useContext(MerchantAuthContext);

export const MerchantAuthProvider = ({ children }) => {
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedMerchant = localStorage.getItem("merchant");
    if (savedMerchant) setMerchant(JSON.parse(savedMerchant));
    setLoading(false);
  }, []);

  const loginMerchant = (merchantData) => {
    setMerchant(merchantData);
    localStorage.setItem("merchant", JSON.stringify(merchantData));
  };

  const logoutMerchant = () => {
    setMerchant(null);
    localStorage.removeItem("merchant");
  };

  return (
    <MerchantAuthContext.Provider
      value={{ merchant, loading, loginMerchant, logoutMerchant }}
    >
      {children}
    </MerchantAuthContext.Provider>
  );
};
