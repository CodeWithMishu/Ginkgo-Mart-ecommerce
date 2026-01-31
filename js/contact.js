import { CartManager } from './cartManager.js';

// DOM Elements
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const modalClose = document.querySelector('.modal-close');

// Form submission handler
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form data
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());

  // Simulate API call
  simulateFormSubmission(data);
});

// Simulate form submission
function simulateFormSubmission(data) {
  // Show loading state
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  // Simulate network delay
  setTimeout(() => {
    // Store message in localStorage for demo
    const messages = JSON.parse(localStorage.getItem('ginkgoMessages') || '[]');
    messages.push({
      ...data,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('ginkgoMessages', JSON.stringify(messages));

    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Reset form
    contactForm.reset();

    // Show success modal
    showSuccessModal();

    console.log('Message saved:', data);
  }, 1500);
}

// Show success modal
function showSuccessModal() {
  successModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  successModal.classList.remove('show');
  document.body.style.overflow = '';
}

// Event listeners
modalClose.addEventListener('click', closeModal);

successModal.addEventListener('click', (e) => {
  if (e.target === successModal) {
    closeModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && successModal.classList.contains('show')) {
    closeModal();
  }
});

// Initialize cart count
document.addEventListener('DOMContentLoaded', () => {
  CartManager.updateCartCount();
});
