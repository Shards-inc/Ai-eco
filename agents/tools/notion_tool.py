import os
import requests

class NotionTool:
    def __init__(self, token: str = None):
        self.token = token or os.getenv("NOTION_TOKEN")
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28"
        }

    def create_page(self, database_id: str, properties: dict):
        url = "https://api.notion.com/v1/pages"
        payload = {
            "parent": {"database_id": database_id},
            "properties": properties
        }
        return requests.post(url, json=payload, headers=self.headers).json()
