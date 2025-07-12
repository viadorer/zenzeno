// Checkout functionality

let orderData = {
    items: [],
    subtotal: 0,
    shipping: 99,
    total: 99
};

// Initialize checkout page
function initializeCheckout() {
    loadOrderItems();
    setupEventListeners();
    updateOrderSummary();
}

// Load cart items into order summary
function loadOrderItems() {
    if (typeof cart !== 'undefined' && cart.items && cart.items.length > 0) {
        orderData.items = [...cart.items];
        orderData.subtotal = cart.getTotalPrice();
    } else {
        // If no cart items, redirect to shop
        window.location.href = 'produkty.html';
        return;
    }
    
    displayOrderItems();
    updateOrderSummary();
}

// Display order items in summary
function displayOrderItems() {
    const orderItemsContainer = document.getElementById('order-items');
    if (!orderItemsContainer) return;

    if (orderData.items.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-order">Žádné produkty v objednávce</p>';
        return;
    }

    const itemsHTML = orderData.items.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">Množství: ${item.quantity}</div>
            </div>
            <div class="order-item-price">${item.price * item.quantity} Kč</div>
        </div>
    `).join('');

    orderItemsContainer.innerHTML = itemsHTML;
}

// Setup event listeners
function setupEventListeners() {
    // Billing address toggle
    const sameAddressCheckbox = document.getElementById('same-address');
    const billingAddress = document.getElementById('billing-address');
    
    if (sameAddressCheckbox && billingAddress) {
        sameAddressCheckbox.addEventListener('change', function() {
            billingAddress.style.display = this.checked ? 'none' : 'block';
        });
    }

    // Shipping method change
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateShippingCost(this.value);
        });
    });

    // Payment method change
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            updatePaymentCost(this.value);
        });
    });

    // Form submission
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmission);
    }
}

// Update shipping cost based on selected method
function updateShippingCost(shippingMethod) {
    switch (shippingMethod) {
        case 'post':
            orderData.shipping = 99;
            break;
        case 'courier':
            orderData.shipping = 149;
            break;
        case 'pickup':
            orderData.shipping = 0;
            break;
        default:
            orderData.shipping = 99;
    }
    
    updateOrderSummary();
}

// Update payment cost based on selected method
function updatePaymentCost(paymentMethod) {
    let paymentFee = 0;
    
    if (paymentMethod === 'cod') {
        paymentFee = 30;
    }
    
    // Add payment fee to shipping (for simplicity)
    const baseShipping = getBaseShippingCost();
    orderData.shipping = baseShipping + paymentFee;
    
    updateOrderSummary();
}

// Get base shipping cost without payment fees
function getBaseShippingCost() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    if (!selectedShipping) return 99;
    
    switch (selectedShipping.value) {
        case 'post': return 99;
        case 'courier': return 149;
        case 'pickup': return 0;
        default: return 99;
    }
}

// Update order summary totals
function updateOrderSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const shippingCostElement = document.getElementById('shipping-cost');
    const totalCostElement = document.getElementById('total-cost');
    
    orderData.total = orderData.subtotal + orderData.shipping;
    
    if (subtotalElement) {
        subtotalElement.textContent = `${orderData.subtotal} Kč`;
    }
    
    if (shippingCostElement) {
        shippingCostElement.textContent = `${orderData.shipping} Kč`;
    }
    
    if (totalCostElement) {
        totalCostElement.textContent = `${orderData.total} Kč`;
    }
}

// Handle form validation
function validateForm(formData) {
    const errors = [];
    
    // Required fields
    const requiredFields = [
        'firstName', 'lastName', 'email', 'phone',
        'street', 'city', 'zip', 'country'
    ];
    
    requiredFields.forEach(field => {
        if (!formData.get(field) || formData.get(field).trim() === '') {
            errors.push(`Pole "${getFieldLabel(field)}" je povinné`);
        }
    });
    
    // Email validation
    const email = formData.get('email');
    if (email && !isValidEmail(email)) {
        errors.push('Neplatný formát e-mailové adresy');
    }
    
    // Phone validation
    const phone = formData.get('phone');
    if (phone && !isValidPhone(phone)) {
        errors.push('Neplatný formát telefonního čísla');
    }
    
    // Terms acceptance
    if (!formData.get('terms')) {
        errors.push('Musíte souhlasit s obchodními podmínkami');
    }
    
    if (!formData.get('privacy')) {
        errors.push('Musíte souhlasit se zpracováním osobních údajů');
    }
    
    // Billing address validation if different
    const sameAddress = formData.get('sameAddress');
    if (!sameAddress) {
        const billingFields = ['billingStreet', 'billingCity', 'billingZip'];
        billingFields.forEach(field => {
            if (!formData.get(field) || formData.get(field).trim() === '') {
                errors.push(`Pole "${getFieldLabel(field)}" je povinné`);
            }
        });
    }
    
    return errors;
}

// Get field label for error messages
function getFieldLabel(fieldName) {
    const labels = {
        'firstName': 'Jméno',
        'lastName': 'Příjmení',
        'email': 'E-mail',
        'phone': 'Telefon',
        'street': 'Ulice',
        'city': 'Město',
        'zip': 'PSČ',
        'country': 'Země',
        'billingStreet': 'Fakturační ulice',
        'billingCity': 'Fakturační město',
        'billingZip': 'Fakturační PSČ'
    };
    
    return labels[fieldName] || fieldName;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^(\+420)?[0-9\s\-]{9,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Handle order submission
function handleOrderSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    // Collect order data
    const order = collectOrderData(formData);
    
    // Process order
    processOrder(order);
}

// Collect all order data
function collectOrderData(formData) {
    const order = {
        // Customer info
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        
        // Shipping address
        shipping: {
            street: formData.get('street'),
            city: formData.get('city'),
            zip: formData.get('zip'),
            country: formData.get('country')
        },
        
        // Billing address
        billing: formData.get('sameAddress') ? null : {
            street: formData.get('billingStreet'),
            city: formData.get('billingCity'),
            zip: formData.get('billingZip'),
            country: formData.get('country')
        },
        
        // Order details
        items: orderData.items,
        shippingMethod: formData.get('shipping'),
        paymentMethod: formData.get('payment'),
        notes: formData.get('notes'),
        
        // Costs
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        total: orderData.total,
        
        // Agreements
        newsletter: formData.get('newsletter') === 'on',
        
        // Order metadata
        orderDate: new Date().toISOString(),
        orderNumber: generateOrderNumber()
    };
    
    return order;
}

// Generate order number
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `ZEN${year}${month}${day}${random}`;
}

// Process order (simulate order processing)
function processOrder(order) {
    // Show loading state
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        // Save order to localStorage (in real app, send to server)
        saveOrder(order);
        
        // Clear cart
        if (typeof cart !== 'undefined') {
            cart.clearCart();
        }
        
        // Redirect to success page
        window.location.href = `objednavka-uspech.html?order=${order.orderNumber}`;
    }, 2000);
}

// Save order to localStorage
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Show loading state
function showLoading() {
    const submitButton = document.querySelector('.order-submit');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '⏳ Zpracovávám objednávku...';
    }
}

// Show validation errors
function showErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-messages';
    errorContainer.innerHTML = `
        <div class="error-header">Opravte prosím následující chyby:</div>
        <ul>
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    // Insert at top of form
    const form = document.getElementById('order-form');
    if (form) {
        form.insertBefore(errorContainer, form.firstChild);
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Helper function to redirect to checkout from cart
function proceedToCheckout() {
    window.location.href = 'objednavka.html';
}
