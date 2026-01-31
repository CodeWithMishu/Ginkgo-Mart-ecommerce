// Cart utility functions - shared across all pages
export const CartManager = {
  // Get cart from localStorage
  getCart() {
    const cart = localStorage.getItem('ginkgoCart');
    return cart ? JSON.parse(cart) : [];
  },

  // Save cart to localStorage
  saveCart(cart) {
    localStorage.setItem('ginkgoCart', JSON.stringify(cart));
    this.updateCartCount();
  },

  // Add item to cart
  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity: quantity
      });
    }

    this.saveCart(cart);
    this.showToast(`${product.name} added to cart!`);
    return cart;
  },

  // Remove item from cart
  removeFromCart(productId) {
    let cart = this.getCart();
    const item = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
    if (item) {
      this.showToast(`${item.name} removed from cart!`);
    }
    return cart;
  },

  // Update item quantity
  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      item.quantity = quantity;
      this.saveCart(cart);
    }
    return cart;
  },

  // Get cart total
  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  // Get cart count
  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Clear cart
  clearCart() {
    localStorage.removeItem('ginkgoCart');
    this.updateCartCount();
    this.showToast('Cart cleared!');
    return [];
  },

  // Update cart count in navbar
  updateCartCount() {
    const countElements = document.querySelectorAll('#cartCount');
    const count = this.getCartCount();
    countElements.forEach(el => {
      el.textContent = count;
    });
  },

  // Show toast notification
  showToast(message, duration = 2000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
  },

  // Generate order ID
  generateOrderId() {
    return 'GM' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
  }
};

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  CartManager.updateCartCount();
});
