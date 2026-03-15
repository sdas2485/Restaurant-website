// --- Global State ---
let cart = [];
const menuData = [
    { id: '1', category: 'Mains', name: 'Korean Crispy Chicken', desc: 'Fried to perfection, tossed in sweet & spicy gochujang sauce.', price: 350, image: 'assets/images/Koaren-crispy-chicken-new1.webp' },
    { id: '2', category: 'Mains', name: 'Chicken Noodle', desc: 'Wok-tossed noodles with tender chicken cuts, fresh veggies, and secret soy blend.', price: 280, image: 'assets/images/chef-recomend-1.png' },
    { id: '3', category: 'Drinks', name: 'Watermelon Cooler', desc: 'Refreshing signature mocktail blending fresh watermelon, mint, and a hint of lime.', price: 150, image: 'assets/images/chef-recomend-3.png' },
    { id: '4', category: 'Starters', name: 'Crispy Paneer Bites', desc: 'Golden fried cottage cheese squares with a spicy tangy dip.', price: 220, image: 'assets/images/chef-recomend-1.png' },
    { id: '5', category: 'Mains', name: 'Rooftop Special Pasta', desc: 'Creamy alfredo with exotic veggies and oregano dust.', price: 310, image: 'assets/images/Koaren-crispy-chicken-new1.webp' },
    { id: '6', category: 'Desserts', name: 'Midnight Chocolate Lava', desc: 'Warm molten chocolate cake served with Madagascar vanilla bean ice cream.', price: 250, image: 'assets/images/about-home.jpg' },
    { id: '7', category: 'Starters', name: 'Truffle Mushroom Arancini', desc: 'Crispy risotto balls stuffed with mozzarella and black truffle essence.', price: 290, image: 'assets/images/chef-recomend-1.png' },
    { id: '8', category: 'Starters', name: 'Honey Glazed Wings', desc: 'Double-fried chicken wings coated in a smoky honey BBQ glaze.', price: 320, image: 'assets/images/Koaren-crispy-chicken-new1.webp' },
    { id: '9', category: 'Mains', name: 'Pan Seared Salmon', desc: 'Atlantic salmon fillet with lemon herb butter and asparagus.', price: 550, image: 'assets/images/chef-recomend-1.png' },
    { id: '10', category: 'Mains', name: 'Char-Grilled Ribeye', desc: 'Premium cut beef steak flamed to perfection, served with mashed potatoes.', price: 780, image: 'assets/images/Koaren-crispy-chicken-new1.webp' },
    { id: '11', category: 'Drinks', name: 'Smoked Old Fashioned', desc: 'Classic bourbon cocktail infused with applewood smoke.', price: 420, image: 'assets/images/chef-recomend-3.png' },
    { id: '12', category: 'Drinks', name: 'Tropical Sunset', desc: 'A vibrant mix of passion fruit, pineapple, and citrus juices.', price: 180, image: 'assets/images/chef-recomend-3.png' },
    { id: '13', category: 'Desserts', name: 'Tiramisu Elegance', desc: 'Classic Italian espresso-soaked ladyfingers with mascarpone cream.', price: 280, image: 'assets/images/about-home.jpg' },
    { id: '14', category: 'Desserts', name: 'New York Cheesecake', desc: 'Rich and creamy slice served with a fresh berry compote.', price: 300, image: 'assets/images/about-home.jpg' }
];

document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader & Intro ---
    setTimeout(() => {
        const loaderProgress = document.querySelector('.loader-progress');
        loaderProgress.style.width = '100%';
        
        setTimeout(() => {
            document.getElementById('preloader').classList.add('fade-out');
            document.querySelector('.hero-bg').classList.add('loaded'); // Trigger slight zoom out
        }, 500);
    }, 500); // Simulate load time

    // --- Custom Cursor Logic (Only on Desktop) ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    // Check if device supports hover (desktop)
    if(window.matchMedia("(any-hover: hover)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Slight delay for outline for elastic feel
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effects on clickable elements
        const clickables = document.querySelectorAll('a, button, .logo-container, input, select');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    } else {
        // Hide custom cursor on mobile
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // --- Scroll Mechanics (Navbar & Parallax) ---
    const navbar = document.getElementById('navbar');
    const parallaxElements = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', () => {
        // Navbar Scrolled State
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active State in Nav based on scroll position
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.target === current) {
                btn.classList.add('active');
            }
        });

        // Simple Parallax effect
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.1;
            const yPos = -(window.scrollY * speed);
            el.querySelector('img').style.transform = `translateY(${yPos}px) scale(1.1)`;
        });
    });

    // --- Intersection Observer for Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- Generate Menu ---
    renderMenu();

    // --- Set min Date for Booking ---
    const dateInput = document.getElementById('date');
    if(dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// --- Navigation ---
function navigate(targetId) {
    const target = document.getElementById(targetId);
    if(target) {
        window.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
        });
    }
}

function toggleMobileMenu() {
    document.getElementById('hamburger').classList.toggle('active');
    document.getElementById('mobile-menu').classList.toggle('active');
}

// --- Menu & Cart Logic ---
let currentCategory = 'All';

function filterMenu(category) {
    currentCategory = category;
    // Update active tab styling
    document.querySelectorAll('.menu-tab').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText === category) {
            btn.classList.add('active');
        }
    });
    renderMenu();
}

function renderMenu() {
    const grid = document.getElementById('menu-grid');
    if(!grid) return;

    const filteredData = currentCategory === 'All' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);

    grid.innerHTML = filteredData.map((item, index) => `
        <div class="dish-card reveal fade-up active" style="transition-delay: ${index * 0.05}s">
            <div class="dish-img">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="dish-overlay">
                    <button class="add-btn" onclick="addToCart('${item.id}')" aria-label="Add to cart">+</button>
                </div>
            </div>
            <div class="dish-info">
                <div class="dish-header">
                    <h3 class="dish-name">${item.name}</h3>
                    <span class="dish-price">₹${item.price}</span>
                </div>
                <p class="dish-desc">${item.desc}</p>
            </div>
        </div>
    `).join('');
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('active');
    document.getElementById('cart-backdrop').classList.toggle('active');
}

function addToCart(id) {
    const item = menuData.find(m => m.id === id);
    if(item) {
        const existing = cart.find(c => c.id === id);
        if(existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        
        // Visual feedback on the button itself (optional, if you want a brief 'Added' state)
        // Updating cart state
        updateCartUI();
        toggleCart(); // Slide open the cart automatically
    }
}

function updateCartQty(id, change) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
        updateCartUI();
    }
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = count;

    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center" style="color:var(--text-muted); margin-top: 3rem;">Your selection is empty.<br><br><button class="btn btn-outline" onclick="toggleCart(); navigate('menu')">View Menu</button></div>`;
        document.getElementById('checkout-btn').disabled = true;
        document.getElementById('cart-total-amount').innerText = '₹0';
        return;
    }

    document.getElementById('checkout-btn').disabled = false;
    let total = 0;

    container.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
            <div class="cart-item-row">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('cart-total-amount').innerText = `₹${total}`;
}

function checkout() {
    if(cart.length === 0) return;
    const btn = document.getElementById('checkout-btn');
    btn.innerText = 'Processing...';
    
    setTimeout(() => {
        alert('Order Prepared! Expect culinary excellence soon.');
        cart = [];
        updateCartUI();
        toggleCart();
        btn.innerText = 'Proceed to Order';
    }, 1000);
}

// --- Lightbox Logic ---
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if(lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if(lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// --- Booking Logic ---
function handleBooking(e) {
    e.preventDefault();
    const btn = document.querySelector('#booking-form button[type="submit"]');
    const msg = document.getElementById('booking-message');
    
    btn.disabled = true;
    btn.innerText = 'Verifying...';
    
    setTimeout(() => {
        btn.disabled = false;
        btn.innerText = 'Request Reservation';
        
        msg.classList.remove('hidden');
        msg.innerHTML = `<strong>Confirmed.</strong> Your table awaits. We will contact you shortly to finalize details.`;
        
        // Save to LocalStorage for Admin Dashboard
        const newBooking = {
            id: Math.floor(Math.random() * 9000) + 1000,
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value,
            status: 'Pending'
        };
        const existing = JSON.parse(localStorage.getItem('odr_new_bookings') || '[]');
        existing.unshift(newBooking);
        localStorage.setItem('odr_new_bookings', JSON.stringify(existing));

        document.getElementById('booking-form').reset();
        
        setTimeout(() => msg.classList.add('hidden'), 6000);
    }, 2000);
}
