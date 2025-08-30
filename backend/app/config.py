from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DB_HOST: str = "127.0.0.1"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "mini_ecommerce"
    JWT_SECRET: str = "supersecretkey"
    JWT_ALG: str = "HS256"

    class Config:
        env_file = ".env"

@lru_cache
def get_settings():
    return Settings()
