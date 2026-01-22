// services/merchantService.js
import { supabase } from './supabaseClient';

export const merchantService = {
  // Créer un vendeur et sa boutique
  createMerchant: async (userData, shopData) => {
    // 1. Créer l'utilisateur avec rôle shop_owner
    const { data: user, error: userError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: 'shop_owner',
          display_name: userData.displayName
        }
      }
    });

    if (userError) return { error: userError };

    // 2. Mettre à jour le profil avec infos pro
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        siret: userData.siret,
        company_name: userData.companyName,
        legal_status: userData.legalStatus,
        professional_data_consent: userData.professionalConsent,
        professional_consent_at: new Date().toISOString()
      })
      .eq('id', user.user.id);

    if (profileError) return { error: profileError };

    // 3. Créer la boutique
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .insert({
        name: shopData.shopName,
        category: shopData.category,
        description: shopData.description,
        address: shopData.address,
        city: shopData.city,
        postal_code: shopData.postalCode,
        phone: shopData.phone,
        email: shopData.email,
        owner_id: user.user.id,
        is_active: false // En attente de validation
      })
      .select()
      .single();

    if (shopError) return { error: shopError };

    // 4. Ajouter comme staff propriétaire
    const { error: staffError } = await supabase
      .from('shop_staff')
      .insert({
        shop_id: shop.id,
        user_id: user.user.id,
        role: 'owner'
      });

    if (staffError) return { error: staffError };

    return { user, shop };
  },

  // Récupérer les boutiques d'un vendeur
  getMerchantShops: async (userId) => {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Vérifier si l'utilisateur est vendeur
  isMerchant: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    return { isMerchant: data?.role === 'shop_owner', error };
  }
};