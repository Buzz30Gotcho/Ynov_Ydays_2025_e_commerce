import { useState, useEffect } from 'react';
import { shopService } from '../services/shopService';

export const useShops = (category = null, deliveryMode = 'delivery') => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        let data;
        
        if (category && category !== 'Toutes') {
          data = await shopService.getShopsByCategory(category);
        } else {
          data = await shopService.getAllShops();
        }

        // Filtrage selon le mode de livraison
        if (deliveryMode === 'delivery') {
          data = data.filter(shop => shop.deliveryAvailable === true);
        } else if (deliveryMode === 'pickup') {
          data = data.filter(shop => shop.pickupAvailable === true);
        }

        setShops(data);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des boutiques');
        console.error('Error fetching shops:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [category, deliveryMode]); // ✅ Ajout de deliveryMode comme dépendance

  return { shops, loading, error };
};