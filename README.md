# Mahsulotlar Ro'yxati CRUD Ilovasi (product-crud-app)

Bu loyiha mahsulotlar ro'yxatini boshqarish uchun oddiy veb-ilova. Foydalanuvchi mahsulotlarni ko'rishi, qo'shishi, tahrirlashi va o'chirishi mumkin.

## Texnologiyalar

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Flask (Python)
- **Ma'lumotlar bazasi:** JSON fayl

## Ishga tushirish

Loyihani ishga tushirish uchun quyidagi amallarni bajaring:

### 1. Backend'ni ishga tushirish

Terminalda `product-crud-app/backend` papkasiga o'ting:

```bash
cd backend
```

Virtual muhit yaratish (tavsiya etiladi):

```bash
python -m venv venv
venv\Scripts\activate  # Windows uchun
source venv/bin/activate # MacOS/Linux uchun
```

Kerakli kutubxonalarni o'rnating:

```bash
pip install -r requirements.txt
```

Flask serverini ishga tushiring:

```bash
python app.py
```

Server `http://127.0.0.1:5000` manzilida ishlay boshlaydi.

### 2. Frontend'ni ochish

`product-crud-app/frontend` papkasidagi `index.html` faylini brauzerda oching. Buni fayl ustiga ikki marta bosish orqali amalga oshirish mumkin.

Shundan so'ng siz mahsulotlarni boshqarishni boshlashingiz mumkin.
