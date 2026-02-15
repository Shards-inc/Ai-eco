import os
import requests
from typing import List, Dict

class SearchTool:
    """
    Grounding tool for agents to fetch real-time web data.
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("SERPER_API_KEY")
        self.base_url = "https://google.serper.dev/search"

    def execute(self, query: str) -> List[Dict]:
        headers = {'X-API-KEY': self.api_key, 'Content-Type': 'application/json'}
        payload = {"q": query}
        response = requests.post(self.base_url, headers=headers, json=payload)
        
        if response.status_code == 200:
            results = response.json().get('organic', [])
            return [{"title": r['title'], "link": r['link'], "snippet": r['snippet']} for r in results[:5]]
        return []
