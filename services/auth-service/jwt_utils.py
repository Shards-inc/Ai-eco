import jwt

def create_access_token(data):
    return jwt.encode(data, "SECRET", algorithm="HS256")