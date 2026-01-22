import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartContext from "../context/CartContext";
import { useDelivery } from "../context/DeliveryContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getProfileImage = () => {
    return user?.user_metadata?.avatar_url || 
           user?.user_metadata?.picture ||
           `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'U')}&background=random`;
  };

  const getUserName = () => {
    return user?.user_metadata?.display_name ||
           user?.email?.split('@')[0] ||
           'Utilisateur';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transform transition-transform duration-200">
            <span className="text-2xl font-bold text-gray-900 tracking-wider">LuxeStyle</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 font-medium text-lg transition-colors"
            >
              Accueil
            </Link>
            <Link
              to="/shops"
              className="text-gray-700 hover:text-gray-900 font-medium text-lg transition-colors"
            >
              Boutiques
            </Link>
          </nav>

          <div className="flex items-center space-x-4">

            {/* Panier */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user && user.id ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={getProfileImage()}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'U')}&background=random`}
                  />
                  <span className="text-gray-700 font-medium text-sm">{getUserName()}</span>
                </button>

                {/* Dropdown utilisateur */}
                <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-200 origin-top-right ${
                  isUserMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                }`}>
                  <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{getUserName()}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="p-2 flex flex-col">
                    <Link
                      to="/compte_user"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span>👤</span> <span>Mon compte</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span>📦</span> <span>Mes commandes</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left text-sm"
                    >
                      <span>🚪</span> <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Menu Mobile Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 bg-white border-t border-gray-200 shadow-lg rounded-b-lg p-4 animate-fade-in">
            <Link to="/" className="block py-2 text-gray-700 hover:text-gray-900 transition-colors">Accueil</Link>
            <Link to="/shops" className="block py-2 text-gray-700 hover:text-gray-900 transition-colors">Boutiques</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
