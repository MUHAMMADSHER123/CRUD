const API_URL = 'http://127.0.0.1:5000';

const productsList = document.getElementById('products-list');

const searchInput = document.getElementById('search-input');
const sortByNameBtn = document.getElementById('sort-by-name');
const sortByPriceBtn = document.getElementById('sort-by-price');

let allProducts = []; // Barcha mahsulotlarni saqlash uchun
let isSortAsc = { name: true, price: true }; // Saralash tartibini saqlash

// Bildirishnoma ko'rsatish funksiyasi
function showNotification(message, isError = false) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : ''}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Animatsiya uchun
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // 3 soniyadan keyin o'chirish
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            container.removeChild(notification);
        }, 500); // Animatsiya tugashini kutish
    }, 3000);
}

// Barcha mahsulotlarni olish va ko'rsatish
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
                allProducts = await response.json(); // Barcha mahsulotlarni saqlab qo'yish
        displayProducts(allProducts); // Mahsulotlarni ko'rsatish funksiyasi
    } catch (error) {
        console.error('Mahsulotlarni yuklashda xatolik:', error);
    }
}

// Mahsulotlarni jadvalga chizish funksiyasi
function displayProducts(products) {
    productsList.innerHTML = ''; // Ro'yxatni tozalash
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
        `;
        productsList.appendChild(tr);
    });
}

// Saralash
sortByNameBtn.addEventListener('click', () => {
    isSortAsc.name = !isSortAsc.name;
    const sorted = [...allProducts].sort((a, b) => {
        return isSortAsc.name 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
    });
    displayProducts(sorted);
});

sortByPriceBtn.addEventListener('click', () => {
    isSortAsc.price = !isSortAsc.price;
    const sorted = [...allProducts].sort((a, b) => {
        return isSortAsc.price ? a.price - b.price : b.price - a.price;
    });
    displayProducts(sorted);
});

// Qidiruv
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    // Qidiruv natijalarini ko'rsatishda saralash holatini saqlab qolish uchun
    // Hozircha qidiruv natijasi saralanmagan holda chiqadi.
    // Buni keyinchalik murakkablashtirish mumkin.

    displayProducts(filteredProducts);
});

// Boshlang'ich yuklash
fetchProducts();
