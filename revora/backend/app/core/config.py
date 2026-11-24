from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "REVORA"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "revora_secret_jwt_key_change_in_production_environment_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # PostgreSQL + PostGIS Database URL
    DATABASE_URL: str = "postgresql://revora_user:revora_pass@localhost:5432/revora_db"

    # CORS configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
