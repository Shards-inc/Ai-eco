import requests
from bs4 import BeautifulSoup

class BrowserTool:
    def search_and_scrape(self, url):
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup.get_text()[:2000] # Limit tokens