document.addEventListener('DOMContentLoaded', () => {
    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, slideInterval);
    }

    // Mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animate hamburger
            const hamburger = document.querySelector('.hamburger');
            // Add animation class if needed, or just rely on CSS transitions
        });
    }

    // Scroll Effect for Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.backgroundColor = 'rgba(26, 26, 26, 1)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
        }
    });

    // Modal Functionality
    const modal = document.getElementById('foodModal');
    const closeModal = document.querySelector('.close-modal');
    const foodItems = document.querySelectorAll('.food-item');

    // Elements to update in modal
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const modalIngredients = document.getElementById('modalIngredients');
    const modalOrderBtn = document.querySelector('.modal-details .btn-primary');

    if (foodItems) {
        foodItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Prevent triggering the card's button if clicked
                if (e.target.tagName === 'A' || e.target.closest('a')) return;

                const img = item.dataset.img;
                const title = item.dataset.title;
                const desc = item.dataset.desc;
                const price = item.dataset.price;
                const ingredients = item.dataset.ingredients;

                if (modalImg) modalImg.src = img;
                if (modalTitle) modalTitle.textContent = title;
                if (modalDesc) modalDesc.textContent = desc;
                if (modalPrice) modalPrice.textContent = price;
                if (modalIngredients) modalIngredients.textContent = ingredients;

                // Update Order Button
                if (modalOrderBtn) {
                    const message = encodeURIComponent(`I would like to order ${title}`);
                    modalOrderBtn.onclick = () => window.open(`https://wa.me/15551234567?text=${message}`, '_blank');
                }

                if (modal) {
                    modal.style.display = 'flex';
                    // Small timeout to allow display:flex to apply before adding opacity class for transition
                    setTimeout(() => {
                        modal.classList.add('show');
                    }, 10);
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });
    }

    function hideModal() {
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Wait for transition
            document.body.style.overflow = 'auto';
        }
    }

    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
});
