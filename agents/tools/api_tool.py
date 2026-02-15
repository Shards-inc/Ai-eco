import requests

class APITool:
    def call_service(self, endpoint, method="GET", payload=None):
        if method == "GET":
            return requests.get(endpoint).json()
        return requests.post(endpoint, json=payload).json()