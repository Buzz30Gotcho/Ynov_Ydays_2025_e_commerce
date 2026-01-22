import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import localStyleLogo from "/localstyle.png";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Mot de passe requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      // Utilisation du service d'authentification
      const { data, error } = await authService.signIn(formData.email, formData.password);

      if (error) {
        setErrors({ submit: error.message });
      } else if (data.user) {
        // Récupération du profil complet si nécessaire
        const profile = await authService.getUserProfile(data.user.id);
        
        login({
          email: data.user.email,
          id: data.user.id,
          user_metadata: data.user.user_metadata || {},
          profile: profile.data || {}
        });
        
        // Redirection vers la home page
        navigate("/");
      }
    } catch (error) {
      setErrors({ submit: "Erreur lors de la connexion" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await authService.signInWithGoogle();
      
      if (error) {
        setErrors({ submit: error.message });
      }
      // La redirection est gérée par Supabase OAuth (vers l'URL définie dans authService)
    } catch (error) {
      setErrors({ submit: "Erreur lors de la connexion avec Google" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 relative overflow-hidden"
      >
        {/* Background Animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-300 to-blue-500 rounded-full opacity-30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full opacity-30"
        />

        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 flex items-center justify-center flex-col"
          
        >
          <motion.div 
                        whileHover={{ scale: 1.1 }} 
                        className="mx-auto w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm"
                      >
          <img 
                          src={localStyleLogo} 
                          alt="LocalStyle" 
                          className="w-24 h-auto object-contain"
                          
                        />
                        </motion.div>
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4 cursor-default">
            Localstyle
          </h1>
          <p className="text-blue-700 text-base">
            Connectez-vous à votre compte
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Email */}
          <div>
            <label className="block text-blue-800 font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className={`w-full px-4 py-3 pl-11 rounded-xl border-2 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-blue-800 font-medium mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pl-11 pr-12 rounded-xl border-2 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-200 focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Lien mot de passe oublié */}
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Erreur de soumission */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm"
            >
              {errors.submit}
            </motion.div>
          )}

          {/* Bouton de connexion */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </motion.button>

          {/* Séparateur */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-400 text-sm font-medium">ou</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Bouton Google */}
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 border-2 border-gray-300 rounded-xl flex items-center justify-center gap-3 text-gray-700 hover:bg-gray-50/50 hover:border-gray-400 transition-all"
          >
            <img 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              alt="Google" 
              className="w-6 h-6"
            />
            Continuer avec Google
          </motion.button>

          {/* Lien vers l'inscription */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <p className="text-gray-600">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
              >
                Créer un compte
              </Link>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;