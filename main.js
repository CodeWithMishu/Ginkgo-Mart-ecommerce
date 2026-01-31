import "./style.css";

import products from "./api/products.json";
import { showProdcutsContainer } from "./homeProductsCards";
import { CartManager } from "./js/cartManager.js";

// Initialize cart count on page load
CartManager.updateCartCount();

// function to call the products as card
showProdcutsContainer(products, CartManager);