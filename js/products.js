import { CartManager } from './cartManager.js';
import products from '../api/products.json';

// DOM Elements
const productContainer = document.getElementById('allProductsContainer');
const productTemplate = document.getElementById('productTemplate');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const priceFilter = document.getElementById('priceFilter');

let allProducts = [...products];
let filteredProducts = [...products];

// Render products
function renderProducts(productsToRender) {
  productContainer.innerHTML = '';

  if (productsToRender.length === 0) {
    productContainer.innerHTML = `
      <div class="no-products">
        <i class="fa-solid fa-search"></i>
        <h3>No products found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    `;
    return;
  }

  productsToRender.forEach(product => {
    const { id, name, price, brand, stock, description, image } = product;
    const productClone = document.importNode(productTemplate.content, true);

    productClone.querySelector('.productName').textContent = name;
    productClone.querySelector('.productImage').src = image;
    productClone.querySelector('.productImage').alt = name;
    productClone.querySelector('.productStock').textContent = stock;
    productClone.querySelector('.productDescription').textContent = description;
    productClone.querySelector('.productPrice').textContent = `₹${price}`;
    productClone.querySelector('.productActualPrice').textContent = `₹${(price * 4).toFixed(2)}`;
    
    const addToCartBtn = productClone.querySelector('.add-to-cart-button');
    addToCartBtn.dataset.id = id;

    // Quantity management
    const quantityEl = productClone.querySelector('.productQuantity');
    const incrementBtn = productClone.querySelector('.cartIncrement');
    const decrementBtn = productClone.querySelector('.cartDecrement');
    let quantity = 1;

    incrementBtn.addEventListener('click', () => {
      if (quantity < stock) {
        quantity++;
        quantityEl.textContent = quantity;
      }
    });

    decrementBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        quantityEl.textContent = quantity;
      }
    });

    // Add to cart
    addToCartBtn.addEventListener('click', () => {
      CartManager.addToCart(product, quantity);
      quantity = 1;
      quantityEl.textContent = 1;
    });

    productContainer.appendChild(productClone);
  });
}

// Search products
function searchProducts(query) {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm)
    );
  }
  
  applyFiltersAndSort();
}

// Sort products
function sortProducts(products, sortType) {
  const sorted = [...products];
  
  switch (sortType) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // Keep original order
      break;
  }
  
  return sorted;
}

// Filter by price
function filterByPrice(products, priceRange) {
  if (priceRange === 'all') return products;
  
  const [min, max] = priceRange.split('-').map(Number);
  
  return products.filter(product => {
    if (max) {
      return product.price >= min && product.price <= max;
    }
    return product.price >= min;
  });
}

// Apply all filters and sort
function applyFiltersAndSort() {
  let result = [...filteredProducts];
  
  // Apply price filter
  result = filterByPrice(result, priceFilter.value);
  
  // Apply sort
  result = sortProducts(result, sortSelect.value);
  
  renderProducts(result);
}

// Event listeners
searchInput.addEventListener('input', (e) => {
  searchProducts(e.target.value);
});

sortSelect.addEventListener('change', () => {
  applyFiltersAndSort();
});

priceFilter.addEventListener('change', () => {
  applyFiltersAndSort();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(allProducts);
  CartManager.updateCartCount();
});
