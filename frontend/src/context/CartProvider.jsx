import React, { useState, useEffect } from 'react'
import CartContext from './CartContext'
import * as cartService from '../services/cartService'

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCart() {
      try {
        const data = await cartService.getCart()
        setCart(data)
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [])

  const addItem = async (product, quantity = 1) => {
    try {
      // Optimistic update: add to cart immediately
      const existingItem = cart.find((item) => item.products.id === product.id)
      if (existingItem) {
        const updatedCart = cart.map((item) =>
          item.products.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
        setCart(updatedCart)
      } else {
        // This is tricky without the real backend response.
        // We'll just add the product info and a temporary quantity.
        const tempNewItem = {
            id: `temp-${Date.now()}`, // Temporary ID
            quantity: quantity,
            products: product
        }
        setCart([...cart, tempNewItem])
      }
      
      const newItem = await cartService.addItemToCart({ product_id: product.id, quantity })
      // To get the real cart state, we should probably refetch it.
      const data = await cartService.getCart()
      setCart(data)


    } catch (error) {
      console.error('Failed to add item to cart:', error)
      // Optionally, revert the optimistic update here
    }
  }

  const updateItemQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeItem(itemId)
    }
    try {
      const updatedCart = cart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
      setCart(updatedCart)
      await cartService.updateCartItem(itemId, { quantity })
    } catch (error) {
      console.error('Failed to update item quantity:', error)
    }
  }

  const removeItem = async (itemId) => {
    try {
      const updatedCart = cart.filter((item) => item.id !== itemId)
      setCart(updatedCart)
      await cartService.removeCartItem(itemId)
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
    }
  }

  const clearCart = async () => {
    try {
        setCart([])
        await cartService.clearCart()
    } catch (error) {
        console.error('Failed to clear cart:', error)
    }
  }

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
