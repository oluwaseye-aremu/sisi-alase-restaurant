// Menu Dynamic Script with Cart Functionality
const API_URL = 'http://localhost:8080/api';

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Load menu items from database
async function loadMenuItems(category = '') {
    try {
        const url = category ? `${API_URL}/menu?category=${category}` : `${API_URL}/menu`;
        const response = await fetch(url);
        const items = await response.json();

        displayMenuItems(items);
    } catch (error) {
        console.error('Error loading menu:', error);
        showError('Failed to load menu items. Is the backend running?');
    }
}

// Display menu items
// Display menu items
function displayMenuItems(items) {
    // 1. Create the buckets for your data
    const categories = {
        starters: [],
        main: [],
        specials: [],
        desserts: [],
        drinks: [],
        wine: [],    // Added
        kids: [],    // Added
        dietary: []  // Added
    };

    // 2. Sort the items into buckets
    items.forEach(item => {
        // If the category exists in our list, add the item to it
        if (categories[item.category]) {
            categories[item.category].push(item);
        }
    });

    // 3. Update the HTML sections
    updateSection('starters', categories.starters);
    updateSection('main', categories.main);
    updateSection('specials', categories.specials);
    updateSection('desserts', categories.desserts);
    updateSection('drinks', categories.drinks);

    // Add these new lines:
    updateSection('wine', categories.wine);
    updateSection('kids', categories.kids);
    updateSection('dietary', categories.dietary);
}

// Add to cart
function addToCart(itemId) {
    // Helper: find item in DOM data attribute
    // We search across all grids to find the item data
    const itemElement = document.querySelector(`[data-item*='"id":${itemId}']`);
    if (!itemElement) return;

    const item = JSON.parse(itemElement.dataset.item);

    const existingItem = cart.find(i => i.id === item.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: item.id,
            title: item.title,
            price: item.price,
            image_url: item.image_url,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${item.title} added to cart!`);
}

// View details in modal
function viewDetails(itemId) {
    const itemElement = document.querySelector(`[data-item*='"id":${itemId}']`);
    if (!itemElement) return;

    const item = JSON.parse(itemElement.dataset.item);

    const modal = document.getElementById('foodModal');
    // Basic null checks
    if (document.getElementById('modalImg')) document.getElementById('modalImg').src = `${API_URL.replace('/api', '')}${item.image_url}`;
    if (document.getElementById('modalTitle')) document.getElementById('modalTitle').textContent = item.title;
    if (document.getElementById('modalDesc')) document.getElementById('modalDesc').textContent = item.description;
    if (document.getElementById('modalPrice')) document.getElementById('modalPrice').textContent = `$${item.price.toFixed(2)}`;
    if (document.getElementById('modalIngredients')) document.getElementById('modalIngredients').textContent = item.ingredients || 'Not specified';

    // Update order button inside modal to perform Add to Cart
    const orderBtn = document.querySelector('.modal-details .btn-primary');
    if (orderBtn) {
        orderBtn.onclick = () => {
            addToCart(item.id);
            // We can assume hideModal is globally available or defined below
            if (typeof hideModal === 'function') hideModal();
        };
    }

    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
    }
}

// Global hideModal (matches script.js logic)
function hideModal() {
    const modal = document.getElementById('foodModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    let badge = document.getElementById('cart-count');

    // Auto-create badge if missing
    if (!badge) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const cartItem = document.createElement('li');
            cartItem.innerHTML = `
                <a href="cart.html" style="position: relative;">
                    <i class="fas fa-shopping-cart"></i>
                    <span id="cart-count" style="position: absolute; top: -8px; right: -8px; background: #c0392b; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;">${totalItems}</span>
                </a>
            `;
            navLinks.appendChild(cartItem);
            badge = document.getElementById('cart-count');
        }
    }

    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #d4af37;
        color: #1a1a1a;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function showError(message) {
    const error = document.createElement('div');
    error.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #c0392b;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
    `;
    error.textContent = message;
    document.body.appendChild(error);
    setTimeout(() => error.remove(), 3000);
}

// Filter logic
function filterByCategory(category) {
    loadMenuItems(category);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    // If we are on the menu page, initialize these:
    if (document.getElementById('starters-grid') || document.querySelector('.grid-3')) {
        createSectionGrids();
        loadMenuItems();
        addCategoryFilters();
    }
    updateCartCount();
});

function createSectionGrids() {
    const sections = ['starters', 'main', 'specials', 'desserts', 'drinks'];
    sections.forEach(section => {
        // We look for sections that might not have the ID yet
        // This selector is a bit generic, be careful if you have other grid-3 elements
        // The safest way is to ensure IDs exist in HTML (which I did in the HTML update above)
        const container = document.querySelector(`.${section} .grid-3`);
        if (container && !container.id) {
            container.id = `${section}-grid`;
        }
    });
}

function addCategoryFilters() {
    const menuHeader = document.querySelector('.page-header');
    if (menuHeader && !document.getElementById('category-filters')) {
        const filterDiv = document.createElement('div');
        filterDiv.id = 'category-filters';
        filterDiv.style.cssText = 'margin-top: 1rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;';
        filterDiv.innerHTML = `
            <button class="btn btn-sm btn-primary" onclick="filterByCategory('')">All</button>
            <button class="btn btn-sm btn-outline" onclick="filterByCategory('starters')">Starters</button>
            <button class="btn btn-sm btn-outline" onclick="filterByCategory('main')">Main</button>
            <button class="btn btn-sm btn-outline" onclick="filterByCategory('specials')">Specials</button>
            <button class="btn btn-sm btn-outline" onclick="filterByCategory('desserts')">Desserts</button>
            <button class="btn btn-sm btn-outline" onclick="filterByCategory('drinks')">Drinks</button>
        `;
        menuHeader.appendChild(filterDiv);
    }
}

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);