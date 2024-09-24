let cart = [];
const SHIPPING_CHARGE = 20; 
const DELIVERY_CHARGE = 30; 
let products = []; // Store fetched products for searching

// Fetch Products from Fake Store API
async function fetchProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    products = await response.json(); // Store products globally
    displayProducts(products); // Display all products initially
}

// Display Products
function displayProducts(productsToDisplay) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Rating: ⭐ ${product.rating.rate}</p>
            <p>₹${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productElement);
    });
}

// Search Products
function searchProducts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

// Add Event Listener for Search Bar
document.getElementById('search-bar').addEventListener('input', searchProducts);

// Add Item to Cart
function addToCart(productId) {
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        const product = products.find(item => item.id === productId);
        cart.push({ ...product, quantity: 1 });
    }
    displayCart();
}

// Display Cart
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>₹${item.price} x ${item.quantity}</p>
                <div>
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <span class="delete-item" onclick="removeFromCart(${item.id})">&times;</span>
        `;
        cartContainer.appendChild(cartItem);
    });

    calculateTotal();
}

// Update Quantity
function updateQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            displayCart();
        }
    }
}

// Remove Item from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    displayCart();
}

// Calculate Total Price
function calculateTotal() {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const grandTotal = total + SHIPPING_CHARGE + DELIVERY_CHARGE;

    document.getElementById('total-price').innerText = total.toFixed(2);
    document.getElementById('grand-total-amount').innerText = grandTotal.toFixed(2);
}

// Place Order (Placeholder function)
document.getElementById('place-order').addEventListener('click', () => {
    alert("Order placed successfully!");
});

// Initialize the application
fetchProducts();
