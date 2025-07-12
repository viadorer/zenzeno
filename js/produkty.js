// Product listing page functionality
const ProductListingPage = {
    currentFilters: {
        search: '',
        category: '',
        priceRange: '',
        sort: '',
        featured: false
    },
    
    filteredProducts: [],
    currentPage: 1,
    productsPerPage: 12,
    totalPages: 1,
    
    init() {
        // Wait for products to be loaded from CSV
        if (productLoader.loaded) {
            this.initializeWithProducts();
        } else {
            document.addEventListener('productsLoaded', () => {
                this.initializeWithProducts();
            });
        }
    },
    
    initializeWithProducts() {
        this.allProducts = [...productLoader.getProducts()];
        this.filteredProducts = [...productLoader.getProducts()];
        this.bindEvents();
        this.applyFilters();
        this.loadFromURL();
    },
    
    bindEvents() {
        // Search input with debounce
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.currentFilters.search = searchInput.value;
                this.resetToFirstPage();
                this.applyFilters();
            }, 300));
        }
        
        // Clear search button
        const clearSearchBtn = document.getElementById('clear-search');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.currentFilters.search = '';
                this.resetToFirstPage();
                this.applyFilters();
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.currentFilters.category = categoryFilter.value;
                this.resetToFirstPage();
                this.applyFilters();
            });
        }
        
        // Price filter
        const priceFilter = document.getElementById('price-filter');
        if (priceFilter) {
            priceFilter.addEventListener('change', () => {
                this.currentFilters.priceRange = priceFilter.value;
                this.resetToFirstPage();
                this.applyFilters();
            });
        }
        
        // Featured filter
        const featuredFilter = document.getElementById('featured-filter');
        if (featuredFilter) {
            featuredFilter.addEventListener('change', () => {
                this.currentFilters.featured = featuredFilter.checked;
                this.resetToFirstPage();
                this.applyFilters();
            });
        }
        
        // Sort filter
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.currentFilters.sort = sortFilter.value;
                this.applyFilters();
            });
        }
        
        // Clear all filters
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
        
        // Products per page
        const productsPerPageSelect = document.getElementById('products-per-page-select');
        if (productsPerPageSelect) {
            productsPerPageSelect.addEventListener('change', () => {
                const value = productsPerPageSelect.value;
                this.productsPerPage = value === 'all' ? this.filteredProducts.length : parseInt(value);
                this.resetToFirstPage();
                this.renderProducts();
            });
        }
        
        // Pagination buttons
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderProducts();
                    this.scrollToTop();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.renderProducts();
                    this.scrollToTop();
                }
            });
        }
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    applyFilters() {
        let filtered = [...this.allProducts];
        
        // Search filter
        if (this.currentFilters.search.trim()) {
            const searchTerm = this.currentFilters.search.toLowerCase().trim();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Category filter
        if (this.currentFilters.category) {
            filtered = filtered.filter(product => product.category === this.currentFilters.category);
        }
        
        // Price filter
        if (this.currentFilters.priceRange) {
            const priceRange = this.currentFilters.priceRange;
            if (priceRange.includes('+')) {
                const minPrice = parseInt(priceRange.replace('+', ''));
                filtered = filtered.filter(product => product.price >= minPrice);
            } else {
                const [min, max] = priceRange.split('-').map(Number);
                filtered = filtered.filter(product => product.price >= min && product.price <= max);
            }
        }
        
        // Featured filter
        if (this.currentFilters.featured) {
            filtered = filtered.filter(product => product.featured);
        }
        
        // Sort
        if (this.currentFilters.sort) {
            filtered = this.sortProducts(filtered, this.currentFilters.sort);
        }
        
        this.filteredProducts = filtered;
        this.renderProducts();
    },
    
    sortProducts(products, sortBy) {
        const sorted = [...products];
        
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
            case 'featured':
                return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            default:
                return sorted;
        }
    },
    
    renderProducts() {
        this.calculatePagination();
        this.renderProductGrid();
        this.renderPagination();
        this.updateProductsCount();
    },
    
    calculatePagination() {
        // Always calculate based on filtered products
        const filteredCount = this.filteredProducts.length;
        
        if (this.productsPerPage === 'all' || this.productsPerPage >= filteredCount) {
            this.totalPages = 1;
            this.currentPage = 1;
        } else {
            this.totalPages = Math.ceil(filteredCount / this.productsPerPage) || 1;
            // Ensure current page is within valid range
            if (this.currentPage > this.totalPages) {
                this.currentPage = Math.max(1, this.totalPages);
            }
            if (this.currentPage < 1) {
                this.currentPage = 1;
            }
        }
    },
    
    renderProductGrid() {
        const grid = document.getElementById('products-grid');
        const noProducts = document.getElementById('no-products');
        
        if (!grid) return;
        
        if (this.filteredProducts.length === 0) {
            grid.innerHTML = '';
            if (noProducts) noProducts.classList.remove('hidden');
            return;
        }
        
        if (noProducts) noProducts.classList.add('hidden');
        
        // Calculate products for current page
        let productsToShow;
        if (this.productsPerPage === this.filteredProducts.length) {
            productsToShow = this.filteredProducts;
        } else {
            const startIndex = (this.currentPage - 1) * this.productsPerPage;
            const endIndex = startIndex + this.productsPerPage;
            productsToShow = this.filteredProducts.slice(startIndex, endIndex);
        }
        
        // Render products
        grid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
    },
    
    renderPagination() {
        const pagination = document.getElementById('pagination');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageNumbers = document.getElementById('page-numbers');
        
        if (!pagination) return;
        
        // Show/hide pagination based on filtered products
        const filteredCount = this.filteredProducts.length;
        const shouldShowPagination = filteredCount > 0 && 
                                   this.totalPages > 1 && 
                                   this.productsPerPage !== 'all' && 
                                   this.productsPerPage < filteredCount;
        
        if (!shouldShowPagination) {
            pagination.classList.add('hidden');
            return;
        }
        
        pagination.classList.remove('hidden');
        
        // Update prev/next buttons
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === this.totalPages;
        }
        
        // Render page numbers
        if (pageNumbers) {
            pageNumbers.innerHTML = this.generatePageNumbers();
        }
    },
    
    generatePageNumbers() {
        const pages = [];
        const current = this.currentPage;
        const total = this.totalPages;
        
        // Always show first page
        if (total > 1) {
            pages.push(this.createPageButton(1, current === 1));
        }
        
        // Show dots if there's a gap
        if (current > 3) {
            pages.push('<span class="page-number dots">...</span>');
        }
        
        // Show pages around current page
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
        
        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== total) {
                pages.push(this.createPageButton(i, current === i));
            }
        }
        
        // Show dots if there's a gap
        if (current < total - 2) {
            pages.push('<span class="page-number dots">...</span>');
        }
        
        // Always show last page
        if (total > 1) {
            pages.push(this.createPageButton(total, current === total));
        }
        
        return pages.join('');
    },
    
    createPageButton(pageNum, isActive) {
        const activeClass = isActive ? ' active' : '';
        return `<button class="page-number${activeClass}" onclick="ProductListingPage.goToPage(${pageNum})">${pageNum}</button>`;
    },
    
    goToPage(pageNum) {
        this.currentPage = pageNum;
        this.renderProducts();
        this.scrollToTop();
    },
    
    updateProductsCount() {
        const countElement = document.getElementById('products-count');
        if (countElement) {
            const start = this.filteredProducts.length === 0 ? 0 : (this.currentPage - 1) * this.productsPerPage + 1;
            const end = Math.min(this.currentPage * this.productsPerPage, this.filteredProducts.length);
            
            if (this.productsPerPage === this.filteredProducts.length) {
                countElement.textContent = `Zobrazeno ${this.filteredProducts.length} produktů`;
            } else {
                countElement.textContent = `Zobrazeno ${start}-${end} z ${this.filteredProducts.length} produktů`;
            }
        }
    },
    
    resetToFirstPage() {
        this.currentPage = 1;
    },
    
    scrollToTop() {
        const productsSection = document.querySelector('.products-section');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },
    
    clearAllFilters() {
        // Reset filters
        this.currentFilters = {
            search: '',
            category: '',
            priceRange: '',
            sort: '',
            featured: false
        };
        
        // Reset form elements
        const searchInput = document.getElementById('product-search');
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const sortFilter = document.getElementById('sort-filter');
        const featuredFilter = document.getElementById('featured-filter');
        
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        if (sortFilter) sortFilter.value = '';
        if (featuredFilter) featuredFilter.checked = false;
        
        this.resetToFirstPage();
        this.applyFilters();
    },
    
    loadFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('kategorie');
        const product = urlParams.get('produkt');
        
        if (category) {
            this.currentFilters.category = category;
            const categoryFilter = document.getElementById('category-filter');
            if (categoryFilter) categoryFilter.value = category;
        }
        
        this.applyFilters();
        
        if (product) {
            setTimeout(() => {
                const productElement = document.querySelector(`[data-id="${product}"]`);
                if (productElement) {
                    productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    productElement.style.border = '2px solid #007bff';
                    setTimeout(() => {
                        productElement.style.border = '';
                    }, 3000);
                }
            }, 500);
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing ProductListingPage');
    console.log('CSV Loader available:', typeof productLoader !== 'undefined');
    console.log('createProductCard available:', typeof createProductCard !== 'undefined');
    
    if (typeof productLoader === 'undefined') {
        console.error('Product loader is not defined!');
        return;
    }
    
    if (typeof createProductCard === 'undefined') {
        console.error('createProductCard function is not defined!');
        return;
    }
    
    // Initialize ProductListingPage - it will wait for products to load
    ProductListingPage.init();
});
