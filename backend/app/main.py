from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import router

# Inisialisasi tabel di database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mini E-Commerce")

# CORS untuk frontend lokal (Vite default: 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Mini E-Commerce API"}

# Daftarkan router utama
app.include_router(router)
