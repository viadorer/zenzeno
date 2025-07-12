// Product Detail Page JavaScript

class ProductDetail {
    constructor() {
        this.currentProduct = null;
        this.init();
    }

    init() {
        this.loadProductFromURL();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Toggle sections
        document.querySelectorAll('.section-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                this.toggleSection(e.target.closest('.section-toggle'));
            });
        });

        // Add to cart
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart();
            });
        }

        // Share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleShare(e.target.classList[1]);
            });
        });
    }

    async loadProductFromURL() {
        // Get product ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const productCode = urlParams.get('kod');

        if (!productId && !productCode) {
            this.showErrorState();
            return;
        }

        try {
            // Wait for products to be loaded if not already loaded
            if (!productLoader.loaded) {
                await productLoader.loadProducts();
            }
            
            const products = productLoader.getProducts();
            
            // Find product by ID or Code
            let product = null;
            if (productId) {
                product = products.find(p => p.id == productId);
            } else if (productCode) {
                product = products.find(p => p.code === productCode);
            }

            if (product) {
                this.currentProduct = product;
                this.displayProduct(product);
                this.hideLoading();
            } else {
                this.showErrorState();
            }
        } catch (error) {
            console.error('Chyba při načítání produktu:', error);
            this.showErrorState();
        }
    }

    displayProduct(product) {
        // Update page title
        document.title = `${product.name} - ZENZENO`;

        // Display product image
        const productImage = document.getElementById('product-image');
        if (productImage) {
            productImage.src = product.image || 'images/placeholder.jpg';
            productImage.alt = product.name;
        }

        // Display product badge
        const badge = document.getElementById('product-badge');
        if (badge && product.badge) {
            badge.textContent = product.badge;
            badge.className = `product-badge ${this.getBadgeClass(product.badge)}`;
            badge.style.display = 'block';
        }

        // Display product title and description
        const title = document.getElementById('product-title');
        if (title) title.textContent = product.name;

        const description = document.getElementById('product-description');
        if (description) description.textContent = product.description;

        // Display pricing
        this.displayPricing(product);

        // Display product sections
        this.displayProductSections(product);
    }

    displayPricing(product) {
        // Current price
        const currentPrice = document.getElementById('product-price');
        if (currentPrice) {
            currentPrice.textContent = `${product.price} Kč`;
        }

        // Original price (if exists)
        const originalPrice = document.getElementById('original-price');
        if (originalPrice && product.originalPrice && product.originalPrice > product.price) {
            originalPrice.textContent = `${product.originalPrice} Kč`;
            originalPrice.style.display = 'inline';
        }

        // Savings info
        const savingsInfo = document.getElementById('savings-info');
        if (savingsInfo && product.savings && product.savings > 0) {
            const savingsPercent = Math.round((product.savings / product.originalPrice) * 100);
            savingsInfo.textContent = `Ušetříte ${savingsPercent}%`;
            savingsInfo.style.display = 'block';
        }

        // Premier pricing (if applicable)
        const premierSection = document.getElementById('premier-pricing');
        const premierPrice = document.getElementById('premier-price-value');
        if (product.originalPrice && product.originalPrice > product.price) {
            const premierValue = Math.round(product.price * 0.7); // 30% discount for premier
            if (premierPrice) premierPrice.textContent = `${premierValue} Kč`;
            if (premierSection) premierSection.style.display = 'block';
        }

        // Retail price
        const retailPrice = document.getElementById('retail-price');
        if (retailPrice) {
            retailPrice.textContent = `${product.price} Kč`;
        }
    }

    displayProductSections(product) {
        // Overview section
        const overviewContent = document.getElementById('product-overview-content');
        if (overviewContent) {
            overviewContent.innerHTML = this.getProductOverview(product);
        }

        // Benefits section
        const benefitsContent = document.getElementById('product-benefits-content');
        if (benefitsContent) {
            benefitsContent.innerHTML = this.getProductBenefits(product);
        }

        // Ingredients section
        const ingredientsContent = document.getElementById('product-ingredients-content');
        if (ingredientsContent) {
            ingredientsContent.innerHTML = this.getProductIngredients(product);
        }

        // More info section
        const infoContent = document.getElementById('product-info-content');
        if (infoContent) {
            infoContent.innerHTML = this.getProductMoreInfo(product);
        }

        // Usage section
        const usageContent = document.getElementById('product-usage-content');
        if (usageContent) {
            usageContent.innerHTML = this.getProductUsage(product);
        }

        // Videos section
        const videosContent = document.getElementById('product-videos-content');
        if (videosContent) {
            videosContent.innerHTML = this.getProductVideos(product);
        }

        // Documents section
        const documentsContent = document.getElementById('product-documents-content');
        if (documentsContent) {
            documentsContent.innerHTML = this.getProductDocuments(product);
        }
    }

    getProductOverview(product) {
        // Use CSV column data if available, otherwise fallback to description
        if (product.Přehled_produktu && product.Přehled_produktu.trim()) {
            return `<p>${product.Přehled_produktu}</p>`;
        }
        return `<p>${product.Popis || 'Přehled produktu bude doplněn.'}</p>`;
    }

    getProductBenefits(product) {
        // Use CSV column data if available
        if (product.Hlavní_přínosy && product.Hlavní_přínosy.trim()) {
            // Convert bullet points from CSV to HTML list
            const benefits = product.Hlavní_přínosy.split('\n').filter(line => line.trim());
            const listItems = benefits.map(benefit => `<li>${benefit.replace(/^•\s*/, '')}</li>`).join('');
            return `<ul>${listItems}</ul>`;
        }
        return `<p>Hlavní přínosy tohoto produktu budou doplněny.</p>`;
    }

    getProductIngredients(product) {
        // Use CSV column data if available
        if (product.Ingredience && product.Ingredience.trim()) {
            return `<p><strong>Složení:</strong> ${product.Ingredience}</p>`;
        }
        return `<p>Detailní složení bude doplněno.</p>`;
    }

    getProductMoreInfo(product) {
        let moreInfo = `
            <p><strong>Kód produktu:</strong> ${product.Kód}</p>
            <p><strong>Kategorie:</strong> ${this.getCategoryName(product.Kategorie)}</p>
            <p><strong>Doporučený produkt:</strong> ${product.Doporučené === 'ANO' ? 'Ano' : 'Ne'}</p>
        `;
        
        // Add CSV column data if available
        if (product.Více_informací && product.Více_informací.trim()) {
            moreInfo += `<div class="additional-info">${product.Více_informací}</div>`;
        }
        
        return moreInfo;
    }

    getProductUsage(product) {
        // Use CSV column data if available
        if (product.Návod_k_použití && product.Návod_k_použití.trim()) {
            return `<p><strong>Návod k použití:</strong> ${product.Návod_k_použití}</p>`;
        }
        return `<p>Návod k použití bude doplněn.</p>`;
    }

    getProductVideos(product) {
        // Use CSV column data if available
        if (product.Videa && product.Videa.trim()) {
            // Check if it's a URL or text content
            if (product.Videa.startsWith('http')) {
                return `
                    <div class="video-content">
                        <p>Instruktažní video:</p>
                        <a href="${product.Videa}" target="_blank" class="video-link">Podivat se na video</a>
                    </div>
                `;
            } else {
                return `<p>${product.Videa}</p>`;
            }
        }
        return `<p>Instruktažní videa k tomuto produktu budou brzy dostupná.</p>`;
    }

    getProductDocuments(product) {
        // Use CSV column data if available
        if (product.Dokumenty_a_certifikáty && product.Dokumenty_a_certifikáty.trim()) {
            // Convert bullet points from CSV to HTML list
            const documents = product.Dokumenty_a_certifikáty.split('\n').filter(line => line.trim());
            if (documents.length > 0) {
                const listItems = documents.map(doc => `<li>${doc.replace(/^•\s*/, '')}</li>`).join('');
                return `
                    <p>Dostupné dokumenty a certifikáty:</p>
                    <ul>${listItems}</ul>
                `;
            }
        }
        return `
            <p>Dostupné dokumenty:</p>
            <ul>
                <li>Bezpečnostní list produktu</li>
                <li>Certifikát analýzy</li>
                <li>Návod k použití</li>
            </ul>
        `;
    }

    getBadgeClass(designation) {
        const lower = designation.toLowerCase();
        if (lower.includes('bestseller')) return 'bestseller';
        if (lower.includes('populární')) return 'popular';
        if (lower.includes('balíček')) return 'package';
        return '';
    }

    getCategoryName(category) {
        const categories = {
            'omega': 'Omega-3 produkty',
            'health-tests': 'Zdravotní testy',
            'accessories': 'Příslušenství'
        };
        return categories[category] || category;
    }

    toggleSection(toggle) {
        const isActive = toggle.classList.contains('active');
        const section = toggle.dataset.section;
        const content = document.getElementById(section);
        const icon = toggle.querySelector('.toggle-icon');

        if (isActive) {
            toggle.classList.remove('active');
            content.classList.remove('active');
            icon.textContent = '+';
        } else {
            toggle.classList.add('active');
            content.classList.add('active');
            icon.textContent = '−';
        }
    }

    addToCart() {
        if (!this.currentProduct) return;

        // Add to cart logic (integrate with existing cart system)
        const cartEvent = new CustomEvent('addToCart', {
            detail: {
                id: this.currentProduct.ID,
                name: this.currentProduct.Název,
                price: this.currentProduct.Cena,
                image: this.currentProduct.Obrázek,
                quantity: 1
            }
        });

        document.dispatchEvent(cartEvent);
        
        // Show feedback
        const btn = document.querySelector('.add-to-cart-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Přidáno do košíku!';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '#333';
        }, 2000);
    }

    handleShare(platform) {
        const url = window.location.href;
        const title = this.currentProduct ? this.currentProduct.Název : 'Produkt';
        
        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                break;
            case 'email':
                window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
                break;
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        const content = document.getElementById('product-detail-content');
        
        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'block';
    }

    showErrorState() {
        const loading = document.getElementById('loading');
        const content = document.getElementById('product-detail-content');
        const error = document.getElementById('error-state');
        
        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'none';
        if (error) error.style.display = 'block';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetail();
});
