import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ShoppingBag, Building, MapPin, Phone, User, UserCircle } from "lucide-react";
import localStyleLogo from "/localstyle.png";
const RegisterMerchant = () => {
  const [accountType, setAccountType] = useState("independent"); // "independent" ou "professional"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    creatorName: "",
    shopName: "",
    email: "",
    password: "",
    confirmPassword: "",
    siret: "",
    location: "",
    phone: "",
    description: ""
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validation des champs obligatoires pour tous
    if (!formData.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Nom requis";
    if (!formData.shopName.trim()) newErrors.shopName = "Nom de boutique requis";
    if (!formData.email.trim()) newErrors.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email invalide";
    
    if (!formData.password) newErrors.password = "Mot de passe requis";
    else if (formData.password.length < 6)
      newErrors.password = "6 caractères minimum";
    
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    
    if (!formData.location.trim()) newErrors.location = "Localisation requise";
    if (!formData.phone.trim()) newErrors.phone = "Téléphone requis";

    // Validation conditionnelle pour SIRET
    if (accountType === "professional") {
      if (!formData.siret.trim()) {
        newErrors.siret = "Numéro SIRET requis pour un compte professionnel";
      } else if (!/^\d{14}$/.test(formData.siret.replace(/\s/g, ''))) {
        newErrors.siret = "SIRET invalide (14 chiffres)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Données soumises:", { accountType, ...formData });
      navigate("/merchant/login");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const commonFields = [
    {
      name: "firstName",
      type: "text",
      placeholder: "Prénom *",
      icon: UserCircle
    },
    {
      name: "lastName",
      type: "text",
      placeholder: "Nom *",
      icon: UserCircle
    },
    {
      name: "shopName",
      type: "text",
      placeholder: "Nom de votre boutique *",
      icon: ShoppingBag
    },
    {
      name: "email",
      type: "email",
      placeholder: "Adresse email *",
      icon: null
    },
    {
      name: "phone",
      type: "tel",
      placeholder: "Téléphone *",
      icon: Phone
    },
    {
      name: "location",
      type: "text",
      placeholder: "Ville / Quartier *",
      icon: MapPin
    },
    {
      name: "description",
      type: "text",
      placeholder: "Description de votre activité",
      icon: null
    }
  ];

  const passwordFields = [
    {
      name: "password",
      type: "password",
      placeholder: "Mot de passe *",
      icon: null
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirmez le mot de passe *",
      icon: null
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-blue-100"
      >
        {/* Header avec fond coloré */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              className="mx-auto w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm"
            >
              <img 
                              src={localStyleLogo} 
                              alt="LocalStyle" 
                              className="w-32 h-auto object-contain"
                              
                            />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">Devenez Créateur LocalStyle</h2>
            <p className="text-blue-100 text-lg">
              Rejoignez notre communauté de créateurs locaux
            </p>
          </motion.div>
        </div>

        <div className="p-8">
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{" "}
              <Link 
                to="/merchant/login" 
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Connectez-vous
              </Link>
            </p>
          </div>

          {/* Sélecteur de type de compte */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type de compte *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAccountType("independent")}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  accountType === "independent"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                <User size={24} className="mx-auto mb-2" />
                <div className="font-semibold">Indépendant</div>
                <div className="text-xs mt-1">Artisan • Créateur • Auto-entrepreneur</div>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAccountType("professional")}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  accountType === "professional"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                <Building size={24} className="mx-auto mb-2" />
                <div className="font-semibold">Professionnel</div>
                <div className="text-xs mt-1">Entreprise • Société • Commerce</div>
              </motion.button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonFields.map((field, i) => (
                <motion.div 
                  key={field.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={field.name === "description" ? "md:col-span-2" : ""}
                >
                  <div className="relative">
                    {field.icon && (
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <field.icon size={20} />
                      </div>
                    )}
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors[field.name] 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-200 focus:border-blue-500"
                      } ${field.icon ? "pl-11" : ""}`}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors[field.name]}
                    </p>
                  )}
                </motion.div>
              ))}

              {/* Champ SIRET conditionnel */}
              {accountType === "professional" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="md:col-span-2"
                >
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="siret"
                      value={formData.siret}
                      onChange={handleChange}
                      placeholder="Numéro SIRET (14 chiffres) *"
                      className={`w-full px-4 py-3 pl-11 rounded-xl border-2 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        errors.siret 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-200 focus:border-green-500"
                      }`}
                    />
                  </div>
                  {errors.siret && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors.siret}
                    </p>
                  )}
                </motion.div>
              )}

              {passwordFields.map((field, i) => (
                <motion.div 
                  key={field.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (commonFields.length + i) * 0.1 }}
                >
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors[field.name] 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors[field.name]}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed mt-6 ${
                accountType === "professional" 
                  ? "bg-gradient-to-r from-green-600 to-blue-600" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Création du compte...
                </>
              ) : (
                accountType === "professional" ? "Créer mon compte professionnel" : "Devenir Créateur Indépendant"
              )}
            </motion.button>

            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-400 text-sm font-medium">ou</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="w-full py-3 border-2 border-gray-300 rounded-xl flex items-center justify-center gap-3 text-gray-700 hover:bg-gray-50/50 hover:border-gray-400 transition-all"
            >
              <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google" 
                className="w-6 h-6"
              />
              Continuer avec Google
            </motion.button>

            <p className="text-xs text-gray-500 text-center mt-6">
              En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterMerchant;