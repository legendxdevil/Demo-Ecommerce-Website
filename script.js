// Supabase Configuration
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const loader = document.querySelector('.loader');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.getElementById('close-cart');
const productsContainer = document.getElementById('products-container');

// Cart functionality
let cart = [];

// Add to cart function
function addToCart(productCard) {
    const product = {
        name: productCard.querySelector('h3').textContent,
        price: productCard.querySelector('.price').textContent,
        image: productCard.querySelector('img').src
    };
    
    cart.push(product);
    updateCartDisplay();
    cartSidebar.classList.add('active');
    saveCartToLocalStorage();
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;

    cartItems.innerHTML = cart.map((item, index) => {
        const price = parseFloat(item.price.replace('$', ''));
        total += price;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    cartTotal.textContent = total.toFixed(2);
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    saveCartToLocalStorage();
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage
    loadCartFromLocalStorage();

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card') || this.closest('.featured-card');
            addToCart(productCard);
        });
    });

    // Cart toggle
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
});

// Fetch products from Supabase
async function fetchProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) throw error;

        displayProducts(data);
    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
}

// Display products in the grid
function displayProducts(products) {
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image_url}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">₹${product.price}</p>
            <button onclick="addToCart(${product.id})" class="add-to-cart">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add magical sparkle effect on hover for golden elements
function createSparkle(e) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

document.querySelectorAll('.cta-button, .magic-text').forEach(element => {
    element.addEventListener('mousemove', createSparkle);
});

// Contact Form Handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});


// Update the smooth scroll functionality
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Search functionality - Update these event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.querySelector('.fa-search');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeSearch = document.getElementById('close-search');

    // Open search
    searchIcon.addEventListener('click', () => {
        searchContainer.style.display = 'flex';
        searchInput.focus();
        console.log('Search opened'); // Debug log
    });

    // Close search
    closeSearch.addEventListener('click', () => {
        searchContainer.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
        console.log('Search closed'); // Debug log
    });

    // Search input handler
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const allProducts = document.querySelectorAll('.product-card, .featured-card');
        searchResults.innerHTML = '';

        if (searchTerm.length > 0) {
            allProducts.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <h3>${product.querySelector('h3').textContent}</h3>
                        <p>${product.querySelector('.price').textContent}</p>
                    `;
                    
                    resultItem.addEventListener('click', () => {
                        product.scrollIntoView({ behavior: 'smooth' });
                        searchContainer.style.display = 'none';
                        searchInput.value = '';
                        searchResults.innerHTML = '';
                    });

                    searchResults.appendChild(resultItem);
                }
            });
        }
    });
});
