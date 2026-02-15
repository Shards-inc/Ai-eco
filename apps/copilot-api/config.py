import os

class Settings:
    PROJECT_NAME: string = "Copilot API"
    API_V1_STR: string = "/api/v1"
    SECRET_KEY: string = os.getenv("SECRET_KEY", "changeme")

settings = Settings()