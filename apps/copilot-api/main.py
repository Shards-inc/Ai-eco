from fastapi import FastAPI, Request
import time
import logging
from .app import app as core_app

# Initialize the main API application
app = FastAPI(
    title="Sovereign AI Copilot API",
    description="Primary gateway for enterprise agent orchestration",
    version="2026.1.0"
)

# Attach routes from the core application logic
app.mount("/api/v1", core_app)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.get("/")
async def root():
    return {
        "service": "Copilot API",
        "status": "active",
        "timestamp": time.time()
    }
