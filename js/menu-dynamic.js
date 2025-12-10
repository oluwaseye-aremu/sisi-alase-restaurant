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
        showError('Failed to load menu items. Please try again later.');
    }
}

// Display menu items
function displayMenuItems(items) {
    // Group items by category
    const categories = {
        starters: [],
        main: [],
        specials: [],
        desserts: [],
        drinks: []
    };

    items.forEach(item => {
        if (categories[item.category]) {
            categories[item.category].push(item);
        }
    });

    // Update each section
    updateSection('starters', categories.starters);
    updateSection('main', categories.main);
    updateSection('specials', categories.specials);
    updateSection('desserts', categories.desserts);
    updateSection('drinks', categories.drinks);
}

function updateSection(sectionId, items) {
    const container = document.getElementById(`${sectionId}-grid`);
    if (!container) return;

    container.innerHTML = items.map(item => `
        <div class="card food-item" data-item='${JSON.stringify(item)}'>
            <div class="card-img">
                <img src="${API_URL.replace('/api', '')}${item.image_url}" 
                     alt="${item.title}" 
                     onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'">
            </div>
            <div class="card-body">
                <h3>${item.title}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
                <p style="font-size: 0.9rem; color: #666; margin: 0.5rem 0;">${item.description.substring(0, 80)}...</p>
                <button class="btn btn-primary btn-sm mt-1" onclick="addToCart(${item.id})">
                    Add to Cart
                </button>
                <button class="btn btn-secondary btn-sm mt-1" onclick="viewDetails(${item.id})" style="margin-left: 0.5rem;">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(itemId) {
    const itemElement = document.querySelector(`[data-item*='"id":${itemId}']`);
    if (!itemElement) return;

    const item = JSON.parse(itemElement.dataset.item);

    // Check if item already in cart
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

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart UI
    updateCartCount();
    showNotification(`${item.title} added to cart!`);
}

// View details in modal
function viewDetails(itemId) {
    const itemElement = document.querySelector(`[data-item*='"id":${itemId}']`);
    if (!itemElement) return;

    const item = JSON.parse(itemElement.dataset.item);

    // Update modal
    const modal = document.getElementById('foodModal');
    document.getElementById('modalImg').src = `${API_URL.replace('/api', '')}${item.image_url}`;
    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalDesc').textContent = item.description;
    document.getElementById('modalPrice').textContent = `$${item.price.toFixed(2)}`;
    document.getElementById('modalIngredients').textContent = item.ingredients || 'Not specified';

    // Update order button
    const orderBtn = document.querySelector('.modal-details .btn-primary');
    orderBtn.onclick = () => {
        addToCart(item.id);
        hideModal();
    };

    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    document.body.style.overflow = 'hidden';
}

// Update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    let badge = document.getElementById('cart-count');
    if (!badge) {
        // Create cart icon if it doesn't exist
        const navLinks = document.querySelector('.nav-links');
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            <a href="cart.html" style="position: relative;">
                <i class="fas fa-shopping-cart"></i>
                <span id="cart-count" style="position: absolute; top: -8px; right: -8px; background: #c0392b; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem;">${totalItems}</span>
            </a>
        `;
        navLinks.appendChild(cartItem);
    } else {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Show notification
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

// Show error
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

// Hide modal
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

// Filter by category
function filterByCategory(category) {
    loadMenuItems(category);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Create section grids if they don't exist
    createSectionGrids();

    // Load menu items
    loadMenuItems();

    // Update cart count
    updateCartCount();

    // Add category filters
    addCategoryFilters();
});

function createSectionGrids() {
    const sections = ['starters', 'main', 'specials', 'desserts', 'drinks'];
    sections.forEach(section => {
        const container = document.querySelector(`.${section} .grid-3, .${section} .menu-grid`);
        if (container) {
            container.id = `${section}-grid`;
        }
    });
}

function addCategoryFilters() {
    // Add filter buttons to menu page
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

// Add CSS animations
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