import React from 'react';
import ShopCard from './ShopCard';

const ShopList = ({ shops = [] }) => {
  // Vérification robuste du tableau de boutiques
  if (!shops || !Array.isArray(shops) || shops.length === 0) {
    return (
      <div className="no-shops text-center py-12">
        <div className="text-6xl mb-4">🏪</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aucune boutique trouvée
        </h3>
        <p className="text-gray-500">
          Essayez de modifier vos filtres ou de revenir plus tard.
        </p>
      </div>
    );
  }

  return (
    <div className="shop-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map(shop => (
        <ShopCard 
          key={shop?.id || `shop-${Math.random()}`} 
          shop={shop} 
        />
      ))}
    </div>
  );
};

export default ShopList;