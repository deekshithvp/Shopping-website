// cart.js (with quantity functionality)

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    const SHIPPING_COST = 50.00;

    // In cart.js

    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        cartItemsContainer.innerHTML = '<h2>Your Shopping Cart</h2>';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML += '<p>Your cart is empty.</p>';
            updateSummary(0);
            return;
        }

        let currentSubtotal = 0;

        cart.forEach((item, index) => {
            // --- SAFEGUARD ---
            // Ensure price and quantity are valid numbers. Default to 0 or 1 if not.
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity, 10) || 1;
            const lineTotal = price * quantity;

    

            const cartItemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h3>${item.title}</h3>
                        <p>${item.author}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-index="${index}" data-change="-1">-</button>
                        <input type="number" class="quantity-input" value="${quantity}" min="1" data-index="${index}">
                        <button class="quantity-btn" data-index="${index}" data-change="1">+</button>
                    </div>
                    <span class="cart-item-price">₹${lineTotal.toFixed(2)}</span>
                    <button class="remove-item-btn" data-index="${index}" title="Remove item">&times;</button>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
            currentSubtotal += lineTotal;
        });

        updateSummary(currentSubtotal);
        addCartEventListeners();
    }

    function updateSummary(subtotal) {
        const shipping = subtotal > 0 ? SHIPPING_COST : 0;
        const total = subtotal + shipping;
        subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
        shippingEl.textContent = `₹${shipping.toFixed(2)}`;
        totalEl.textContent = `₹${total.toFixed(2)}`;
    }

    function addCartEventListeners() {
        // Event listeners for remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', e => removeItemFromCart(e.target.dataset.index));
        });

        // Event listeners for quantity adjustment buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', e => {
                const index = e.target.dataset.index;
                const change = parseInt(e.target.dataset.change, 10);
                updateQuantity(index, change);
            });
        });

        // Event listeners for manually typing in the quantity input
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', e => {
                const index = e.target.dataset.index;
                const newQuantity = parseInt(e.target.value, 10);
                setQuantity(index, newQuantity);
            });
        });
    }

    function updateQuantity(index, change) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        if (cart[index]) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                // If quantity drops to 0 or below, remove the item
                cart.splice(index, 1);
            }
        }
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderCart();
    }

    function setQuantity(index, newQuantity) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        if (cart[index]) {
            if (newQuantity > 0) {
                cart[index].quantity = newQuantity;
            } else {
                // If user enters 0 or less, remove the item
                cart.splice(index, 1);
            }
        }
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderCart();
    }

    function removeItemFromCart(index) {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderCart();
    }

    renderCart();
});