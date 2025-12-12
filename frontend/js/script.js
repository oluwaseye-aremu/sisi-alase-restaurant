document.addEventListener('DOMContentLoaded', () => {
    // Hero Slider - FIXED VERSION
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function nextSlide() {
        if (!slides.length) return; // Guard clause

        console.log('Changing slide from', currentSlide, 'to', (currentSlide + 1) % slides.length); // Debug log

        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        console.log('Found', slides.length, 'slides. Starting slider...'); // Debug log
        setInterval(nextSlide, slideInterval);
    } else {
        console.error('No slides found!'); // Debug log
    }

    // Mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Scroll Effect for Navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.padding = '0.5rem 0';
                navbar.style.backgroundColor = 'rgba(26, 26, 26, 1)';
            } else {
                navbar.style.padding = '1rem 0';
                navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
            }
        });
    }

    // --- SHARED MODAL CLOSING LOGIC ---
    // Note: The opening logic is handled by menu-dynamic.js for the menu page.
    // script.js handles closing the modal and outside clicks.

    const modal = document.getElementById('foodModal');
    const closeModal = document.querySelector('.close-modal');

    function hideModalGlobal() {
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Wait for transition
            document.body.style.overflow = 'auto';
        }
    }

    if (closeModal) {
        closeModal.addEventListener('click', hideModalGlobal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModalGlobal();
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
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
});