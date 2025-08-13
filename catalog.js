
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.book-card-button');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Find the parent .book-card element
            const card = event.target.closest('.book-card');

            // Extract book information from the card's elements
            const title = card.querySelector('h3').textContent;
            const author = card.querySelector('p').textContent;
            const image = card.querySelector('img').src;
            
            // Extract price, remove the '₹' symbol, and convert to a number
            const priceString = card.querySelector('.book-card-price').textContent;
            const price = parseFloat(priceString.replace('₹', ''));
            
            // Create a unique ID from the title for easier management
            const id = title.toLowerCase().replace(/\s+/g, '-');

            const product = {
                id: id,
                title: title,
                author: author,
                price: price,
                image: image
            };

            // Get existing cart from localStorage or initialize an empty array
            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

            // Check if the item is already in the cart
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                alert('This item is already in your cart!');
            } else {
                // Add the new product to the cart array
                cart.push(product);
                // Save the updated cart back to localStorage
                localStorage.setItem('shoppingCart', JSON.stringify(cart));
                // Notify the user
                alert(`'${product.title}' has been added to your cart!`);
            }
        });
    });
});