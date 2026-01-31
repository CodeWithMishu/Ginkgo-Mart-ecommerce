const productContainer = document.querySelector("#productContainer");
const productTemplate = document.querySelector("#productTemplate");


export const showProdcutsContainer = (products, CartManager) => {
if (!products) {
    return false;
}

products.forEach((curProd) => {
    const {id,name,price,brand,stock,description,image } = curProd;

    const productclone = document.importNode(productTemplate.content,true);

    productclone.querySelector(".productName").textContent = name;
    productclone.querySelector(".productImage").src = image;
    productclone.querySelector(".productImage").alt = name;
    productclone.querySelector(".productStock").textContent = stock;
    productclone.querySelector(".productDescription").textContent = description;
    productclone.querySelector(".productPrice").textContent = `₹${price}`;
    productclone.querySelector(".productActualPrice").textContent = `₹${price*4}`;
    
    // Quantity management
    const quantityEl = productclone.querySelector(".productQuantity");
    const incrementBtn = productclone.querySelector(".cartIncrement");
    const decrementBtn = productclone.querySelector(".cartDecrement");
    let quantity = 1;

    incrementBtn.addEventListener("click", () => {
      if (quantity < stock) {
        quantity++;
        quantityEl.textContent = quantity;
      }
    });

    decrementBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityEl.textContent = quantity;
      }
    });

    // Add to cart button
    const addToCartBtn = productclone.querySelector(".add-to-cart-button");
    addToCartBtn.addEventListener("click", () => {
      CartManager.addToCart(curProd, quantity);
      quantity = 1;
      quantityEl.textContent = 1;
    });

    productContainer.append(productclone);


});
};