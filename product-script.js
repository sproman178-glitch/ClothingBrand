// ==========================================
// PRODUCT PAGE JAVASCRIPT
// ==========================================

console.log('%cProduct Page Loading...', 'font-size: 18px; color: #8b4513; font-weight: bold;');

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let cart = [];
let selectedSize = 'S';
let selectedColor = 'black';
let selectedImage = 0;

// Product data
const product = {
    id: 1,
    name: "Basic Tee",
    price: 35,
    images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    colors: {
        black: {
            name: "Black",
            images: [
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ]
        },
        gray: {
            name: "Gray",
            images: [
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1503342217505-b0a15e326a57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            ]
        }
    },
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    unavailableSizes: ['XL']
};

// ==========================================
// DOM ELEMENTS
// ==========================================

const mainImage = document.getElementById('main-product-image');
const thumbnails = document.querySelectorAll('.thumbnail');
const colorOptions = document.querySelectorAll('.color-option');
const sizeOptions = document.querySelectorAll('.size-option');
const addToCartBtn = document.getElementById('add-to-cart');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.querySelector('.cart-icon');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

function showNotification(message, type = 'success') {
    const colors = {
        success: '#8b4513',
        error: '#ff4757',
        warning: '#ffa726',
        info: '#3498db'
    };
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.background = colors[type];
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function animateCartIcon() {
    cartIcon.style.animation = 'none';
    setTimeout(() => {
        cartIcon.style.animation = 'cartPulse 0.5s ease-out';
    }, 10);
}

// ==========================================
// IMAGE FUNCTIONS
// ==========================================

function updateMainImage(imageIndex) {
    const currentColorImages = product.colors[selectedColor].images;
    mainImage.src = currentColorImages[imageIndex];
    selectedImage = imageIndex;
    
    // Update thumbnail active state
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === imageIndex);
    });
}

function updateThumbnails() {
    const currentColorImages = product.colors[selectedColor].images;
    thumbnails.forEach((thumb, index) => {
        thumb.src = currentColorImages[index];
    });
}

// ==========================================
// COLOR SELECTION
// ==========================================

function selectColor(color) {
    selectedColor = color;
    
    // Update color option selection
    colorOptions.forEach(option => {
        option.classList.toggle('selected', option.dataset.color === color);
    });
    
    // Update thumbnails and main image
    updateThumbnails();
    updateMainImage(0);
    
    console.log('Selected color:', color);
}

// ==========================================
// SIZE SELECTION
// ==========================================

function selectSize(size) {
    if (product.unavailableSizes.includes(size)) {
        showNotification('This size is currently unavailable', 'warning');
        return;
    }
    
    selectedSize = size;
    
    // Update size option selection
    sizeOptions.forEach(option => {
        option.classList.toggle('selected', option.dataset.size === size);
    });
    
    console.log('Selected size:', size);
}

// ==========================================
// CART FUNCTIONS
// ==========================================

function addToCart() {
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: selectedColor,
        image: product.colors[selectedColor].images[0],
        quantity: 1
    };
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => 
        item.id === cartItem.id && 
        item.size === cartItem.size && 
        item.color === cartItem.color
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`${product.name} quantity updated!`, 'success');
    } else {
        cart.push(cartItem);
        showNotification(`${product.name} added to cart!`, 'success');
    }
    
    updateCartUI();
    animateCartIcon();
    saveToLocalStorage();
}

function removeFromCart(itemId, size, color) {
    cart = cart.filter(item => 
        !(item.id === itemId && item.size === size && item.color === color)
    );
    updateCartUI();
    showNotification('Item removed from cart', 'info');
    saveToLocalStorage();
}

function updateQuantity(itemId, size, color, change) {
    const item = cart.find(item => 
        item.id === itemId && item.size === size && item.color === color
    );
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId, size, color);
        } else if (item.quantity > 10) {
            item.quantity = 10;
            showNotification('Maximum quantity is 10', 'warning');
        } else {
            updateCartUI();
            saveToLocalStorage();
        }
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-shopping-bag" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>
                <p style="color: #666;">Your cart is empty</p>
            </div>
        `;
        cartTotalElement.textContent = '0.00';
    } else {
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p style="margin: 5px 0; color: #666; font-size: 14px;">
                        Size: ${item.size} | Color: ${item.color}
                    </p>
                    <p style="color: #8b4513; font-weight: 600;">${formatCurrency(item.price)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.size}', '${item.color}', -1)">-</button>
                    <span style="min-width: 20px; text-align: center;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.size}', '${item.color}', 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id}, '${item.size}', '${item.color}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = total.toFixed(2);
    }
}

function clearCart() {
    cart = [];
    updateCartUI();
    saveToLocalStorage();
}

// ==========================================
// LOCAL STORAGE
// ==========================================

function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Thumbnail clicks
thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        updateMainImage(index);
    });
});

// Color selection
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectColor(option.dataset.color);
    });
});

// Size selection
sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectSize(option.dataset.size);
    });
});

// Add to cart button
addToCartBtn.addEventListener('click', () => {
    addToCart();
});

// Cart modal
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        updateCartUI();
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Checkout button
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Cart is empty!', 'warning');
            return;
        }
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    });
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    
    // Initialize with default selections
    selectColor('black');
    selectSize('S');
    updateMainImage(0);
    
    console.log('%c✓ Product Page Loaded Successfully!', 'font-size: 14px; color: #27ae60;');
    console.log(`Cart: ${cart.length} items`);
});

// ==========================================
// END OF SCRIPT
// ==========================================


