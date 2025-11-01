// ==========================================
// ELEGANCE - PREMIUM FASHION STORE
// Advanced Shopping Website JavaScript (560+ Lines)
// ==========================================

console.log('%cELEGANCE Store Loading...', 'font-size: 20px; color: #8b4513; font-weight: bold;');

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let cart = [];
let wishlist = [];
let recentlyViewed = [];
let currentUser = null;

// Extended Products Database
const products = {
    1: { id: 1, name: "Premium Cotton Shirt", price: 89.99, originalPrice: 119.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "Men", sizes: ["S", "M", "L", "XL"], colors: ["White", "Blue", "Black"], inStock: true, rating: 4.8, reviews: 124, description: "Premium quality cotton shirt with modern fit." },
    2: { id: 2, name: "Designer Blazer", price: 199.99, originalPrice: 249.99, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "Men", sizes: ["S", "M", "L", "XL"], colors: ["Navy", "Black"], inStock: true, rating: 4.9, reviews: 89, description: "Premium designer blazer for formal events." },
    3: { id: 3, name: "Elegant Evening Dress", price: 149.99, originalPrice: 199.99, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "Women", sizes: ["XS", "S", "M", "L"], colors: ["Black", "Navy", "Red"], inStock: true, rating: 4.7, reviews: 156, description: "Beautiful evening dress with elegant design." },
    4: { id: 4, name: "Luxury Timepiece", price: 299.99, originalPrice: 399.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", category: "Accessories", sizes: ["One Size"], colors: ["Silver", "Gold", "Rose Gold"], inStock: true, rating: 4.9, reviews: 203, description: "Luxury timepiece with precision engineering." }
};

// ==========================================
// DOM ELEMENTS
// ==========================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.querySelector('.cart-icon');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const checkoutBtn = document.querySelector('.checkout-btn');
const newsletterForm = document.querySelector('.newsletter-form');

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatCurrency(amount) { return `$${amount.toFixed(2)}`; }
function calculateDiscount(orig, sale) { return Math.round(((orig - sale) / orig) * 100); }
function isInCart(id) { return cart.some(item => item.id === id); }
function isInWishlist(id) { return wishlist.includes(id); }
function debounce(func, wait) { let timeout; return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func(...args), wait); }; }

// ==========================================
// CART FUNCTIONS
// ==========================================

function addToCart(productId, size = "M", color = null) {
    const product = products[productId];
    if (!product) return;
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`${product.name} quantity updated!`, 'success');
    } else {
        cart.push({...product, quantity: 1, size, color: color || product.colors[0], addedAt: new Date().toISOString()});
        showNotification(`${product.name} added to cart!`, 'success');
    }
    updateCartUI();
    animateCartIcon();
}

function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    updateCartUI();
    showNotification('Item removed from cart', 'info');
}

function updateQuantity(productId, size, change) {
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(productId, size);
        else if (item.quantity > 10) { item.quantity = 10; showNotification('Maximum quantity is 10', 'warning'); }
        else updateCartUI();
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div style="text-align: center; padding: 40px 20px;"><i class="fas fa-shopping-bag" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i><p style="color: #666;">Your cart is empty</p></div>';
        cartTotalElement.textContent = '0.00';
    } else {
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `<img src="${item.image}" alt="${item.name}"><div class="cart-item-info"><h4>${item.name}</h4><p style="margin: 5px 0; color: #666; font-size: 14px;">Size: ${item.size}</p><p style="color: #8b4513; font-weight: 600;">${formatCurrency(item.price)}</p></div><div class="cart-item-controls"><button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.size}', -1)">-</button><span style="min-width: 20px; text-align: center;">${item.quantity}</span><button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.size}', 1)">+</button><button class="remove-item" onclick="removeFromCart(${item.id}, '${item.size}')"><i class="fas fa-trash"></i></button></div>`;
            cartItemsContainer.appendChild(div);
        });
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = total * 0.10;
        cartTotalElement.textContent = (total + tax).toFixed(2);
    }
    saveToLocalStorage();
}

function animateCartIcon() { cartIcon.style.animation = 'none'; setTimeout(() => { cartIcon.style.animation = 'cartPulse 0.5s ease-out'; }, 10); }
function clearCart() { cart = []; updateCartUI(); }

// ==========================================
// WISHLIST FUNCTIONS
// ==========================================

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) { wishlist.splice(index, 1); showNotification('Removed from wishlist', 'info'); }
    else { wishlist.push(productId); showNotification('Added to wishlist', 'success'); }
    saveToLocalStorage();
}

// ==========================================
// QUICK VIEW
// ==========================================

function showQuickView(product) {
    const modalHTML = `<div class="quick-view-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 20px;"><div style="background: white; border-radius: 15px; max-width: 900px; width: 100%; position: relative;"><span class="close-modal" style="position: absolute; top: 15px; right: 20px; font-size: 32px; cursor: pointer; z-index: 10; color: #666;">&times;</span><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 40px;"><div><img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 10px;"></div><div><h2 style="font-size: 2rem; margin-bottom: 10px;">${product.name}</h2><div style="display: flex; gap: 15px; margin-bottom: 20px;"><span style="font-size: 1.8rem; color: #8b4513; font-weight: 700;">${formatCurrency(product.price)}</span></div><p style="color: #666; line-height: 1.6; margin-bottom: 25px;">${product.description}</p><button onclick="addToCart(${product.id}); document.querySelector('.quick-view-overlay').remove(); document.body.style.overflow='auto';" style="width: 100%; background: #8b4513; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: 600; cursor: pointer;">Add to Cart</button></div></div></div></div>`;
    const overlay = document.createElement('div');
    overlay.className = 'quick-view-overlay';
    overlay.innerHTML = modalHTML;
    document.body.appendChild(overlay);
    overlay.querySelector('.close-modal').addEventListener('click', () => { overlay.remove(); document.body.style.overflow = 'auto'; });
    document.body.style.overflow = 'hidden';
}

// ==========================================
// NOTIFICATIONS
// ==========================================

function showNotification(message, type = 'success') {
    const colors = { success: '#8b4513', error: '#ff4757', warning: '#ffa726', info: '#3498db' };
    const notification = document.createElement('div');
    notification.style.cssText = `position: fixed; bottom: 20px; right: 20px; background: ${colors[type]}; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 3001; animation: slideIn 0.3s ease-out;`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.animation = 'slideOut 0.3s ease-out'; setTimeout(() => notification.remove(), 300); }, 3000);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

if (hamburger) { hamburger.addEventListener('click', () => { navMenu.classList.toggle('active'); }); }
document.querySelectorAll('.nav-menu a').forEach(link => { link.addEventListener('click', () => { navMenu.classList.remove('active'); }); });

if (cartIcon) { cartIcon.addEventListener('click', () => { cartModal.style.display = 'block'; document.body.style.overflow = 'hidden'; updateCartUI(); }); }
if (closeCartBtn) { closeCartBtn.addEventListener('click', () => { cartModal.style.display = 'none'; document.body.style.overflow = 'auto'; }); }
window.addEventListener('click', (e) => { if (e.target === cartModal) { cartModal.style.display = 'none'; document.body.style.overflow = 'auto'; } });

// Product cards now navigate to product.html on click
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Only navigate if not clicking on the view item button
        if (!e.target.classList.contains('view-item')) {
            window.location.href = 'product.html';
        }
    });
});

// View item buttons
document.querySelectorAll('.view-item').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = 'product.html';
    });
});

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (re.test(email)) {
            showNotification(`Thanks for subscribing!`, 'success');
            newsletterForm.reset();
        } else showNotification('Please enter valid email', 'error');
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

if (document.querySelector('.cta-button')) {
    document.querySelector('.cta-button').addEventListener('click', () => {
        document.querySelector('#collection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('#collection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) { showNotification('Cart is empty!', 'warning'); return; }
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    });
}

// ==========================================
// LOCAL STORAGE
// ==========================================

function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function loadFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedWishlist) wishlist = JSON.parse(savedWishlist);
    updateCartUI();
}

// ==========================================
// SCROLL EFFECTS
// ==========================================

let lastScroll = 0;
window.addEventListener('scroll', debounce(() => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
    lastScroll = currentScroll;
}, 10));

// ==========================================
// ANIMATIONS
// ==========================================

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .category-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// ==========================================
// INITIALIZATION
// ==========================================

// ==========================================
// SLIDESHOW FUNCTIONALITY
// ==========================================

let currentSlideIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Handle circular navigation
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }
    
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current slide and indicator
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
    
    console.log('Current slide:', currentSlideIndex + 1, 'of', slides.length);
}

function changeSlide(direction) {
    const nextIndex = currentSlideIndex + direction;
    showSlide(nextIndex);
    
    // Reset auto-slide interval after manual navigation
    if (isIntervalActive) {
        clearInterval(slideInterval);
        slideInterval = setInterval(autoSlide, 5000);
    }
}

function currentSlide(index) {
    showSlide(index - 1);
}

// Auto-advance slideshow
function autoSlide() {
    changeSlide(1);
}

let slideInterval = setInterval(autoSlide, 5000); // Change slide every 5 seconds
let isIntervalActive = true;

// Pause on hover
const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
        isIntervalActive = false;
    });
    hero.addEventListener('mouseleave', () => {
        if (!isIntervalActive) {
            slideInterval = setInterval(autoSlide, 5000);
            isIntervalActive = true;
        }
    });
}

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================

const searchBar = document.querySelector('.search-bar');
if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length > 0) {
            searchProducts(query);
        }
    });
    
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchBar.value;
            if (query) {
                showNotification(`Searching for: ${query}`, 'info');
                // In real app, you would filter products here
            }
        }
    });
}

function searchProducts(query) {
    // This function would filter products based on search query
    console.log('Searching for:', query);
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    
    // Preload all slide images
    const slideImages = document.querySelectorAll('.slide img');
    let loadedCount = 0;
    
    slideImages.forEach((img, index) => {
        const tempImg = new Image();
        tempImg.onload = () => {
            loadedCount++;
            if (loadedCount === slideImages.length) {
                console.log('All slides loaded successfully');
            }
        };
        tempImg.src = img.src;
    });
    
    showSlide(0); // Initialize slideshow
    console.log('%c✓ ELEGANCE Store Loaded Successfully!', 'font-size: 14px; color: #27ae60;');
    console.log(`Cart: ${cart.length} items | Wishlist: ${wishlist.length} items`);
});

// ==========================================
// END OF SCRIPT
// ==========================================
