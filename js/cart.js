import { CartManager } from './cartManager.js';

// DOM Elements
const cartContainer = document.getElementById('productCartContainer');
const emptyCart = document.getElementById('emptyCart');
const cartContent = document.getElementById('cartContainer');
const cartSummary = document.getElementById('cartSummary');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const orderSuccessModal = document.getElementById('orderSuccessModal');
const checkoutForm = document.getElementById('checkoutForm');
const cartItemTemplate = document.getElementById('cartItemTemplate');

// Render cart items
function renderCart() {
  const cart = CartManager.getCart();
  
  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartContent.style.display = 'none';
    cartSummary.style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  cartContent.style.display = 'block';
  cartSummary.style.display = 'block';

  cartContainer.innerHTML = '';

  cart.forEach(item => {
    const { id, name, price, description, image, quantity } = item;
    const itemClone = document.importNode(cartItemTemplate.content, true);

    itemClone.querySelector('.productName').textContent = name;
    itemClone.querySelector('.productImage').src = image;
    itemClone.querySelector('.productImage').alt = name;
    itemClone.querySelector('.productDescription').textContent = description.substring(0, 50) + '...';
    itemClone.querySelector('.productPrice').textContent = `₹${price}`;
    itemClone.querySelector('.productActualPrice').textContent = `₹${(price * 4).toFixed(2)}`;
    itemClone.querySelector('.productQuantity').textContent = quantity;
    itemClone.querySelector('.itemTotal').textContent = `₹${(price * quantity).toFixed(2)}`;

    // Quantity management
    const quantityEl = itemClone.querySelector('.productQuantity');
    const incrementBtn = itemClone.querySelector('.cartIncrement');
    const decrementBtn = itemClone.querySelector('.cartDecrement');
    const itemTotalEl = itemClone.querySelector('.itemTotal');

    incrementBtn.addEventListener('click', () => {
      const newQty = parseInt(quantityEl.textContent) + 1;
      CartManager.updateQuantity(id, newQty);
      quantityEl.textContent = newQty;
      itemTotalEl.textContent = `₹${(price * newQty).toFixed(2)}`;
      updateOrderSummary();
    });

    decrementBtn.addEventListener('click', () => {
      const currentQty = parseInt(quantityEl.textContent);
      if (currentQty > 1) {
        const newQty = currentQty - 1;
        CartManager.updateQuantity(id, newQty);
        quantityEl.textContent = newQty;
        itemTotalEl.textContent = `₹${(price * newQty).toFixed(2)}`;
        updateOrderSummary();
      } else {
        CartManager.removeFromCart(id);
        renderCart();
      }
    });

    // Remove item
    const removeBtn = itemClone.querySelector('.remove-to-cart-button');
    removeBtn.addEventListener('click', () => {
      CartManager.removeFromCart(id);
      renderCart();
    });

    cartContainer.appendChild(itemClone);
  });

  updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
  const subtotal = CartManager.getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  document.querySelector('.productSubTotal').textContent = `₹${subtotal.toFixed(2)}`;
  document.querySelector('.productShipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`;
  document.querySelector('.productTax').textContent = `₹${tax.toFixed(2)}`;
  document.querySelector('.productFinalTotal').innerHTML = `<strong>₹${total.toFixed(2)}</strong>`;
  
  // Update checkout modal total
  const checkoutTotal = document.getElementById('checkoutTotal');
  if (checkoutTotal) {
    checkoutTotal.textContent = `₹${total.toFixed(2)}`;
  }
}

// Clear cart
clearCartBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    CartManager.clearCart();
    renderCart();
  }
});

// Open checkout modal
checkoutBtn.addEventListener('click', () => {
  checkoutModal.classList.add('show');
  document.body.style.overflow = 'hidden';
  updateOrderSummary();
});

// Close modals
function closeModal(modal) {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(btn.closest('.modal'));
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

// Checkout form submission
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(checkoutForm);
  const orderData = Object.fromEntries(formData.entries());
  
  // Show loading state
  const submitBtn = checkoutForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
  submitBtn.disabled = true;

  // Simulate order processing
  setTimeout(() => {
    // Generate order ID
    const orderId = CartManager.generateOrderId();
    
    // Save order to localStorage for demo
    const orders = JSON.parse(localStorage.getItem('ginkgoOrders') || '[]');
    orders.push({
      orderId,
      ...orderData,
      items: CartManager.getCart(),
      total: CartManager.getCartTotal(),
      timestamp: new Date().toISOString(),
      status: 'confirmed'
    });
    localStorage.setItem('ginkgoOrders', JSON.stringify(orders));

    // Clear cart
    CartManager.clearCart();

    // Close checkout modal
    closeModal(checkoutModal);

    // Show success modal
    document.getElementById('orderId').textContent = orderId;
    orderSuccessModal.classList.add('show');

    // Reset form
    checkoutForm.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Render empty cart
    renderCart();
  }, 2000);
});

// Close success modal and redirect
document.querySelector('#orderSuccessModal .modal-close').addEventListener('click', () => {
  closeModal(orderSuccessModal);
});

// Escape key to close modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.show').forEach(modal => {
      closeModal(modal);
    });
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  CartManager.updateCartCount();
});
