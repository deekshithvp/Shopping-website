
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    // Set a constant for shipping cost
    const SHIPPING_COST = 50.00;

    function renderCart() {
        // 1. Get cart from localStorage
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

        // Clear existing cart content to prevent duplicates
        cartItemsContainer.innerHTML = '<h2>Your Shopping Cart</h2>'; 

        if (cart.length === 0) {
            cartItemsContainer.innerHTML += '<p>Your cart is empty.</p>';
            updateSummary(0);
            return;
        }

        let currentSubtotal = 0;

        // 2. Loop through cart items and create HTML for each
        cart.forEach((item, index) => {
            const cartItemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h3>${item.title}</h3>
                        <p>${item.author}</p>
                    </div>
                    <span class="cart-item-price">₹${item.price.toFixed(2)}</span>
                    <button class="remove-item-btn" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
            currentSubtotal += item.price;
        });

        // 3. Update the summary totals
        updateSummary(currentSubtotal);
        
        // 4. Add event listeners to the new "Remove" buttons
        addRemoveEventListeners();
    }

    function updateSummary(subtotal) {
        // Only apply shipping if there are items in the cart
        const shipping = subtotal > 0 ? SHIPPING_COST : 0;
        const total = subtotal + shipping;

        subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
        shippingEl.textContent = `₹${shipping.toFixed(2)}`;
        totalEl.textContent = `₹${total.toFixed(2)}`;
    }

    function addRemoveEventListeners() {
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const indexToRemove = parseInt(event.target.dataset.index, 10);
                removeItemFromCart(indexToRemove);
            });
        });
    }

    function removeItemFromCart(index) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        // Remove 1 item at the specified index
        cart.splice(index, 1);
        // Save the updated cart back to localStorage
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        // Re-render the cart to show the changes
        renderCart();
    }

    // This is the first function that runs when the page loads
    renderCart();
});