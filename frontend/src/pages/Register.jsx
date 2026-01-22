import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import localStyleLogo from "/localstyle.png";


const Register = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    newsletter: false,
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Calcul de la force du mot de passe
  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    
    let strength = 0;
    
    // Longueur
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Complexité
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return Math.min(strength, 3);
  };

  const passwordStrengthText = () => {
    switch (passwordStrength()) {
      case 0:
      case 1:
        return 'Faible - Utilisez plus de caractères';
      case 2:
        return 'Moyen - Ajoutez des caractères spéciaux';
      case 3:
        return 'Fort - Bon mot de passe !';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    
    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    // Validation RGPD - OBLIGATOIRE
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation et la politique de confidentialité (RGPD obligatoire)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  // ✅ CORRECT - loading est géré dans le composant
  setLoading(true);

  try {
    const result = await authService.signUp(
      formData.email,
      formData.password,
      formData.displayName,
      formData.newsletter
    );
    
    if (result.success) {
      if (result.requiresEmailConfirmation) {
        navigate('/login');
      } else {
        navigate('/');
      }
    } else {
      setErrors({ submit: result.error?.message || "Erreur lors de l'inscription" });
    }
  } catch (error) {
    setErrors({ submit: error.message });
  } finally {
    // ✅ CORRECT - loading est géré dans le composant
    setLoading(false);
  }
};


  const handleGoogleRegister = async () => {
    // Vérification RGPD avant Google OAuth
    if (!formData.acceptTerms) {
      setErrors({ 
        acceptTerms: "Vous devez accepter les conditions avant de vous inscrire avec Google" 
      });
      return;
    }

    setGoogleLoading(true);
    try {
      const { error } = await authService.signInWithGoogle();
      if (error) {
        setErrors({ submit: error.message });
      }
    } catch (error) {
      setErrors({ submit: "Erreur lors de l'inscription avec Google" });
    } finally {
      setGoogleLoading(false);
    }
  };

  // ... (le reste du JSX reste inchangé)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
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
          className="text-center mb-8"
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
            LocalStyle
          </h1>
          <p className="text-blue-700 text-base">
            Créer votre compte
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Nom d'affichage */}
          <div>
            <label className="block text-blue-800 font-medium mb-2">
              Nom d'affichage <span className="text-gray-500 text-sm">(Optionnel)</span>
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Comment souhaitez-vous être appelé ?"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-blue-800 font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
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
                required
                disabled={loading}
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
            <label className="block text-blue-800 font-medium mb-2">
              Mot de passe <span className="text-red-500">*</span>
            </label>
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
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <div className="mt-3">
                <div className="flex gap-1 mb-2">
                  <div className={`h-2 flex-1 rounded-full transition-colors ${
                    passwordStrength() >= 1 ? 'bg-red-500' : 'bg-gray-300'
                  }`}></div>
                  <div className={`h-2 flex-1 rounded-full transition-colors ${
                    passwordStrength() >= 2 ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}></div>
                  <div className={`h-2 flex-1 rounded-full transition-colors ${
                    passwordStrength() >= 3 ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                </div>
                <p className="text-xs text-gray-600">
                  {passwordStrengthText()}
                </p>
              </div>
            )}
            
            {errors.password && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label className="block text-blue-800 font-medium mb-2">
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pl-11 pr-12 rounded-xl border-2 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.confirmPassword 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-200 focus:border-blue-500"
                }`}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Section RGPD - OBLIGATOIRE */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-yellow-800 text-sm">Conformité RGPD</div>
                <div className="text-yellow-700 text-xs">
                  Vous devez accepter nos conditions pour créer un compte.
                </div>
              </div>
            </div>
            
            <label className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              errors.acceptTerms 
                ? "border-red-200 bg-red-50" 
                : "border-transparent bg-white"
            }`}>
              <div className="flex items-start gap-2 mt-0.5">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  required
                />
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                <strong>J'accepte</strong> les{" "}
                <Link to="/terms" className="text-blue-600 font-semibold hover:underline" target="_blank">
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link to="/privacy" className="text-blue-600 font-semibold hover:underline" target="_blank">
                  politique de confidentialité
                </Link>{" "}
                de LocalStyle. Je comprends que mes données seront traitées conformément au RGPD.
              </span>
            </label>
            
            {errors.acceptTerms && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {errors.acceptTerms}
              </p>
            )}
          </div>

          {/* Se souvenir de moi - OPTIONNEL */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">
              Se souvenir de moi
            </span>
          </div>

          {/* Newsletter - OPTIONNEL */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">
              Je souhaite recevoir des conseils et actualités par email
            </span>
          </div>

          {/* Erreur de soumission */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.submit}
            </motion.div>
          )}

          {/* Bouton d'inscription */}
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
                Création du compte...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Créer mon compte
              </>
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
            onClick={handleGoogleRegister}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={googleLoading}
            className="w-full py-3 border-2 border-gray-300 rounded-xl flex items-center justify-center gap-3 text-gray-700 hover:bg-gray-50/50 hover:border-gray-400 transition-all disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                <img 
                  src="https://www.svgrepo.com/show/475656/google-color.svg" 
                  alt="Google" 
                  className="w-6 h-6"
                />
                S'inscrire avec Google
              </>
            )}
          </motion.button>

          {/* Lien vers connexion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <p className="text-gray-600">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;