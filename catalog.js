document.addEventListener('DOMContentLoaded', () => {
    const booksGrid = document.getElementById('books-grid');
    const categoryLinks = document.querySelectorAll('.sidebar a');

    // --- FETCH AND RENDER BOOKS FROM XML ---
    fetch("books.xml")
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const books = data.querySelectorAll("book");
            books.forEach(book => {
                console.log(book.innerHTML);
                
            })
            

            books.forEach(book => {
                const title = book.querySelector("Title").textContent;
                const author = book.querySelector("Author").textContent;
                const price = book.querySelector("Price").textContent;
                const category = book.getAttribute("category").toLowerCase().replace(/\s+/g, '-');
                const image = book.querySelector("Image")?.textContent || "https://via.placeholder.com/150";
                const productId = title.toLowerCase().replace(/\s+/g, '-');

                const card = document.createElement("div");
                card.className = `book-card`;
                card.setAttribute('data-category', category);

                card.innerHTML = `
                    <img src="${image}" alt="Book Cover: ${title}">
                    <div class="book-card-content">
                        <h3>${title}</h3>
                        <p>${author}</p>
                        <div class="book-card-footer">
                            <span class="book-card-price">${price}</span>
                            <button class="book-card-button" data-id="${productId}">Add</button>
                        </div>
                    </div>
                `;

                booksGrid.appendChild(card);
            });

            // After DOM is updated with books, initialize features
            initializeCategoryFilter();
            initializeAddToCart();
            updateButtonStates();
        })
        .catch(error => console.error("Failed to load XML:", error));


    // --- FILTERING ---
    const initializeCategoryFilter = () => {
        const filterAndStyleBooks = (selectedCategory) => {
            categoryLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.category === selectedCategory);
            });

            document.querySelectorAll('.book-card').forEach(card => {
                const cardCategory = card.dataset.category;
                card.style.display = (selectedCategory === 'all' || selectedCategory === cardCategory) ? 'block' : 'none';
            });
        };

        categoryLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const selectedCategory = link.dataset.category;
                filterAndStyleBooks(selectedCategory);
            });
        });

        // Initial filter from URL (if any)
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('category');
        filterAndStyleBooks(categoryFromUrl || 'all');
    };


    // --- ADD TO CART ---
    const initializeAddToCart = () => {
        document.querySelectorAll('.book-card-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const clickedButton = event.target;
                const card = clickedButton.closest('.book-card');

                const title = card.querySelector('h3').textContent;
                const author = card.querySelector('p').textContent;
                const priceText = card.querySelector('.book-card-price').textContent;
                const priceNumber = parseFloat(priceText.replace('₹', ''));
                const image = card.querySelector('img').src;
                const id = title.toLowerCase().replace(/\s+/g, '-');

                const productInfo = {
                    id,
                    title,
                    author,
                    image,
                    price: priceNumber,
                    quantity: 1
                };

                let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
                const existingItem = cart.find(item => item.id === id);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push(productInfo);
                }

                localStorage.setItem('shoppingCart', JSON.stringify(cart));

                // Update button state
                clickedButton.textContent = 'Added';
                clickedButton.classList.add('added');
                clickedButton.disabled = true;
            });
        });
    };

    // --- UPDATE BUTTON STATES BASED ON CART ---
    const updateButtonStates = () => {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const cartIds = new Set(cart.map(item => item.id));

        document.querySelectorAll('.book-card').forEach(card => {
            const title = card.querySelector('h3').textContent;
            const id = title.toLowerCase().replace(/\s+/g, '-');
            const button = card.querySelector('.book-card-button');

            if (cartIds.has(id)) {
                button.textContent = 'Added';
                button.classList.add('added');
                button.disabled = true;
            } else {
                button.textContent = 'Add';
                button.classList.remove('added');
                button.disabled = false;
            }
        });
    };
});
