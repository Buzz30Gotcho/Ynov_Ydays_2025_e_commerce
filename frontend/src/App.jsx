import React from "react";
import { AuthProvider } from "./context/AuthProvider";
import { DeliveryProvider } from "./context/DeliveryContext";
import { CartProvider } from "./context/CartProvider";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <DeliveryProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </DeliveryProvider>
    </AuthProvider>
  );
}

export default App;
