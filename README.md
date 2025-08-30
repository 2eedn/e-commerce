# Mini E-Commerce (Lokal, tanpa Docker)

Frontend: React + TypeScript + Tailwind (Vite)  
Backend: FastAPI (Python)  
Database: MySQL  
Deploy: Lokal

## Prasyaratan
- Node.js 18+ & npm
- Python 3.11+
- MySQL server lokal (bisa menggunakan xampp)


## Setup 1 klick Backend
1. Setting database `backend/.env`
2. klick file Backend.bat


## Setup Manual Backend
1. Masuk folder `backend/`.
2. Buat virtualenv (opsional) dan install depedensi:
   ```bash
   pip install -r requirements.txt
   ```
3. Buat database di xamp:
   ```sql
   CREATE DATABASE mini_ecommerce CHARACTER SET utf8mb4;
   ```
4. Setting `backend/.env` untuk DB dan isi kredensial DB.

5. Inisialisasi tabel & seed data:
   ```bash
   python -m app.seed
   ```
6. Jalankan API:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
7. Buka `http://127.0.0.1:8000/docs`.


## Setup 1 klick Frontend
1. Klick file `frontend/SETUP FRONTEND.bat` (lakukan hanya sekali).
2. Klick file `frontend/RUN FRONTEND.bat`
3. Buka `http://localhost:5173`.


## Setup manual Frontend
1. Masuk folder `frontend/`.
2. Install depedensi:
   ```bash
   npm install
   ```
3. Jalankan dev server:
   ```bash
   npm run dev
   ```
4. Buka `http://localhost:5173`.


## Fitur
- List produk dengan filter kategori, harga min/max, sort, pencarian, dan paginasi.
- Keranjang, checkout guest (email validasi) & user login (JWT).
- Validasi input di frontend & backend.
- Simpan order ke database, kurangi stok, tampilkan konfirmasi & daftar pesanan.
- Cek pesanan: user login (token) atau guest via email.
- Optimasi: lazy-load gambar, debouncing filter, memoization kartu produk, state management via Context + Reducer.

## Catatan
- SESUAIKAN NAMA DATABASE DENGAN "mini_ecommerce CHARACTER SET utf8mb4"
- SESUAIKAN KREDENSIAL DATABASE DI `backend/.env`