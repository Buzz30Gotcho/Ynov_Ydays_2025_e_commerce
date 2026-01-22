import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import CartContext from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

import SimilarProducts from '../components/SimilarProducts';

const ProductDetail = () => {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { addItem } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 pt-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Produit non trouvé</h2>
          <p className="text-blue-600 max-w-md">{error}</p>
          <Link to="/shops" className="mt-4 inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
            Retour aux boutiques
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Produit introuvable</h2>
          <Link to="/shops" className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
            Explorer les boutiques
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="product-detail-page bg-blue-50 min-h-screen pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image du produit */}
          <div className="relative">
            <img
              src={product.image || '/placeholder.png'}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg"
            />
            {product.shops && (
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <Link to={`/shop/${product.shops.id}`} className="flex items-center space-x-2 text-sm">
                  <img src={product.shops.image || '/placeholder.png'} alt={product.shops.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-medium text-blue-900">{product.shops.name}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Détails du produit */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-2">{product.name}</h1>
              <p className="text-blue-700 text-lg">{product.category || 'Produit'}</p>
            </div>

            <div className="text-3xl font-bold text-blue-600">
              {product.price}€
            </div>

            <div className="prose prose-blue max-w-none">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Description</h3>
              <p className="text-blue-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Informations supplémentaires */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.stock && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="font-semibold text-blue-900">Stock</div>
                  <div className="text-blue-600">{product.stock} disponibles</div>
                </div>
              )}
              {product.shops?.delivery_time && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="font-semibold text-blue-900">Livraison</div>
                  <div className="text-blue-600">{product.shops.delivery_time}</div>
                </div>
              )}
            </div>

            {/* Sélecteur de quantité et bouton ajouter */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-blue-900">Quantité</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold flex items-center justify-center"
                    disabled={isAdded}
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold text-blue-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold flex items-center justify-center"
                    disabled={isAdded || (product.stock && quantity >= product.stock)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdded || (product.stock && product.stock === 0)}
                className={`w-full text-white py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  isAdded
                    ? 'bg-green-500 cursor-not-allowed'
                    : (product.stock && product.stock === 0) 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                {isAdded ? (
                  <>
                    <span>✅</span>
                    <span>Ajouté !</span>
                  </>
                ) : (product.stock && product.stock === 0) ? (
                  <span>Rupture de stock</span>
                ) : (
                  <>
                    <span>🛒</span>
                    <span>Ajouter au panier • {(product.price * quantity).toFixed(2)}€</span>
                  </>
                )}
              </button>
            </div>

            {/* Bouton retour à la boutique */}
            {product.shops && (
              <Link
                to={`/shop/${product.shops.id}`}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>←</span>
                <span>Retour à {product.shops.name}</span>
              </Link>
            )}
          </div>
        </div>

        {product.shops && (
          <SimilarProducts shopId={product.shops.id} currentProductId={product.id} />
        )}
      </div>
    </div>
  );
};


export default ProductDetail;