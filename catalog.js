document.addEventListener('DOMContentLoaded', () => {
    
    const categoryLinks = document.querySelectorAll('.sidebar a');
    const bookCards = document.querySelectorAll('.book-card');
    const addToCartButtons = document.querySelectorAll('.book-card-button');

    // --- FUNCTION TO UPDATE ALL BUTTONS ON PAGE LOAD ---
    const updateButtonStates = () => {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        // Create a set of IDs from the cart for quick lookups
        const cartIds = new Set(cart.map(item => item.id));

        bookCards.forEach(card => {
            const productId = card.querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');
            const button = card.querySelector('.book-card-button');

            if (cartIds.has(productId)) {
                button.textContent = 'Added';
                button.classList.add('added');
                button.disabled = true; // Disable the button so it can't be clicked again
            } else {
                button.textContent = 'Add';
                button.classList.remove('added');
                button.disabled = false;
            }
        });
    };

    // --- FILTERING LOGIC 
    const filterAndStyleBooks = (selectedCategory) => {
        categoryLinks.forEach(link => {
            if (link.dataset.category === selectedCategory) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        bookCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (selectedCategory === 'all' || selectedCategory === cardCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };
    categoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            filterAndStyleBooks(link.dataset.category);
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    filterAndStyleBooks(categoryFromUrl || 'all');
    

    // --- ADD TO CART LOGIC (Updated) ---
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const clickedButton = event.target;
            const card = clickedButton.closest('.book-card');

            const priceText = card.querySelector('.book-card-price').textContent;
            const priceNumber = parseFloat(priceText.replace('₹', ''));

            const productInfo = {
                id: card.querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-'),
                title: card.querySelector('h3').textContent,
                author: card.querySelector('p').textContent,
                image: card.querySelector('img').src,
                price: priceNumber
            };

            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const existingItem = cart.find(item => item.id === productInfo.id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                productInfo.quantity = 1;
                cart.push(productInfo);
            }

            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            
            // Instantly update the clicked button's state
            clickedButton.textContent = 'Added';
            clickedButton.classList.add('added');
            clickedButton.disabled = true;
        });
    });

    // --- INITIALIZE BUTTON STATES ON PAGE LOAD ---
    // This runs once after everything else is set up.
    updateButtonStates();
});