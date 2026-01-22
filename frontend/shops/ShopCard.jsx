import React from 'react';
import { Link } from 'react-router-dom';

const ShopCard = ({ shop }) => {
  if (!shop) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">
        <p>Boutique non disponible</p>
      </div>
    );
  }

  const {
    id,
    name = 'Nom non disponible',
    category = 'Catégorie non spécifiée',
    description = 'Aucune description disponible',
    image = 'https://via.placeholder.com/400x200/f3f4f6/9ca3af?text=Boutique+Indisponible',
    rating = '0.0',
    delivery_time = 'Non spécifié',
    delivery_fee = 'Non spécifié'
  } = shop;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text mb-2">{name}</h3>
        <p className="text font-medium mb-2">{category}</p>
        <p className="text-black-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center space-x-1">
            <span>⭐</span>
            <span>{rating}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>🕒</span>
            <span>{delivery_time}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>🚴</span>
            <span>{delivery_fee}</span>
          </span>
        </div>
        <Link 
          to={`/shop/${id}`} 
          className="bg-blue-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 w-full text-center block"
        >
          Voir la boutique
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;