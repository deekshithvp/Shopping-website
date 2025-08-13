
document.addEventListener('DOMContentLoaded', () => {
    
    const categoryLinks = document.querySelectorAll('.sidebar a');
    const bookCards = document.querySelectorAll('.book-card');
    const addToCartButtons = document.querySelectorAll('.book-card-button');

    // --- A. DEDICATED FUNCTION TO FILTER AND STYLE ---
    // This function is now the single source of truth for filtering.
    const filterAndStyleBooks = (selectedCategory) => {
        // 1. Update the 'active' class on the sidebar links
        categoryLinks.forEach(link => {
            if (link.dataset.category === selectedCategory) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // 2. Show or hide book cards based on the selected category
        bookCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                card.style.display = 'block'; // Or 'flex', 'grid' etc.
            } else {
                card.style.display = 'none';
            }
        });
    };

    // --- B. SETUP EVENT LISTENERS FOR CATEGORY CLICKS ---
    categoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const categoryToFilter = link.dataset.category;
            filterAndStyleBooks(categoryToFilter);
        });
    });

    // C. CHECK URL ON PAGE LOAD 
    // This part now directly calls our function instead of simulating a click.
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    if (categoryFromUrl) {
        // If a category exists in the URL, filter by it.
        filterAndStyleBooks(categoryFromUrl);
    } else {
        // Otherwise, default to showing "All Categories".
        filterAndStyleBooks('all');
    }

    // D. ADD TO CART LOGIC 
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.book-card');
            const title = card.querySelector('h3').textContent;
            const author = card.querySelector('p').textContent;
            const image = card.querySelector('img').src;
            const priceString = card.querySelector('.book-card-price').textContent;
            const price = parseFloat(priceString.replace('₹', ''));
            const id = title.toLowerCase().replace(/\s+/g, '-');

            const product = { id, title, author, price, image };
            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                alert('This item is already in your cart!');
            } else {
                cart.push(product);
                localStorage.setItem('shoppingCart', JSON.stringify(cart));
                alert(`'${product.title}' has been added to your cart!`);
            }
        });
    });
});
