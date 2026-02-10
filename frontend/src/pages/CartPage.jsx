import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import CartContext from '../context/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CartPage() {
  const { cart, cartCount, loading, updateItemQuantity, removeItem, clearCart } = useContext(CartContext)

  if (loading) {
    return <LoadingSpinner />
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-background rounded-lg shadow-md mt-8">
        <h1 className="text-3xl font-bold text-text-dark mb-4">Votre panier est vide 🛒</h1>
        <p className="text-text-medium mb-6">Il est temps de trouver de superbes articles !</p>
        <Link to="/" className="inline-block bg-primary text-background px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
          Continuer vos achats
        </Link>
      </div>
    )
  }

  const totalPrice = cart.reduce((total, item) => total + item.products.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text-dark mb-6">Votre Panier ({cartCount} articles)</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 flex flex-col gap-4"> {/* Left column for cart items */}
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-neutral-light rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-4">
                <img src={item.products.image_url || '/placeholder.png'} alt={item.products.name} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <h2 className="text-text-dark font-semibold text-lg">{item.products.name}</h2>
                  <p className="text-text-medium">{item.products.price.toFixed(2)} €</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-background rounded-md hover:bg-neutral-medium text-text-dark"
                  >
                    -
                  </button>
                  <span className="text-text-dark">{item.quantity}</span>
                  <button
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-background rounded-md hover:bg-neutral-medium text-text-dark"
                  >
                    +
                  </button>
                </div>
                <p className="font-bold text-text-dark">{(item.products.price * item.quantity).toFixed(2)} €</p>
                <button onClick={() => removeItem(item.id)} className="text-danger hover:text-red-700">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <button onClick={clearCart} className="bg-danger text-background px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Vider le panier
            </button>
          </div>
        </div>

        <div className="lg:w-1/3 bg-neutral-light rounded-lg shadow-sm p-6"> {/* Right column for summary */}
          <h2 className="text-2xl font-bold text-text-dark mb-4">Résumé de la commande</h2>
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
          <Link to="/checkout" className="mt-6 w-full inline-block text-center bg-primary text-background px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
            Passer la commande
          </Link>
        </div>
      </div>
    </div>
  )
}
