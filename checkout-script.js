// ==========================================
// CHECKOUT PAGE JAVASCRIPT
// ==========================================

console.log('%cCheckout Page Loading...', 'font-size: 18px; color: #8b4513; font-weight: bold;');

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let cart = [];
let currentStep = 'contact';

// ==========================================
// DOM ELEMENTS
// ==========================================

const contactSection = document.querySelector('.checkout-section');
const paymentSection = document.getElementById('payment-section');
const shippingSection = document.getElementById('shipping-section');
const billingSection = document.getElementById('billing-section');
const reviewSection = document.getElementById('review-section');
const continueBtn = document.getElementById('continue-btn');
const continuePaymentBtn = document.getElementById('continue-payment-btn');
const continueShippingBtn = document.getElementById('continue-shipping-btn');
const continueBillingBtn = document.getElementById('continue-billing-btn');
const placeOrderBtn = document.getElementById('place-order-btn');
const orderItemsContainer = document.getElementById('order-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryTaxes = document.getElementById('summary-taxes');
const summaryShipping = document.getElementById('summary-shipping');
const summaryTotal = document.getElementById('summary-total');
const sameAsBilling = document.getElementById('same-as-billing');

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

function showSection(section) {
    // Hide all sections
    [contactSection, paymentSection, shippingSection, billingSection, reviewSection].forEach(sec => {
        if (sec) {
            sec.classList.remove('active');
            sec.classList.add('collapsed');
        }
    });

    // Show target section
    if (section) {
        section.classList.remove('collapsed');
        section.classList.add('active');
    }
}

function validateSection(sectionElement) {
    const inputs = sectionElement.querySelectorAll('input[required]');
    for (const input of inputs) {
        if (!input.value.trim()) {
            alert('Please fill all required fields');
            input.focus();
            return false;
        }
    }
    return true;
}

// ==========================================
// LOAD CART
// ==========================================

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (cart.length === 0) {
        showEmptyCart();
    } else {
        displayOrderSummary();
    }
}

function showEmptyCart() {
    orderItemsContainer.innerHTML = `
        <div class="empty-cart-message">
            <i class="fas fa-shopping-bag"></i>
            <p>Your cart is empty</p>
            <a href="product.html">Continue Shopping</a>
        </div>
    `;
    summarySubtotal.textContent = formatCurrency(0);
    summaryTaxes.textContent = formatCurrency(0);
    summaryShipping.textContent = formatCurrency(0);
    summaryTotal.textContent = formatCurrency(0);
}

function displayOrderSummary() {
    orderItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.setAttribute('data-index', index);
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="order-item-details">
                <h4>${item.name}</h4>
                <p>${item.color}</p>
                <p>${item.size}</p>
                <p>Qty: ${item.quantity || 1}</p>
                <div class="item-price">${formatCurrency(item.price)}</div>
                <div class="order-item-actions">
                    <a href="#" class="edit-link">Edit</a>
                    <a href="#" class="remove-link">Remove</a>
                </div>
            </div>
        `;
        orderItemsContainer.appendChild(div);
    });

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const taxes = subtotal * 0.08;
    const shipping = 14.00;
    const total = subtotal + taxes + shipping;

    summarySubtotal.textContent = formatCurrency(subtotal);
    summaryTaxes.textContent = formatCurrency(taxes);
    summaryShipping.textContent = formatCurrency(shipping);
    summaryTotal.textContent = formatCurrency(total);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

if (continueBtn) {
    continueBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        if (validateSection(contactSection)) {
            showSection(paymentSection);
            currentStep = 'payment';
        }
    });
}

if (continuePaymentBtn) {
    continuePaymentBtn.addEventListener('click', () => {
        const paymentSelected = document.querySelector('input[name="payment-method"]:checked');
        if (!paymentSelected) {
            alert('Please select a payment method');
            return;
        }
        showSection(shippingSection);
        currentStep = 'shipping';
    });
}

if (continueShippingBtn) {
    continueShippingBtn.addEventListener('click', () => {
        if (validateSection(shippingSection)) {
            // If same as billing is checked, copy shipping to billing
            if (sameAsBilling && sameAsBilling.checked) {
                copyShippingToBilling();
            }
            
            if (!sameAsBilling || !sameAsBilling.checked) {
                showSection(billingSection);
                currentStep = 'billing';
            } else {
                showSection(reviewSection);
                currentStep = 'review';
            }
        }
    });
}

if (continueBillingBtn) {
    continueBillingBtn.addEventListener('click', () => {
        if (validateSection(billingSection)) {
            showSection(reviewSection);
            currentStep = 'review';
        }
    });
}

function copyShippingToBilling() {
    const shippingName = document.getElementById('shipping-name').value;
    const shippingAddress = document.getElementById('shipping-address').value;
    const shippingCity = document.getElementById('shipping-city').value;
    const shippingState = document.getElementById('shipping-state').value;
    const shippingZip = document.getElementById('shipping-zip').value;

    document.getElementById('billing-name').value = shippingName;
    document.getElementById('billing-address').value = shippingAddress;
    document.getElementById('billing-city').value = shippingCity;
    document.getElementById('billing-state').value = shippingState;
    document.getElementById('billing-zip').value = shippingZip;
}

if (sameAsBilling) {
    sameAsBilling.addEventListener('change', (e) => {
        if (e.target.checked) {
            copyShippingToBilling();
        }
    });
}

if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Generate order ID
        const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Clear cart and local storage
        cart = [];
        localStorage.removeItem('cart');
        
        // Show success message
        alert(`Order #${orderId} placed successfully! Thank you for your purchase.`);
        
        // Redirect to home
        window.location.href = 'index.html';
    });
}

// Handle order item actions
orderItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-link')) {
        const orderItem = e.target.closest('.order-item');
        if (orderItem) {
            const index = parseInt(orderItem.getAttribute('data-index'));
            if (!isNaN(index) && index >= 0 && index < cart.length) {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                if (cart.length === 0) {
                    showEmptyCart();
                } else {
                    displayOrderSummary();
                }
            }
        }
    } else if (e.target.classList.contains('edit-link')) {
        alert('Edit functionality - would redirect to product page');
    }
});

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    // Start with contact section active
    showSection(contactSection);
    
    console.log('%c✓ Checkout Page Loaded Successfully!', 'font-size: 14px; color: #27ae60;');
    console.log(`Cart: ${cart.length} items`);
});

// ==========================================
// END OF SCRIPT
// ==========================================

