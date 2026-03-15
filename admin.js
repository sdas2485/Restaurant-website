// Mock Initial Data (if localstorage empty)
const defaultBookings = [
    { id: 101, date: "2026-03-20", time: "19:00", name: "Ananya Sharma", phone: "9876543210", guests: 4, status: "Confirmed" },
    { id: 102, date: "2026-03-21", time: "20:00", name: "Vikram Rathore", phone: "9123456780", guests: 2, status: "Pending" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth State
    const isAuthenticated = localStorage.getItem('odr_admin_auth') === 'true';
    if (isAuthenticated) {
        showView('admin-dashboard-view');
        loadDashboardData();
    } else {
        showView('admin-login-view');
    }
});

function showView(viewId) {
    document.querySelector('.admin-body').style.alignItems = viewId === 'admin-login-view' ? 'center' : 'stretch';
    document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const err = document.getElementById('login-error');

    err.classList.add('hidden');
    localStorage.setItem('odr_admin_auth', 'true');
    showView('admin-dashboard-view');
    loadDashboardData();
}

function logout() {
    localStorage.removeItem('odr_admin_auth');
    showView('admin-login-view');
    document.getElementById('login-form').reset();
}

function switchTab(tabId) {
    // Update Menu active state
    document.querySelectorAll('.admin-menu li').forEach(li => li.classList.remove('active'));
    event.target.classList.add('active');

    // Show correct section
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

function loadDashboardData() {
    // 1. Load Bookings (Merge defaults with any new ones from localstorage)
    const lsBookingsStr = localStorage.getItem('odr_new_bookings');
    let dynamicBookings = lsBookingsStr ? JSON.parse(lsBookingsStr) : [];
    
    // Reverse chronologically, put newest first
    const allBookings = [...dynamicBookings, ...defaultBookings];

    const tbody = document.getElementById('bookings-tbody');
    tbody.innerHTML = allBookings.map(b => `
        <tr>
            <td>${b.date}</td>
            <td>${b.time}</td>
            <td><strong>${b.name}</strong></td>
            <td>${b.phone}</td>
            <td>${b.guests}</td>
            <td><span class="status-badge status-${b.status.toLowerCase()}">${b.status}</span></td>
        </tr>
    `).join('');

    // 2. Load Catalog
    // To share data elegantly without a backend, we load the menu array from script.js 
    // Usually admin uses API. We'll duplicate the base menu definition for the mock dashboard.
    const menuData = [
        { id: '1', category: 'Mains', name: 'Korean Crispy Chicken', price: 350 },
        { id: '2', category: 'Mains', name: 'Chicken Noodle', price: 280 },
        { id: '3', category: 'Drinks', name: 'Watermelon Cooler', price: 150 },
        { id: '4', category: 'Starters', name: 'Crispy Paneer Bites', price: 220 },
        { id: '5', category: 'Mains', name: 'Rooftop Special Pasta', price: 310 }
    ];

    const catb = document.getElementById('catalog-tbody');
    catb.innerHTML = menuData.map(m => `
        <tr>
            <td>#${m.id.padStart(3, '0')}</td>
            <td>${m.category}</td>
            <td><strong>${m.name}</strong></td>
            <td>₹${m.price}</td>
            <td>
                <button style="color:var(--text-muted); cursor:pointer; text-decoration:underline;">Edit</button> | 
                <button style="color:#e74c3c; cursor:pointer; text-decoration:underline;">Delete</button>
            </td>
        </tr>
    `).join('');
}
