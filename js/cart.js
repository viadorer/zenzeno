// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartDisplay();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('zenzeno_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('zenzeno_cart', JSON.stringify(this.items));
    }

    // Add item to cart
    addItem(productId, quantity = 1) {
        const product = getProductById(productId);
        if (!product) return false;

        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showCartNotification('Produkt byl přidán do košíku!');
        return true;
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    // Get total items count
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get total price
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Clear cart
    clear() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    // Update cart display
    updateCartDisplay() {
        // Update cart count in navigation
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }

        // Update cart sidebar
        this.updateCartSidebar();
    }

    // Update cart sidebar content
    updateCartSidebar() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems || !cartTotal) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <p>Váš košík je prázdný</p>
                    <button class="btn-primary" onclick="toggleCart(); window.location.href='produkty.html'">
                        Prozkoumat produkty
                    </button>
                </div>
            `;
            cartTotal.textContent = '0 Kč';
            return;
        }

        const itemsHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">${item.price} Kč</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    ${(item.price * item.quantity)} Kč
                </div>
                <button class="cart-item-remove" onclick="cart.removeItem(${item.id})">×</button>
            </div>
        `).join('');

        cartItems.innerHTML = itemsHTML;
        cartTotal.textContent = `${this.getTotalPrice()} Kč`;
    }

    // Show cart notification
    showCartNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Global functions
function addToCart(productId, quantity = 1) {
    cart.addItem(productId, quantity);
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
        
        // Add overlay
        let overlay = document.querySelector('.cart-overlay');
        if (cartSidebar.classList.contains('open')) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'cart-overlay';
                overlay.onclick = toggleCart;
                document.body.appendChild(overlay);
            }
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            if (overlay) {
                overlay.classList.remove('active');
                setTimeout(() => {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                }, 300);
            }
            document.body.style.overflow = '';
        }
    }
}

function clearCart() {
    if (confirm('Opravdu chcete vyprázdnit košík?')) {
        cart.clear();
    }
}

function proceedToCheckout() {
    if (cart.items.length === 0) {
        alert('Váš košík je prázdný!');
        return;
    }
    
    // For now, just show a simple alert
    // In a real implementation, this would redirect to checkout
    const total = cart.getTotalPrice().toFixed(2);
    const itemCount = cart.getTotalItems();
    alert(`Přesměrování na objednávku...\n\nPočet položek: ${itemCount}\nCelková cena: ${total} €`);
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartToggle = document.querySelector('.cart-toggle');
    
    if (cartSidebar && cartSidebar.classList.contains('open') && 
        !cartSidebar.contains(event.target) && 
        !cartToggle.contains(event.target)) {
        toggleCart();
    }
});
