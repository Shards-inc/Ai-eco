from fastapi import FastAPI
from routes import router

app = FastAPI(title="AI Copilot API")
app.include_router(router)

@app.get("/health")
def health():
    return {"status": "operational"}