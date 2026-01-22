import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import LoadingSpinner from './LoadingSpinner';

const SimilarProducts = ({ shopId, currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!shopId) return;
      try {
        setLoading(true);
        const data = await productService.getProductsByShop(shopId);
        // Filter out the current product and limit to 3
        const similar = data.filter(p => p.id !== currentProductId).slice(0, 3);
        setProducts(similar);
      } catch (err) {
        console.error("Failed to fetch similar products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopId, currentProductId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return null; // Don't render anything if there are no similar products
  }

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-blue-900 mb-6">Autres produits de la boutique</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
          >
            <div className="overflow-hidden">
                <img 
                    src={product.image || '/placeholder.png'} 
                    alt={product.name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-blue-900 mb-1 truncate group-hover:text-blue-600">{product.name}</h4>
              <p className="text-blue-600 font-bold">{product.price}€</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
