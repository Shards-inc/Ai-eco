from cryptography.fernet import Fernet
import os

class EncryptionManager:
    def __init__(self, key: bytes = None):
        self.key = key or os.getenv("ENCRYPTION_KEY").encode()
        self.cipher = Fernet(self.key)

    def encrypt(self, data: str) -> str:
        return self.cipher.encrypt(data.encode()).decode()

    def decrypt(self, token: str) -> str:
        return self.cipher.decrypt(token.encode()).decode()
