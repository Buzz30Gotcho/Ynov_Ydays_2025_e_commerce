import React from 'react';
import { useDelivery } from '../context/DeliveryContext';

const DeliveryToggle = () => {
  const { deliveryMode, setDeliveryMode } = useDelivery();

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setDeliveryMode('delivery')}
        className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 flex-1 ${
          deliveryMode === 'delivery'
            ? 'bg-white shadow-sm text-gray-900 font-semibold'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <span className="text-sm">🚗</span>
        <span className="text-xs">Livraison</span>
      </button>
      
      <button
        onClick={() => setDeliveryMode('pickup')}
        className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 flex-1 ${
          deliveryMode === 'pickup'
            ? 'bg-white shadow-sm text-gray-900 font-semibold'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <span className="text-sm">🏃</span>
        <span className="text-xs">À emporter</span>
      </button>
    </div>
  );
};

export default DeliveryToggle;