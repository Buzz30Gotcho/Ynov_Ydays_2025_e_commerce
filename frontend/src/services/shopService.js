// services/shopService.js
import { supabase } from '../lib/supabaseClient';

export const shopService = {
  async getAllShops() {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          products (*)
        `)
        .eq('city', 'Montpellier')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ajout des champs de disponibilité si non présents
      return data.map(shop => ({
        ...shop,
        deliveryAvailable: shop.delivery_available !== undefined ? shop.delivery_available : true,
        pickupAvailable: shop.pickup_available !== undefined ? shop.pickup_available : true,
        isOpen: shop.is_open !== undefined ? shop.is_open : true
      }));
    } catch (error) {
      console.error('Error fetching shops:', error);
      throw error;
    }
  },

  async getShopsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('category', category)
        .eq('city', 'Montpellier')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(shop => ({
        ...shop,
        deliveryAvailable: shop.delivery_available !== undefined ? shop.delivery_available : true,
        pickupAvailable: shop.pickup_available !== undefined ? shop.pickup_available : true,
        isOpen: shop.is_open !== undefined ? shop.is_open : true
      }));
    } catch (error) {
      console.error('Error fetching shops by category:', error);
      throw error;
    }
  },

  async getShopById(id) {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          products (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        ...data,
        deliveryAvailable: data.delivery_available !== undefined ? data.delivery_available : true,
        pickupAvailable: data.pickup_available !== undefined ? data.pickup_available : true,
        isOpen: data.is_open !== undefined ? data.is_open : true
      };
    } catch (error) {
      console.error('Error fetching shop by id:', error);
      throw error;
    }
  },

  async searchShops(query) {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .textSearch('name', query);

      if (error) throw error;

      return data.map(shop => ({
        ...shop,
        deliveryAvailable: shop.delivery_available !== undefined ? shop.delivery_available : true,
        pickupAvailable: shop.pickup_available !== undefined ? shop.pickup_available : true,
        isOpen: shop.is_open !== undefined ? shop.is_open : true
      }));
    } catch (error) {
      console.error('Error searching shops:', error);
      throw error;
    }
  }
};