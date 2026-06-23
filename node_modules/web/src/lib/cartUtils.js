
export const getCart = () => {
  try {
    const cart = localStorage.getItem('vityuu_cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Failed to parse cart', error);
    return [];
  }
};

export const saveCart = (cart) => {
  localStorage.setItem('vityuu_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('vityuu_cart_updated'));
};

export const addToCart = (product, quantity = 1) => {
  const currentCart = getCart();
  const existingItem = currentCart.find((item) => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    currentCart.push({ ...product, quantity });
  }
  
  saveCart(currentCart);
};

export const clearCart = () => {
  localStorage.removeItem('vityuu_cart');
  window.dispatchEvent(new Event('vityuu_cart_updated'));
};

export const removeItemFromCart = (productId) => {
  const currentCart = getCart();
  const updatedCart = currentCart.filter(item => item.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
};

export const updateItemQuantity = (productId, quantity) => {
  const currentCart = getCart();
  const updatedCart = currentCart.map(item => {
    if (item.id === productId) {
      return { ...item, quantity: Math.max(1, quantity) };
    }
    return item;
  });
  saveCart(updatedCart);
  return updatedCart;
};

export const getCartItemById = (productId) => {
  const currentCart = getCart();
  return currentCart.find(item => item.id === productId) || null;
};

export const clearCheckedOutItems = (itemIds) => {
  const currentCart = getCart();
  const updatedCart = currentCart.filter(item => !itemIds.includes(item.id));
  saveCart(updatedCart);
  return updatedCart;
};
