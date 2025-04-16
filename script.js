// Food items data
const foodItems = [
    // Array of objects representing each menu item
    { id: 1, name: "Paneer Butter Masala", price: 10.99, image: "veg1.jpg" },
    { id: 2, name: "Vegetable Biryani", price: 8.99, image: "veg2.jpg" },
    { id: 3, name: "Dal Tadka", price: 6.99, image: "veg3.jpeg" },
    { id: 4, name: "Chicken Curry", price: 12.99, image: "non1.jpg" },
    { id: 5, name: "Mutton Rogan Josh", price: 14.99, image: "non2.jpeg" },
    { id: 6, name: "Fish Fry", price: 13.99, image: "non3.jpeg" },
    { id: 7, name: "Chocolate Lava Cake", price: 5.99, image: "cake.jpg" }
];

// Render menu items dynamically on the page
function renderMenu() {
    const container = document.getElementById("menu-list");
    if (!container) return; // Safety check

    container.innerHTML = ""; // Clear any existing items

    // Loop through each food item and create a card
    foodItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "card dish col-md-3 m-2"; // Bootstrap styling
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="card-img-top">
            <div class="card-body">
                <h3 class="card-title">${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
                <button onclick="addToCart(${item.id})" class="btn btn-primary">Add to Cart</button>
            </div>
        `;
        container.appendChild(card); // Add card to container
    });
}

// Add selected item to cart
function addToCart(id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || []; // Get existing cart or start new
    const item = foodItems.find(f => f.id === id); // Find the item by ID

    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => cartItem.id === id);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1; // Increase quantity
    } else {
        cart.push({ ...item, quantity: 1 }); // Add new item with quantity 1
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
    updateCartCount(); // Refresh cart item count
    alert(`${item.name} added to cart!`);
}

// Render all items currently in the cart
function renderCart() {
    const container = document.getElementById("cart-items");
    const totalContainer = document.getElementById("total-price");
    if (!container) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;
    container.innerHTML = ""; // Clear existing cart view

    // If cart is empty, show message and total $0
    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty</p>";
        totalContainer.innerText = "Total: $0.00";
        return;
    }

    // Loop through each cart item and render it
    cart.forEach((item, index) => {
        const subtotal = (item.price * (item.quantity || 1)).toFixed(2);
        const div = document.createElement("div");
        div.className = "cart-item d-flex justify-content-between align-items-center mb-3 p-2 border-bottom";

        div.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity || 1}</p>
                </div>
            </div>
            <div class="text-end">
                <p class="mb-1">$${subtotal}</p>
                <button onclick="removeFromCart(${index})" class="btn btn-sm btn-danger">Remove</button>
            </div>
        `;
        total += item.price * (item.quantity || 1); // Accumulate total
        container.appendChild(div); // Add cart item to view
    });

    totalContainer.innerText = `Total: $${total.toFixed(2)}`; // Show total price
}

// Remove an item from the cart by its index
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1); // Remove one item at given index
    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
    renderCart(); // Re-render the cart
    updateCartCount(); // Update item count badge
}

// Checkout and clear cart
function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Calculate total price
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2);
    if (confirm(`Confirm order for $${total}?`)) {
        localStorage.removeItem("cart"); // Clear cart
        alert("Order placed successfully! 🍽️");
        updateCartCount(); // Reset item count
        renderCart(); // Clear cart display
    }
}

// Update the cart count indicator (e.g., in navbar)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Update all elements with id="cart-count" (in case there are multiple)
    document.querySelectorAll("#cart-count").forEach(el => {
        el.textContent = count;
    });
}

// Run when the page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();       // Load menu items
    renderCart();       // Show current cart
    updateCartCount();  // Update cart badge
});
