
# Mini E-Commerce (Lokal, tanpa Docker)

**Frontend**: React + TypeScript + Tailwind (Vite)  
**Backend**: FastAPI (Python)  
**Database**: MySQL  
**Deploy**: Lokal

## Daftar Isi

- [Prasyaratan](#prasyaratan)
- [Instalasi](#instalasi)
- [Setup Backend](#setup-backend)
- [Setup Frontend](#setup-frontend)
- [Cara Menjalankan Proyek](#cara-menjalankan-proyek)
- [Struktur Direktori](#struktur-direktori)


## Prasyaratan

Sebelum memulai, pastikan Anda memiliki perangkat lunak berikut yang terinstal di sistem Anda:

- **Node.js 18+** dan **npm** (untuk frontend)
- **Python 3.11+** (untuk backend)
- **MySQL Server** lokal (bisa menggunakan XAMPP atau sejenisnya)

## Instalasi

1. **Clone repositori**:

    Clone repositori ini ke komputer lokal Anda dengan perintah berikut:

    ```bash
    git clone https://github.com/2eedn/e-commerce.git
    ```

2. **Masuk ke direktori proyek**:

    ```bash
    cd e-commerce
    ```

## Setup Backend

### Setup 1-Klik Backend

Jika Anda ingin setup backend dengan cepat, ikuti langkah-langkah berikut:

1. **Setting database**: Edit file `backend/.env` untuk mengatur konfigurasi database.
2. **Jalankan file**: Klik ganda pada file `Backend.bat` untuk otomatisasi setup.

### Setup Manual Backend

Jika Anda lebih suka setup secara manual:

1. **Masuk ke folder backend**:

    ```bash
    cd backend
    ```

2. **Buat virtual environment (opsional) dan install dependensi**:

    ```bash
    pip install -r requirements.txt
    ```

3. **Buat database di XAMPP (MySQL)**:

    Jalankan perintah berikut di MySQL:

    ```sql
    CREATE DATABASE mini_ecommerce CHARACTER SET utf8mb4;
    ```

4. **Setting konfigurasi database**: Edit file `backend/.env` untuk mengisi kredensial database Anda.

5. **Inisialisasi tabel dan seed data**:

    Jalankan perintah berikut untuk menginisialisasi tabel dan mengisi data awal:

    ```bash
    python -m app.seed
    ```

6. **Jalankan API**:

    Jalankan FastAPI server dengan perintah:

    ```bash
    python -m uvicorn app.main:app --reload
    ```

7. **Akses API**: Buka [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) untuk melihat dokumentasi API.

## Setup Frontend

### Setup 1-Klik Frontend

Jika Anda ingin setup frontend dengan cepat, ikuti langkah-langkah berikut:

1. **Klik file**: Klik ganda pada file `frontend/SETUP FRONTEND.bat` untuk otomatisasi setup.

### Setup Manual Frontend

Jika Anda lebih suka setup secara manual:

1. **Masuk ke folder frontend**:

    ```bash
    cd frontend
    ```

2. **Instal dependensi frontend**:

    Instal dependensi frontend menggunakan npm atau yarn.

    Jika Anda menggunakan npm:

    ```bash
    npm install
    ```

    Jika Anda menggunakan yarn:

    ```bash
    yarn install
    ```

3. **Jalankan frontend**:

    Jalankan aplikasi frontend dengan perintah berikut:

    Jika menggunakan npm:

    ```bash
    npm run dev
    ```

    Jika menggunakan yarn:

    ```bash
    yarn dev
    ```

    Aplikasi frontend akan berjalan di `http://localhost:5173`.

## Cara Menjalankan Proyek

Setelah setup selesai, berikut adalah cara menjalankan backend dan frontend secara bersamaan:

1. **Jalankan Backend**: Ikuti langkah-langkah di [Setup Backend](#setup-backend).
2. **Jalankan Frontend**: Ikuti langkah-langkah di [Setup Frontend](#setup-frontend).

Pastikan kedua server (backend dan frontend) berjalan, dan Anda dapat mengakses aplikasi di:

- **Backend API**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Frontend UI**: [http://localhost:5173](http://localhost:5173)

## Struktur Direktori

Struktur direktori dari proyek ini adalah sebagai berikut:

```
e-commerce/
├── backend/             # Kode sumber backend (FastAPI)
│   ├── app/             # Aplikasi utama backend
│   ├── .env             # File konfigurasi environment
│   ├── requirements.txt # Daftar dependensi Python
│   └── Backend.bat      # Script untuk setup backend otomatis
├── frontend/            # Kode sumber frontend (React + TypeScript)
│   ├── src/             # Kode sumber aplikasi frontend
│   ├── package.json     # Daftar dependensi npm
│   └── SETUP FRONTEND.bat  # Script untuk setup frontend otomatis
├── README.md            # Dokumentasi proyek
```




