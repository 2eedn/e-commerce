@echo off

:: Setup Backend
echo Menyiapkan Backend...

:: Masuk ke folder backend
cd backend
if errorlevel 1 exit /b

:: Membuat virtual environment dan menginstall dependensi
echo Membuat virtual environment dan menginstall dependensi...
pip install -r requirements.txt

:: Konfirmasi apakah database mini_ecommerce sudah dibuat
echo =======================================================
echo Apakah Anda sudah membuat database mini_ecommerce? (y/n)
set /p KONFIRMASI=

if /I "%KONFIRMASI%"=="y" (
    echo 
    echo Kita lanjutkan ke setup selanjutnya
) else (
    echo Anda belum membuat database, silakan buat database dahulu.
    exit /b
)


:: Inisialisasi tabel dan seed data
echo Menginisialisasi tabel dan menambahkan data...
python -m app.seed

:: Menjalankan API
echo Menjalankan API...
python -m uvicorn app.main:app --reload
