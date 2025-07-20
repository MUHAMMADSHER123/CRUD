from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import jwt
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
CORS(app)

# --- Konfiguratsiya ---
app.config['SECRET_KEY'] = 'bu-juda-maxfiy-kalit-12345'
PRODUCTS_FILE = os.path.join(os.path.dirname(__file__), 'products.json')

# --- Admin ma'lumotlari (oddiy misol) ---
ADMIN_USER = {
    "username": "admin",
    "password": "password"
}

# --- Yordamchi funksiyalar ---
def read_products():
    if not os.path.exists(PRODUCTS_FILE):
        return []
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def write_products(products):
    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=4, ensure_ascii=False)

# --- Tokenni tekshirish uchun dekorator ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        
        if not token:
            return jsonify({'message': 'Token mavjud emas!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token muddati oʻtgan!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token yaroqsiz!'}), 401
            
        return f(*args, **kwargs)
    return decorated

# --- Marshrutlar (Routes) ---

# Login
@app.route('/login', methods=['POST'])
def login():
    auth = request.json
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'message': 'Login ma\'lumotlari to\'liq emas!'}), 401

    if auth['username'] == ADMIN_USER['username'] and auth['password'] == ADMIN_USER['password']:
        token = jwt.encode({
            'user': auth['username'],
            'exp': datetime.utcnow() + timedelta(hours=1) # Token 1 soat amal qiladi
        }, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token})

    return jsonify({'message': 'Login yoki parol xato!'}), 401

# Barcha mahsulotlarni olish (public)
@app.route('/products', methods=['GET'])
def get_products():
    products = read_products()
    return jsonify(products)

# Mahsulot qo'shish (himoyalangan)
@app.route('/products', methods=['POST'])
@token_required
def add_product():
    new_product = request.json
    products = read_products()
    new_product['id'] = products[-1]['id'] + 1 if products else 1
    products.append(new_product)
    write_products(products)
    return jsonify(new_product), 201

# Mahsulotni tahrirlash (himoyalangan)
@app.route('/products/<int:product_id>', methods=['PUT'])
@token_required
def update_product(product_id):
    products = read_products()
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return jsonify({'error': 'Mahsulot topilmadi'}), 404
    data = request.json
    product['name'] = data.get('name', product['name'])
    product['price'] = data.get('price', product['price'])
    write_products(products)
    return jsonify(product)

# Mahsulotni o'chirish (himoyalangan)
@app.route('/products/<int:product_id>', methods=['DELETE'])
@token_required
def delete_product(product_id):
    products = read_products()
    product_index = next((i for i, p in enumerate(products) if p['id'] == product_id), None)
    if product_index is None:
        return jsonify({'error': 'Mahsulot topilmadi'}), 404
    deleted_product = products.pop(product_index)
    write_products(products)
    return jsonify(deleted_product)

if __name__ == '__main__':
    app.run(debug=True)
