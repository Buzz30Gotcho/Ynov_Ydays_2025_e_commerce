import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { motion } from 'framer-motion';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'; // Import Stripe hooks and PaymentElement

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartCount, totalPrice, clearCart } = useContext(CartContext);
  const stripe = useStripe(); // Initialize Stripe
  const elements = useElements(); // Initialize Elements
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [paymentError, setPaymentError] = useState(null); // To display Stripe errors
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Simulate fetching a client secret from your backend
  // In a real app, this would be an API call after creating a PaymentIntent
  const [clientSecret, setClientSecret] = useState('pi_MOCK_CLIENT_SECRET_EXAMPLE'); // Placeholder client secret

  const handleShippingChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setIsProcessing(false);
      return;
    }

    // In a real application, you'd make an API call to your backend
    // to create a PaymentIntent and get its client_secret.
    // For this boilerplate, we'll use a mock clientSecret.

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${window.location.origin}/checkout/confirmation`, // This is where Stripe redirects after payment
          shipping: { // Pass shipping details to Stripe
            name: shippingDetails.fullName,
            address: {
              line1: shippingDetails.address,
              city: shippingDetails.city,
              postal_code: shippingDetails.postalCode,
              country: shippingDetails.country,
            }
          }
        },
        redirect: 'if_required', // Don't redirect immediately
      });

      if (error) {
        setPaymentError(error.message);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setOrderPlaced(true);
        clearCart();
        // In a real app, you'd also confirm the payment success with your backend
        // and navigate to a proper confirmation page.
        // navigate('/checkout/confirmation'); 
      } else {
        // Handle other statuses or unknown errors
        setPaymentError('Une erreur inattendue est survenue lors du paiement.');
        setIsProcessing(false);
      }
    } catch (err) {
      setPaymentError('Une erreur réseau ou de serveur est survenue.');
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <motion.div 
        className="container mx-auto px-4 py-16 text-center bg-background rounded-lg shadow-md mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-4">Commande Passée avec Succès ! 🎉</h1>
        <p className="text-text-medium mb-6">Merci pour votre achat. Votre commande sera traitée sous peu.</p>
        <button 
          onClick={() => navigate('/')} 
          className="inline-block bg-primary text-background px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
        >
          Retour à l'accueil
        </button>
      </motion.div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-background rounded-lg shadow-md mt-8">
        <h1 className="text-3xl font-bold text-text-dark mb-4">Votre panier est vide 🛒</h1>
        <p className="text-text-medium mb-6">Ajoutez des articles avant de passer commande.</p>
        <button 
          onClick={() => navigate('/')} 
          className="inline-block bg-primary text-background px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text-dark mb-8 text-center">Finaliser votre commande</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Details */}
        <motion.div 
          className="lg:w-2/3 bg-neutral-light rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-text-dark mb-6 border-b pb-4 border-neutral-medium">
            1. Adresse de livraison
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Nom complet"
              value={shippingDetails.fullName}
              onChange={handleShippingChange}
              className="col-span-2 p-3 border border-neutral-medium rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-dark placeholder-text-light"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Adresse (Numéro et Rue)"
              value={shippingDetails.address}
              onChange={handleShippingChange}
              className="col-span-2 p-3 border border-neutral-medium rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-dark placeholder-text-light"
              required
            />
            <input
              type="text"
              name="city"
              placeholder="Ville"
              value={shippingDetails.city}
              onChange={handleShippingChange}
              className="p-3 border border-neutral-medium rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-dark placeholder-text-light"
              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Code Postal"
              value={shippingDetails.postalCode}
              onChange={handleShippingChange}
              className="p-3 border border-neutral-medium rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-dark placeholder-text-light"
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Pays"
              value={shippingDetails.country}
              onChange={handleShippingChange}
              className="col-span-2 p-3 border border-neutral-medium rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text-dark placeholder-text-light"
              required
            />
          </form>

          {/* Payment Details - Stripe */}
          <h2 className="text-2xl font-bold text-text-dark mb-6 mt-10 border-b pb-4 border-neutral-medium">
            2. Informations de paiement
          </h2>
          {clientSecret && elements && stripe ? ( // Render PaymentElement only if Stripe is ready
            <form id="payment-form" onSubmit={handlePlaceOrder}>
              <PaymentElement id="payment-element" />
              {paymentError && <div className="text-danger mt-4">{paymentError}</div>}
              {/* This button is now part of the form submitting PaymentElement */}
              {/* The actual submission button is below in the summary section */}
            </form>
          ) : (
            <div className="flex justify-center items-center py-4">
              <LoadingSpinner size="sm" message="Chargement du formulaire de paiement..." />
            </div>
          )}
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          className="lg:w-1/3 bg-neutral-light rounded-lg shadow-sm p-6 self-start"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-text-dark mb-4 border-b pb-4 border-neutral-medium">
            3. Récapitulatif de la commande
          </h2>
          <div className="space-y-3 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center text-text-medium text-sm">
                <p>{item.products.name} x {item.quantity}</p>
                <p>{(item.products.price * item.quantity).toFixed(2)} €</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <p className="text-text-medium">Sous-total:</p>
            <p className="text-text-dark font-semibold">{totalPrice.toFixed(2)} €</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-text-medium">Livraison:</p>
            <p className="text-text-dark font-semibold">Gratuit</p> {/* Placeholder for now */}
          </div>
          <div className="border-t border-neutral-medium pt-4 mt-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-text-dark">Total:</h2>
            <h2 className="text-2xl font-bold text-primary">{totalPrice.toFixed(2)} €</h2>
          </div>

          <motion.button
            type="submit" // Changed to submit
            form="payment-form" // Link to the payment form
            disabled={isProcessing || !stripe || !elements || !clientSecret || !shippingDetails.fullName || !shippingDetails.address || !shippingDetails.city || !shippingDetails.postalCode || !shippingDetails.country}
            className="mt-6 w-full inline-block text-center bg-primary text-background px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isProcessing || !stripe || !elements || !clientSecret ? 1 : 1.01 }}
            whileTap={{ scale: isProcessing || !stripe || !elements || !clientSecret ? 1 : 0.99 }}
          >
            {isProcessing ? 'Traitement...' : 'Payer et passer commande'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;