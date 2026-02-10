import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDelivery } from '../context/DeliveryContext';
import { useShops } from '../hooks/useShops';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import heroImage from '/localstyle.png';

const MotionLink = motion(Link);

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const { deliveryMode } = useDelivery();
  const { user, loading: authLoading } = useAuth();
  const { shops, loading: shopsLoading, error } = useShops(selectedCategory, deliveryMode);


  // Mouse interactions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-200, 200], [1.5, -1.5]); // rotation plus douce
  const rotateY = useTransform(mouseX, [-200, 200], [-1.5, 1.5]); // rotation plus douce

  // Catégories streetwear avec emojis
  const categories = [
    { emoji: "👟", name: "Chaussures" },
    { emoji: "👕", name: "Vêtements" },
    { emoji: "💎", name: "Accessoires" },
    { emoji: "🕶️", name: "Mixte" },
  ];


  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-text-dark mb-4">Erreur de chargement</h2>
          <p className="text-text-medium max-w-md mx-auto text-base">{error}</p>
        </motion.div>
      </div>
    );
  }

 const filteredShops = shops?.filter(shop => 
  shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  shop.category.toLowerCase().includes(searchQuery.toLowerCase())
);



  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <section 
        className="relative py-16 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary-dark"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotateX, rotateY }}
          transition={{ type: "spring", damping: 25, stiffness: 80 }}
        >
          <motion.img
            src={heroImage}
            alt="LocalStyle - Streetwear Local"
            className="w-4/5 h-4/5 object-contain opacity-25"
            animate={{ 
              scale: isHovering ? 1.005 : 1,
            }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        <motion.div
          className="relative z-20 text-center px-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 className="text-5xl md:text-6xl font-serif font-black text-background mb-6">
            LocalStyle
          </motion.h1>
          
          <motion.h2
            className="text-xl md:text-2xl font-semibold text-neutral-light mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {user
              ? `Salut ${user.user_metadata?.display_name || user.email?.split('@')[0]} 👋`
              : 'Streetwear Local & Authentique'}
          </motion.h2>

          <motion.p
            className="text-neutral-medium text-lg mb-8 max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {user
              ? deliveryMode === 'delivery'
                ? 'Découvre les créateurs streetwear qui livrent chez toi'
                : 'Explore les shops urbains près de chez toi'
              : 'Découvre les créateurs indépendants et leurs pièces uniques'}
          </motion.p>

          <motion.div
            className="max-w-lg mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher un shop, une marque ou un style..."
              className="bg-neutral-light/20 backdrop-blur-lg border border-neutral-medium/30 text-background placeholder-neutral-medium rounded-xl text-base"
            />
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <MotionLink
              to="/shops"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-background text-primary px-8 py-4 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl"
            >
              🚀 Explorer les shops
            </MotionLink>

            {user ? (
              <MotionLink
                to="/compte_user"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-background text-background px-8 py-4 rounded-xl font-bold text-base transition-all"
              >
                👤 Mon compte
              </MotionLink>
            ) : (
              <MotionLink
                to="/login"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-background text-background px-8 py-4 rounded-xl font-bold text-base transition-all"
              >
                🔑 Se connecter
              </MotionLink>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Shops Section avec barre d'emojis */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <motion.div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-dark mb-3">
              Explore par Style
            </h2>
            <p className="text-text-medium text-lg max-w-2xl mx-auto">
              Découvre les dernières tendances streetwear par catégorie
            </p>
          </motion.div>

          {/* Barre d'emojis */}
<motion.div 
  className="flex justify-center flex-wrap gap-3 md:gap-4 lg:gap-5 max-w-5xl mx-auto mb-10"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  {categories.map((category, index) => (
    <motion.button
      key={category.name}
      onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}     
      initial={{ opacity: 0, y: 8 }} 
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className={`
        flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300
        min-w-[80px] md:min-w-[100px] group relative
        ${selectedCategory === category.name 
          ? "bg-gradient-to-r from-primary-dark to-primary text-background shadow-md scale-100"
          : "bg-neutral-light text-text-medium border border-neutral-medium hover:border-primary-light hover:bg-neutral-light"
        }
      `}
    >
      <span className="text-3xl md:text-4xl mb-1 transition-transform duration-300">
        {category.emoji}
      </span>
      <span
        className={`text-xs md:text-sm font-medium transition-all duration-300 ${
          selectedCategory === category.name
            ? "text-background font-semibold"
            : "text-text-medium"
        }`}
      >
        {category.name}
      </span>
    </motion.button>
  ))}
</motion.div>


          <AnimatePresence mode="wait">
            {shopsLoading ? (
              <motion.div className="flex justify-center items-center py-16">
                <LoadingSpinner size="large" />
              </motion.div>
            ) : filteredShops && filteredShops.length > 0 ? (
              (() => {
                // Si une catégorie est sélectionnée, on montre jusqu'à 5 shops de cette catégorie
                if (selectedCategory) {
                  const toShow = filteredShops
                    .filter(s => (s.category || '').toLowerCase() === selectedCategory.toLowerCase())
                    .slice(0, 5);

                  return (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {toShow.map((shop, index) => (
                        <motion.div
                          key={shop.id}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.06 }}
                          whileHover={{ scale: 1.01, y: -1 }}
                          className="bg-background rounded-2xl shadow-lg border border-neutral-light overflow-hidden cursor-pointer group"
                        >
                          <Link to={`/shop/${shop.id}`}>
                            <div className="h-44 w-full overflow-hidden relative">
                              <motion.img
                                src={shop.image || heroImage}
                                alt={shop.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-text-dark/20 to-transparent" />
                            </div>
                            <div className="p-5">
                              <h3 className="text-base font-bold text-text-dark mb-2 line-clamp-2">
                                {shop.name}
                              </h3>
                              <p className="text-text-medium text-sm mb-3 capitalize">
                                {shop.category}
                              </p>
                              <div className="flex justify-between items-center">
                                <p className="text-primary font-semibold text-sm">
                                  {shop.distance ? `${shop.distance} km` : '📍 Local'}
                                </p>
                                <motion.span whileHover={{ scale: 1.05 }} className="text-lg font-bold">
                                  →
                                </motion.span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  );
                }

                // Sinon, on affiche 5 magasins au total, un par type maximum
                const typeOrder = categories.map(c => c.name);
                const picked = [];
                const pickedIds = new Set();
                const usedTypes = new Set();

                // 1ère passe: respecter l'ordre défini des catégories
                for (const type of typeOrder) {
                  const shop = filteredShops.find(s => (s.category || '').toLowerCase() === type.toLowerCase());
                  if (shop && !pickedIds.has(shop.id)) {
                    picked.push(shop);
                    pickedIds.add(shop.id);
                    usedTypes.add(type.toLowerCase());
                    if (picked.length === 5) break;
                  }
                }

                // 2ème passe: compléter avec d'autres types non utilisés encore
                if (picked.length < 5) {
                  for (const s of filteredShops) {
                    const t = (s.category || '').toLowerCase();
                    if (!pickedIds.has(s.id) && !usedTypes.has(t)) {
                      picked.push(s);
                      pickedIds.add(s.id);
                      usedTypes.add(t);
                      if (picked.length === 5) break;
                    }
                  }
                }

                return (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {picked.map((shop, index) => (
                      <motion.div
                        key={shop.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ scale: 1.01, y: -1 }}
                        className="bg-background rounded-2xl shadow-lg border border-neutral-light overflow-hidden cursor-pointer group"
                      >
                        <Link to={`/shop/${shop.id}`}>
                          <div className="h-44 w-full overflow-hidden relative">
                            <motion.img
                              src={shop.image || heroImage}
                              alt={shop.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-text-dark/20 to-transparent" />
                          </div>
                          <div className="p-5">
                            <h3 className="text-base font-bold text-text-dark mb-2 line-clamp-2">
                              {shop.name}
                            </h3>
                            <p className="text-text-medium text-sm mb-3 capitalize">
                              {shop.category}
                            </p>
                            <div className="flex justify-between items-center">
                              <p className="text-primary font-semibold text-sm">
                                {shop.distance ? `${shop.distance} km` : '📍 Local'}
                              </p>
                              <motion.span whileHover={{ scale: 1.05 }} className="text-lg font-bold">
                                →
                              </motion.span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                );
              })()
            ) : (
              <motion.div
                className="text-center py-16 bg-neutral-light/80 backdrop-blur-sm rounded-2xl border border-neutral-medium shadow-md max-w-2xl mx-auto"
              >
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-text-dark mb-4">Aucun shop trouvé</h3>
                <p className="text-text-medium mb-8 text-lg">
                  Essaie une autre catégorie ou modifie ta recherche.
                </p>
                {(selectedCategory || searchQuery) && (
                  <motion.button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery('');
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.99 }}
                    className="bg-gradient-to-r from-primary-dark to-primary text-background px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Voir tous les shops
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Créateurs Section */}
      <section className="py-20 bg-gradient-to-br from-primary-light to-secondary-light border-t border-neutral-medium text-center">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-text-dark mb-6">
            Les créateurs locaux qui font le style 💙
          </h3>
          <p className="text-text-medium max-w-2xl mx-auto mb-10">
            Soutiens les artisans et designers urbains de ta région.
          </p>

          <div className="mt-14 bg-primary-dark text-background rounded-2xl shadow-lg p-10 max-w-3xl mx-auto">
            <h4 className="text-2xl font-semibold mb-3">
              Tu veux exposer ton style ?
            </h4>
            <p className="text-neutral-light mb-6">
              Rejoins LocalStyle et fais découvrir tes créations à la communauté.  
              Gère ton shop et ta visibilité facilement.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/merchant/register"
                className="bg-background text-primary-dark hover:bg-neutral-light px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                🚀 Devenir créateur partenaire
              </Link>              
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-dark mb-4">
              Pourquoi choisir LocalStyle ?
            </h2>
            <p className="text-text-medium text-base max-w-2xl mx-auto">
              La plateforme qui révolutionne votre shopping streetwear en connectant directement avec les créateurs locaux.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '🎯', title: 'Authenticité', desc: 'Des pièces uniques et limitées directement des créateurs de votre région.' },
              { icon: '🚀', title: 'Rapidité', desc: 'Livraison express et retrait en boutique selon vos préférences.' },
              { icon: '💎', title: 'Exclusivité', desc: 'Accès à des collections introuvables ailleurs.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center p-4 bg-neutral-light rounded-xl border border-neutral-medium hover:shadow-md transition-all"
                whileHover={{ y: -2 }}
              >
                <div className="w-12 h-12 bg-secondary-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">{item.title}</h3>
                <p className="text-text-medium text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>  );
};

export default Home;
