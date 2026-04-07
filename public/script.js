// script.js
const API_BASE = '/api';

// Elements
const searchForm = document.getElementById('search-form');
const qInput = document.getElementById('q');
const catInput = document.getElementById('category');
const minInput = document.getElementById('minPrice');
const maxInput = document.getElementById('maxPrice');
const clearBtn = document.getElementById('clear-filters');
const resultsGrid = document.getElementById('results-grid');
const noResults = document.getElementById('no-results');
const loading = document.getElementById('loading-state');
const errorAlert = document.getElementById('error-alert');

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(`${tabId}-section`).classList.add('active');

        if(tabId === 'reports') {
            loadReports();
        } else if(tabId === 'search') {
            performSearch();
        }
    });
});

// Modals
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.id.replace('Btn', '');
        document.getElementById(modalId).style.display = 'flex';
        if(modalId === 'inventoryModal') {
            loadSuppliersForSelect();
        }
    });
});

document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById(btn.getAttribute('data-modal')).style.display = 'none';
    });
});

// APIs & Render
const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

async function performSearch(e) {
    if(e) e.preventDefault();
    
    // Clear states
    resultsGrid.innerHTML = '';
    noResults.classList.add('hidden');
    errorAlert.classList.add('hidden');
    loading.classList.remove('hidden');

    const params = new URLSearchParams();
    if(qInput.value.trim()) params.append('q', qInput.value);
    if(catInput.value) params.append('category', catInput.value);
    if(minInput.value) params.append('minPrice', minInput.value);
    if(maxInput.value) params.append('maxPrice', maxInput.value);

    try {
        const response = await fetch(`${API_BASE}/search?${params.toString()}`);
        const data = await response.json();
        
        loading.classList.add('hidden');

        if (!response.ok) {
            errorAlert.textContent = data.message || "An error occurred.";
            errorAlert.classList.remove('hidden');
            return;
        }

        if (data.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="pc-category">${item.category}</div>
                <h3 class="pc-title">${item.product_name}</h3>
                <div class="pc-supplier"><i class="fas fa-truck"></i> ${item.supplier_name}</div>
                <div class="pc-footer">
                    <div class="pc-price">${formatPrice(item.price)}</div>
                    <div class="pc-qty">${item.quantity} in stock</div>
                </div>
            `;
            resultsGrid.appendChild(card);
        });
    } catch (error) {
        loading.classList.add('hidden');
        errorAlert.textContent = "Failed to connect to backend.";
        errorAlert.classList.remove('hidden');
    }
}

async function loadReports() {
    const tbody = document.querySelector('#reports-table tbody');
    tbody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
    
    try {
        const response = await fetch(`${API_BASE}/reports/supplier-value`);
        const data = await response.json();
        tbody.innerHTML = '';
        
        if(data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No records found.</td></tr>';
            return;
        }

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${row.id}</td>
                <td><strong>${row.name}</strong></td>
                <td>${formatPrice(row.total_inventory_value)}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-danger">Failed to load reports.</td></tr>';
    }
}

async function loadSuppliersForSelect() {
    const select = document.getElementById('inv-supplier');
    try {
        const res = await fetch(`${API_BASE}/suppliers`);
        const data = await res.json();
        select.innerHTML = '<option value="">Select Supplier</option>';
        data.forEach(s => {
            select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
        });
    } catch (err) {
        console.error(err);
    }
}

// Supplier Form Submit
document.getElementById('supplier-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('supp-name').value;
    const city = document.getElementById('supp-city').value;
    const msg = document.getElementById('supp-msg');
    
    try {
        const res = await fetch(`${API_BASE}/suppliers`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, city })
        });
        const data = await res.json();
        if(res.ok) {
            msg.className = "text-success";
            msg.textContent = "Supplier added successfully!";
            document.getElementById('supplier-form').reset();
        } else {
            msg.className = "text-danger";
            msg.textContent = data.message || "Error adding supplier.";
        }
    } catch (err) {
        msg.className = "text-danger";
        msg.textContent = "Server error.";
    }
});

// Inventory Form Submit
document.getElementById('inventory-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('inv-msg');
    
    const body = {
        supplier_id: document.getElementById('inv-supplier').value,
        product_name: document.getElementById('inv-product').value,
        category: document.getElementById('inv-category').value,
        quantity: document.getElementById('inv-qty').value,
        price: document.getElementById('inv-price').value
    };

    try {
        const res = await fetch(`${API_BASE}/inventory`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if(res.ok) {
            msg.className = "text-success";
            msg.textContent = "Inventory added successfully!";
            document.getElementById('inventory-form').reset();
            performSearch(); // Refresh search if matching
        } else {
            msg.className = "text-danger";
            msg.textContent = data.message || "Error adding inventory.";
        }
    } catch (err) {
        msg.className = "text-danger";
        msg.textContent = "Server error.";
    }
});

// Event Listeners
searchForm.addEventListener('submit', performSearch);
clearBtn.addEventListener('click', () => {
    searchForm.reset();
    performSearch();
});

// Global init Load initial search without filters
window.onload = performSearch;
