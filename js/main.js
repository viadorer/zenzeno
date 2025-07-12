// Main JavaScript functionality for ZENZENO e-shop

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize components (already handled in components.js)
    // Add any additional initialization here
    
    // Handle newsletter form
    setupNewsletterForm();
    
    // Handle smooth scrolling for navigation
    setupSmoothScrolling();
    
    // Handle responsive navigation
    setupMobileNavigation();
    
    // Initialize lazy loading for images
    setupLazyLoading();
    
    console.log('ZENZENO e-shop initialized successfully!');
}

// Newsletter form functionality
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                // In a real implementation, this would send to server
                showNotification('Děkujeme za přihlášení k odběru novinek!', 'success');
                this.reset();
            } else {
                showNotification('Prosím zadejte platnou e-mailovou adresu.', 'error');
            }
        });
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile navigation toggle
function setupMobileNavigation() {
    // Add mobile menu toggle if needed
    const navMenu = document.querySelector('.nav-menu');
    
    // Create mobile menu button
    if (window.innerWidth <= 768) {
        createMobileMenuButton();
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            createMobileMenuButton();
        } else {
            removeMobileMenuButton();
        }
    });
}

function createMobileMenuButton() {
    const navContent = document.querySelector('.nav-content');
    const existingButton = document.querySelector('.mobile-menu-toggle');
    
    if (!existingButton && navContent) {
        const mobileButton = document.createElement('button');
        mobileButton.className = 'mobile-menu-toggle';
        mobileButton.innerHTML = '☰';
        mobileButton.addEventListener('click', toggleMobileMenu);
        
        navContent.insertBefore(mobileButton, navContent.querySelector('.nav-actions'));
    }
}

function removeMobileMenuButton() {
    const mobileButton = document.querySelector('.mobile-menu-toggle');
    if (mobileButton) {
        mobileButton.remove();
    }
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('mobile-open');
    }
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Generic notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        fontWeight: '500',
        zIndex: '4000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#333';
            break;
        default:
            notification.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Utility functions
function formatPrice(price) {
    return `${price.toFixed(2)} €`;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('cs-CZ', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

// Search functionality
function searchProducts(query) {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (categories[product.category] && categories[product.category].name.toLowerCase().includes(searchTerm))
    );
}

// Filter products by price range
function filterByPriceRange(products, minPrice, maxPrice) {
    return products.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
}

// Sort products
function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'featured':
            return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        default:
            return sorted;
    }
}

// URL parameter handling
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function setUrlParameter(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

// Local storage helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
        return null;
    }
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Analytics helpers (placeholder for future implementation)
function trackEvent(eventName, properties = {}) {
    // In a real implementation, this would send to analytics service
    console.log('Analytics Event:', eventName, properties);
}

function trackPageView(pageName) {
    // In a real implementation, this would send to analytics service
    console.log('Page View:', pageName);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Export functions for global use
window.ZENZENO = {
    formatPrice,
    formatCurrency,
    searchProducts,
    filterByPriceRange,
    sortProducts,
    showNotification,
    trackEvent,
    trackPageView
};
