// Navigation Component
function createNavigation() {
    return `
        <header class="header">
            <div class="top-bar">
                <div class="container">
                    <div class="top-bar-left">
                        <span class="flag">CZ</span>
                        <span>Czech Republic (CZ)</span>
                    </div>
                    <div class="top-bar-right">
                        <a href="#" class="top-link">Blog</a>
                        <a href="#" class="top-link">Zákaznická podpora</a>
                        <a href="#" class="top-link">Přihlásit se</a>
                        <a href="#" class="top-link">Partnerský web</a>
                    </div>
                </div>
            </div>
            
            <nav class="main-nav">
                <div class="container">
                    <div class="nav-content">
                        <div class="logo">
                            <a href="index.html">ZENZENO</a>
                        </div>
                        
                        <ul class="nav-menu">
                            <li class="nav-item">
                                <a href="produkty.html" class="nav-link">OBCHOD</a>
                            </li>
                            <li class="nav-item">
                                <a href="premier-kits.html" class="nav-link">PREMIER KITS</a>
                            </li>
                            <li class="nav-item">
                                <a href="brand-shop.html" class="nav-link">BRAND SHOP</a>
                            </li>
                            <li class="nav-item">
                                <a href="przkoumat.html" class="nav-link">PROZKOUMAT</a>
                            </li>
                            <li class="nav-item">
                                <a href="o-nas.html" class="nav-link">O NÁS</a>
                            </li>
                        </ul>
                        
                        <div class="nav-actions">
                            <button class="cart-toggle" onclick="toggleCart()">
                                Košík (<span id="cart-count">0</span>)
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    `;
}

// Footer Component
function createFooter() {
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <div class="footer-logo">
                            <h3>ZENZENO</h3>
                        </div>
                        <p>Personalizovaná výživa založená na vědeckých testech pro optimální zdraví.</p>
                        <div class="social-links">
                            <a href="#" class="social-link">FB</a>
                            <a href="#" class="social-link">IG</a>
                            <a href="#" class="social-link">TW</a>
                            <a href="#" class="social-link">YT</a>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Produkty</h4>
                        <ul class="footer-links">
                            <li><a href="produkty.html?kategorie=omega">Omega suplementy</a></li>
                            <li><a href="produkty.html?kategorie=immune">Imunitní podpora</a></li>
                            <li><a href="produkty.html?kategorie=restore">Regenerace</a></li>
                            <li><a href="produkty.html?kategorie=gut-health">Zdraví střev</a></li>
                            <li><a href="produkty.html?kategorie=skin-care">Péče o pleť</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Podpora</h4>
                        <ul class="footer-links">
                            <li><a href="#contact">Kontakt</a></li>
                            <li><a href="#faq">Často kladené otázky</a></li>
                            <li><a href="#shipping">Doprava a platba</a></li>
                            <li><a href="#returns">Vrácení zboží</a></li>
                            <li><a href="#warranty">Záruka</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Společnost</h4>
                        <ul class="footer-links">
                            <li><a href="o-nas.html">O nás</a></li>
                            <li><a href="#career">Kariéra</a></li>
                            <li><a href="#press">Tiskové zprávy</a></li>
                            <li><a href="#partnership">Partnerství</a></li>
                            <li><a href="#science">Věda a výzkum</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h4>Newsletter</h4>
                        <p>Přihlaste se k odběru novinek a získejte 10% slevu na první objednávku.</p>
                        <form class="newsletter-form">
                            <input type="email" placeholder="Váš e-mail" required>
                            <button type="submit">Odeslat</button>
                        </form>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <div class="footer-bottom-content">
                        <p>&copy; 2024 ZENZENO. Všechna práva vyhrazena.</p>
                        <div class="footer-bottom-links">
                            <a href="#privacy">Ochrana osobních údajů</a>
                            <a href="#terms">Obchodní podmínky</a>
                            <a href="#cookies">Cookies</a>
                        </div>
                    </div>
                </div>
                
                <div class="footer-disclaimer">
                    <div class="container">
                        <p class="disclaimer-text">Doplňky stravy nemají nahrazovat vyváženou a pestrou stravu. Tento produkt je určen pouze pro informační účely a neměl by být používán k diagnostice, léčbě nebo vyléčení.</p>
                    </div>
                </div>
            </div>
        </footer>
    `;
}

// Shopping Cart Component
function createCartSidebar() {
    return `
        <div class="cart-sidebar" id="cart-sidebar">
            <div class="cart-header">
                <h3>Nákupní košík</h3>
                <button class="cart-close" onclick="toggleCart()">×</button>
            </div>
            <div class="cart-content">
                <div id="cart-items"></div>
                <div class="cart-total">
                    <div class="total-row">
                        <span>Celkem:</span>
                        <span id="cart-total">0 €</span>
                    </div>
                </div>
                <div class="cart-actions">
                    <button class="btn-primary cart-checkout" onclick="proceedToCheckout()">
                        Přejít k objednávce
                    </button>
                    <button class="btn-secondary" onclick="clearCart()">
                        Vyprázdnit košík
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Product Card Component
function createProductCard(product) {
    const detailUrl = `produkt-detail.html?id=${product.id}`;
    return `
        <div class="product-card" data-id="${product.id}">
            <a href="${detailUrl}" class="product-link">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-pricing">
                        <span class="product-price">${product.price} Kč</span>
                        ${product.originalPrice ? `<span class="product-original-price">${product.originalPrice} Kč</span>` : ''}
                        ${product.savings ? `<span class="product-savings">Ušetříte: ${product.savings} Kč</span>` : ''}
                    </div>
                </div>
            </a>
            <button class="btn-primary add-to-cart" onclick="addToCart(${product.id})">
                Přidat do košíku
            </button>
        </div>
    `;
}

// Initialize Components
function initializeComponents() {
    // Load Navigation
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = createNavigation();
    }

    // Load Footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = createFooter();
    }

    // Load Cart Sidebar
    const cartSidebar = document.getElementById('cart-sidebar');
    if (!cartSidebar) {
        document.body.insertAdjacentHTML('beforeend', createCartSidebar());
    }

    // Load Featured Products
    loadFeaturedProducts();
}

// Load Featured Products
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products-container');
    if (!container) return;

    // Wait for products to be loaded, then display featured products
    if (productLoader.loaded) {
        displayFeaturedProducts(container);
    } else {
        // Listen for products loaded event
        document.addEventListener('productsLoaded', () => {
            displayFeaturedProducts(container);
        });
    }
}

function displayFeaturedProducts(container) {
    const featuredProducts = productLoader.getFeaturedProducts().slice(0, 4);
    const productsHTML = featuredProducts.map(product => createProductCard(product)).join('');
    
    container.innerHTML = `
        <div class="products-grid">
            ${productsHTML}
        </div>
    `;
}

// Utility Functions
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showMoreInfo() {
    // Could open a modal or navigate to more info page
    alert('Více informací o našich produktech najdete v sekci PROZKOUMAT');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeComponents);
