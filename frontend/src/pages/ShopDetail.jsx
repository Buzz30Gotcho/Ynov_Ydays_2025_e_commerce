import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Corrige l'import
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Filter, 
  Grid, 
  List, 
  Search,
  ChevronDown,
  Truck,
  Shield,
  Clock
} from 'lucide-react';
import { useShop } from '../hooks/useShop';
import LoadingSpinner from '../components/LoadingSpinner';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate est maintenant importé
  const { shop, loading, error } = useShop(id);

  // states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all'); // 'all' | 'homme' | 'femme' | 'unisexe'
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // derived categories from shop products
  const categories = useMemo(() => {
    if (!shop?.products) return ['all'];
    const unique = [...new Set(shop.products.map(p => p.category || 'Autres'))];
    return ['all', ...unique];
  }, [shop?.products]);

  // filtered + sorted products
  const filteredProducts = useMemo(() => {
    if (!shop?.products) return [];

    const q = searchQuery.trim().toLowerCase();

    let filtered = shop.products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || (product.category === selectedCategory);
      const matchesSearch = !q ||
        (product.name && product.name.toLowerCase().includes(q)) ||
        (product.description && product.description.toLowerCase().includes(q));
      const matchesPrice = (typeof product.price === 'number') && product.price >= priceRange[0] && product.price <= priceRange[1];

      // normalize gender values (allow 'homme'/'male','femme'/'female','unisexe'/'unisex')
      const g = (product.gender || 'unisexe').toString().toLowerCase();
      const normGender = g === 'male' ? 'homme' : g === 'female' ? 'femme' : g === 'unisex' ? 'unisexe' : g;

      const matchesGender = genderFilter === 'all' || normGender === genderFilter;

      return matchesCategory && matchesSearch && matchesPrice && matchesGender;
    });

    // sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return filtered;
  }, [shop?.products, selectedCategory, searchQuery, sortBy, priceRange, genderFilter]);

  // favorites toggle
  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  // cart add
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Erreur: {error}</div>;
  if (!shop) return <div className="not-found">Boutique non trouvée</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <motion.div whileHover={{ scale: 1.02 }} className="lg:w-1/3">
              <img src={shop.image} alt={shop.name} className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-lg" />
            </motion.div>

            <div className="lg:w-2/3 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">{shop.name}</h1>
                  <p className="text-lg text-purple-600 font-semibold mt-2">{shop.category}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                >
                  <Heart className="w-6 h-6" />
                </motion.button>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">{shop.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">{shop.rating ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>{shop.delivery_time ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Truck className="w-5 h-5 text-green-500" />
                  <span>{shop.delivery_fee ? `${shop.delivery_fee}€` : '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <span>Min. {shop.minimum_order ?? '—'}€</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {shop.tags?.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search + Filters button */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-start">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtres
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>

            {/* Controls (category, gender badges, sort, view) */}
            <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
              {/* Categories select */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Toutes les catégories' : category}
                  </option>
                ))}
              </select>

              {/* Gender badges (Option C) */}
              <div className="flex items-center gap-2">
                {['all','homme','femme','unisexe'].map(g => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`px-3 py-1 rounded-full border text-sm transition ${
                      genderFilter === g ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {g === 'all' ? 'Tous' : g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="popular">Populaires</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
              </select>

              {/* View mode */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}><Grid className="w-4 h-4" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Advanced filters area */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix: {priceRange[0]}€ - {priceRange[1]}€</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Products list */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-gray-600">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
        </div>

        {viewMode === 'grid' ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  isFavorite={favorites.has(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onAddToCart={() => addToCart(product)}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  index={index}
                  isFavorite={favorites.has(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onAddToCart={() => addToCart(product)}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos filtres ou votre recherche</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* -----------------------------
   ProductCard (grid) & ProductRow (list)
   kept simple and compatible with props used above
   ----------------------------- */

const ProductCard = ({ product, index, isFavorite, onToggleFavorite, onAddToCart, onClick }) => ( // Ajoute onClick
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ delay: index * 0.03 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group cursor-pointer"
    onClick={onClick} // Ajoute cette ligne
  >
    <div className="relative overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className={`p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}>
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-600">{product.rating ?? '-'}</span>
        </div>
        <span className="text-sm text-gray-500">{product.category}</span>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div>
          <div className="text-xl font-bold text-gray-900">{product.price}€</div>
          {product.originalPrice && <div className="text-sm text-gray-500 line-through">{product.originalPrice}€</div>}
        </div>

        <button onClick={(e) => { e.stopPropagation(); onAddToCart(); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          <ShoppingCart className="w-4 h-4" />
          <span className="text-sm font-medium">Ajouter</span>
        </button>
      </div>
    </div>
  </motion.div>
);

const ProductRow = ({ product, index, isFavorite, onToggleFavorite, onAddToCart, onClick }) => ( // Ajoute onClick
  <motion.div 
    layout 
    initial={{ opacity: 0, x: -10 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: 10 }} 
    transition={{ delay: index * 0.02 }} 
    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow cursor-pointer group"
    onClick={onClick} // Ajoute cette ligne
  >
    <div className="flex gap-6">
      <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-lg" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
            <p className="text-gray-600 mb-3">{product.description}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className={`p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
            <Heart className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating ?? '-'}</span>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">{product.price}€</span>
              {product.originalPrice && <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}€</span>}
            </div>

            <button onClick={(e) => { e.stopPropagation(); onAddToCart(); }} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg">
              <ShoppingCart className="w-4 h-4" />
              <span className="font-medium">Ajouter au panier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ShopDetail;