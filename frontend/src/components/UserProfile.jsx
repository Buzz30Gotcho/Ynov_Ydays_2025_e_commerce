import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || '',
  });

  const handleSave = async () => {
    // Ici vous ajouterez la logique pour sauvegarder les modifications
    // via votre service Supabase
    console.log('Sauvegarder:', formData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getProfileImage = () => {
    return user?.user_metadata?.avatar_url || 
           user?.user_metadata?.picture || 
           `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'U')}&background=random`;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* En-tête du profil */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start space-x-6">
          {/* Photo de profil */}
          <div className="text-center">
            <img
              src={getProfileImage()}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 mx-auto mb-3"
            />
            {isEditing && (
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Changer la photo
              </button>
            )}
          </div>

          {/* Informations */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 p-2 bg-gray-50 rounded">
                  {formData.firstName || 'Non renseigné'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 p-2 bg-gray-50 rounded">
                  {formData.lastName || 'Non renseigné'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {user?.email_confirmed_at ? '✅ Email confirmé' : '❌ Email non confirmé'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 p-2 bg-gray-50 rounded">
                  {formData.phone || 'Non renseigné'}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 p-2 bg-gray-50 rounded">
                  {formData.address || 'Non renseigné'}
                </p>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Sauvegarder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;