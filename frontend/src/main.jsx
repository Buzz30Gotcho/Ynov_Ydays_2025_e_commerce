import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartProvider.jsx'; // Import CartProvider
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe
import { Elements } from '@stripe/react-stripe-js'; // Import Elements

// TODO: Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTpgjWNp'); 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider> {/* Wrap with CartProvider */}
      <Elements stripe={stripePromise}> {/* Wrap with Elements for Stripe */}
        <App />
      </Elements>
    </CartProvider>
  </StrictMode>
)