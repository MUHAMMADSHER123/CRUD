const API_URL = 'http://127.0.0.1:5000';
const token = localStorage.getItem('token');

// Agar token bo'lmasa, login sahifasiga qaytarish
if (!token) {
    window.location.href = 'login.html';
}

const productsList = document.getElementById('products-list');
const addProductForm = document.getElementById('add-product-form');
const editModal = document.getElementById('edit-modal');
const editProductForm = document.getElementById('edit-product-form');
const closeModalBtn = document.querySelector('.close-button');
const searchInput = document.getElementById('search-input');
const sortByNameBtn = document.getElementById('sort-by-name');
const sortByPriceBtn = document.getElementById('sort-by-price');
const logoutBtn = document.getElementById('logout-btn');

let allProducts = [];
let isSortAsc = { name: true, price: true };

// Bildirishnoma ko'rsatish
function showNotification(message, isError = false) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : ''}`;
    notification.textContent = message;
    container.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => container.removeChild(notification), 500);
    }, 3000);
}

// Mahsulotlarni ko'rsatish
function displayProducts(products) {
    productsList.innerHTML = '';
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td class="action-buttons">
                <button class="edit-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Tahrirlash</button>
                <button class="delete-btn" data-id="${product.id}">O'chirish</button>
            </td>
        `;
        productsList.appendChild(tr);
    });
}

// Barcha mahsulotlarni olish
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error('Mahsulotlarni yuklashda xatolik:', error);
    }
}

// Mahsulot qo'shish
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const price = document.getElementById('product-price').value;

    if (!name || price <= 0) {
        showNotification('Iltimos, maydonlarni to\'g\'ri to\'ldiring.', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            body: JSON.stringify({ name, price: parseFloat(price) })
        });
        if (response.ok) {
            fetchProducts();
            addProductForm.reset();
            showNotification('Mahsulot muvaffaqiyatli qo\'shildi!');
        } else {
            showNotification('Mahsulot qo\'shishda xatolik!', true);
        }
    } catch (error) {
        console.error('Xatolik:', error);
    }
});

// Tahrirlash va O'chirish
productsList.addEventListener('click', async (e) => {
    const target = e.target;
    const productId = target.dataset.id;

    if (target.classList.contains('delete-btn')) {
        if (confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
            try {
                const response = await fetch(`${API_URL}/products/${productId}`, {
                    method: 'DELETE',
                    headers: { 'x-access-token': token }
                });
                if (response.ok) {
                    fetchProducts();
                    showNotification('Mahsulot muvaffaqiyatli o\'chirildi!');
                } else {
                    showNotification('Mahsulotni o\'chirishda xatolik!', true);
                }
            } catch (error) {
                console.error('Xatolik:', error);
            }
        }
    }

    if (target.classList.contains('edit-btn')) {
        document.getElementById('edit-product-id').value = productId;
        document.getElementById('edit-product-name').value = target.dataset.name;
        document.getElementById('edit-product-price').value = target.dataset.price;
        editModal.style.display = 'block';
    }
});

// Tahrirlangan ma'lumotni saqlash
editProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-product-id').value;
    const name = document.getElementById('edit-product-name').value.trim();
    const price = document.getElementById('edit-product-price').value;

    if (!name || price <= 0) {
        showNotification('Iltimos, maydonlarni to\'g\'ri to\'ldiring.', true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            body: JSON.stringify({ name, price: parseFloat(price) })
        });
        if (response.ok) {
            editModal.style.display = 'none';
            fetchProducts();
            showNotification('Mahsulot muvaffaqiyatli tahrirlandi!');
        } else {
            showNotification('Mahsulotni tahrirlashda xatolik!', true);
        }
    } catch (error) {
        console.error('Xatolik:', error);
    }
});

// Modalni yopish
closeModalBtn.addEventListener('click', () => editModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target == editModal) editModal.style.display = 'none';
});

// Qidiruv
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
    displayProducts(filtered);
});

// Saralash
sortByNameBtn.addEventListener('click', () => {
    isSortAsc.name = !isSortAsc.name;
    const sorted = [...allProducts].sort((a, b) => isSortAsc.name ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    displayProducts(sorted);
});

sortByPriceBtn.addEventListener('click', () => {
    isSortAsc.price = !isSortAsc.price;
    const sorted = [...allProducts].sort((a, b) => isSortAsc.price ? a.price - b.price : b.price - a.price);
    displayProducts(sorted);
});

// Chiqish
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

// Boshlang'ich yuklash
fetchProducts();
