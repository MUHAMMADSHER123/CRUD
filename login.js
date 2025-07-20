const API_URL = 'http://127.0.0.1:5000';

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('login-error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = ''; // Xatolik xabarini tozalash

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token); // Tokenni saqlash
            window.location.href = 'admin.html'; // Admin panelga o'tish
        } else {
            errorMessage.textContent = data.message || 'Login yoki parol xato.';
        }
    } catch (error) {
        errorMessage.textContent = 'Server bilan bog\'lanishda xatolik.';
        console.error('Login xatoligi:', error);
    }
});
