const BASE_URL = 'http://localhost:4000' // The backend server URL

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) // Catch if response is not json
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }

  // For DELETE requests with no content, or other methods that might not return JSON
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null 
  }

  return response.json()
}

export function getCart() {
  return request('/cart')
}

export function addItemToCart(item) { // item should be { product_id, quantity }
  return request('/cart', {
    method: 'POST',
    body: JSON.stringify(item),
  })
}

export function updateCartItem(id, payload) { // payload should be { quantity }
  return request(`/cart/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function removeCartItem(id) {
  return request(`/cart/${id}`, {
    method: 'DELETE',
  })
}

export function clearCart() {
    return request('/cart', {
        method: 'DELETE'
    })
}
