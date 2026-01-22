import { useState, useEffect } from 'react';
import { shopService } from '../services/shopService';

export const useShop = (id) => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const data = await shopService.getShopById(id);
        setShop(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShop();
    }
  }, [id]);

  return { shop, loading, error };
};

// PAS de export default ici non plus