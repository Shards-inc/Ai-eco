import uvicorn
from fastapi import FastAPI

class ModelServer:
    def __init__(self, model_path):
        self.app = FastAPI()
        self.load_model(model_path)

    def load_model(self, path):
        # Logic to load quantized weights
        pass

    def run(self):
        uvicorn.run(self.app, host="0.0.0.0", port=9000)