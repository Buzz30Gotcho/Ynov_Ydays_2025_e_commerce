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
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
        <Link to="/" className="text-blue-500 hover:underline">
          Continuer vos achats
        </Link>
      </div>
    )
  }

  const totalPrice = cart.reduce((total, item) => total + item.products.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Votre Panier ({cartCount} articles)</h1>
      <div className="flex flex-col gap-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <img src={item.products.image_url || '/placeholder.png'} alt={item.products.name} className="w-20 h-20 object-cover rounded" />
              <div>
                <h2 className="text-lg font-semibold">{item.products.name}</h2>
                <p className="text-gray-600">{item.products.price.toFixed(2)} €</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <p className="font-semibold">{(item.products.price * item.quantity).toFixed(2)} €</p>
              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div>
            <button onClick={clearCart} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Vider le panier
            </button>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">Total: {totalPrice.toFixed(2)} €</h2>
          <Link to="/checkout" className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
            Passer la commande
          </Link>
        </div>
      </div>
    </div>
  )
}
