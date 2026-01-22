import React, { createContext, useContext, useState } from 'react';

const DeliveryContext = createContext();

export const DeliveryProvider = ({ children }) => {
  const [deliveryMode, setDeliveryMode] = useState('delivery'); // 'delivery' ou 'pickup'
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);

  const value = {
    deliveryMode,
    setDeliveryMode,
    deliveryAddress,
    setDeliveryAddress,
    selectedShop,
    setSelectedShop
  };

  return (
    <DeliveryContext.Provider value={value}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};